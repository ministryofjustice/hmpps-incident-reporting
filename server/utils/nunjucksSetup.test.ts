import express from 'express'
import nunjucks from 'nunjucks'

import config from '../config'
import { fakeClock, resetClock } from '../testutils/fakeJestClock'
import nunjucksSetup from './nunjucksSetup'

describe('nunjucks context', () => {
  beforeAll(() => {
    const app = express()
    nunjucksSetup(app)
  })

  describe('callAsMacro', () => {
    it('should call a macro without parameters', () => {
      const output = nunjucks
        .renderString(
          `
            {% macro existingMacro() %}
              macro output
            {% endmacro %}

            {{ callAsMacro('existingMacro')() }}
          `,
          {},
        )
        .trim()
      expect(output).toEqual('macro output')
    })

    it('should call a macro with parameters', () => {
      const output = nunjucks
        .renderString(
          `
            {% macro existingMacro(param1, param2) %}
              macro output [{{ param1 }}, {{param2}}]
            {% endmacro %}

            {{ callAsMacro('existingMacro')(1, 2) }}
          `,
          {},
        )
        .trim()
      expect(output).toEqual('macro output [1, 2]')
    })

    it.each([undefined, null, 'missingMacro'])(
      'should throw an error when called with an unknown macro name `%s`',
      macroName => {
        expect(() => {
          nunjucks.renderString('{{ callAsMacro(macroName)() }}', { macroName })
        }).toThrow(`Macro ${macroName} not found`)
      },
    )
  })

  describe('panic extension', () => {
    it('should throw an error instead of rendering the template', () => {
      expect(() => {
        nunjucks.renderString(
          `
            {% panic "unreachable" %}
          `,
          {},
        )
      }).toThrow('unreachable')
    })
  })

  describe('now() global', () => {
    beforeAll(fakeClock)

    afterAll(resetClock)

    it('should return current date/time', () => {
      const output = nunjucks
        .renderString(
          `
            {{ now() }}
          `,
          {},
        )
        .trim()
      expect(output).toContain('2023')
    })
  })

  describe('isPrisonActiveInService() global', () => {
    let previousActivePrisons: string[]

    beforeAll(() => {
      previousActivePrisons = config.activePrisons
    })

    afterAll(() => {
      config.activePrisons = previousActivePrisons
    })

    it('should call helper function', () => {
      config.activePrisons = ['MDI', 'LEI']

      let output = nunjucks
        .renderString(
          `
            {{ isPrisonActiveInService('MDI') }}
          `,
          {},
        )
        .trim()
      expect(output).toEqual('true')

      output = nunjucks
        .renderString(
          `
            {{ isPrisonActiveInService('BXI') }}
          `,
          {},
        )
        .trim()
      expect(output).toEqual('false')
    })
  })

  describe('mergeObjects filter', () => {
    it('should merge multiple objects', () => {
      const output = nunjucks
        .renderString(
          `
            {% set merged = mergeObjects({a: 1}, {b: 20}, {c: 3}, {b: 2}) %}
            len={{ merged | length }}, a={{ merged.a }}, b={{ merged.b }}, c={{ merged.c }}
          `,
          {},
        )
        .trim()
      expect(output).toEqual('len=3, a=1, b=2, c=3')
    })

    it('should work with no inputs', () => {
      const output = nunjucks
        .renderString(
          `
            {% set merged = mergeObjects() %}
            len={{ merged | length }}
          `,
          {},
        )
        .trim()
      expect(output).toEqual('len=0')
    })
  })
})

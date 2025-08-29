import express from 'express'
import nunjucks from 'nunjucks'

import { fakeClock, resetClock } from '../testutils/fakeJestClock'
import nunjucksSetup from './nunjucksSetup'
import { mockPecsRegions } from '../data/testData/pecsRegions'
import { setActiveAgencies } from '../data/activeAgencies'
import { defaultActiveAgencies } from '../routes/testutils/appSetup'

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

  describe('active-in-service location globals', () => {
    beforeAll(() => {
      mockPecsRegions()
    })

    it('should call helper function', () => {
      setActiveAgencies(['LEI', 'MDI'])
      for (const template of [`{{ isLocationActiveInService('MDI') }}`, `{{ isLocationActiveInService('LEI') }}`]) {
        const output = nunjucks.renderString(template, {}).trim()
        expect(output).toEqual('true')
      }
      for (const template of [`{{ isLocationActiveInService('NORTH') }}`, `{{ isLocationActiveInService('BXI') }}`]) {
        const output = nunjucks.renderString(template, {}).trim()
        expect(output).toEqual('false')
      }

      setActiveAgencies(defaultActiveAgencies)
      const output = nunjucks.renderString(`{{ isLocationActiveInService('NORTH') }}`, {}).trim()
      expect(output).toEqual('true')
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

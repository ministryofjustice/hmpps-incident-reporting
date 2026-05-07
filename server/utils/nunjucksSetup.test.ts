import express from 'express'
import nunjucks from 'nunjucks'

import { fakeClock, resetClock } from '../testutils/fakeJestClock'
import nunjucksSetup from './nunjucksSetup'

describe('nunjucks context', () => {
  beforeAll(() => {
    const app = express()
    nunjucksSetup(app)
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

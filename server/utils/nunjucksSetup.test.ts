import express from 'express'
import nunjucks from 'nunjucks'
import request from 'supertest'

import nunjucksSetup from './nunjucksSetup'

describe('nunjucks context', () => {
  let app: express.Express

  beforeEach(() => {
    app = express()
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

  describe('getFromContext', () => {
    let templateContents: string

    beforeEach(() => {
      // mimics middleware manipulating locals
      app.use((req, res, next) => {
        res.locals.systemToken = 'system-token'
        res.locals.user = { token: 'user-token', authSource: 'hmpps-auth' }

        next()
      })

      // mimics request handlers providing a context
      app.get('/', (req, res) => {
        const context = {
          ...res.locals,
          firstName: 'John',
        }
        res.send(nunjucks.renderString(templateContents, context).trim())
      })
    })

    it('should return a parameter from context', () => {
      templateContents = `
        {{ getFromContext('firstName') }}
      `
      return request(app)
        .get('/')
        .expect(res => {
          expect(res.text).toEqual('John')
        })
    })

    it('should return a parameter from locals', () => {
      templateContents = `
        {{ getFromContext('systemToken') }}
      `
      return request(app)
        .get('/')
        .expect(res => {
          expect(res.text).toEqual('system-token')
        })
    })

    it('should return a nested parameter from locals', () => {
      templateContents = `
        {{ getFromContext('user.token') }}
      `
      return request(app)
        .get('/')
        .expect(res => {
          expect(res.text).toEqual('user-token')
        })
    })
  })
})

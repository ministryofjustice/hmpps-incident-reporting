// eslint-disable-next-line max-classes-per-file
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import express from 'express'
import FormWizard from 'hmpo-form-wizard'
import request from 'supertest'

import { mockThrownError } from '../data/testData/thrownErrors'
import nunjucksSetup from '../utils/nunjucksSetup'
import { BaseController } from './base'

class TestController extends BaseController {
  protected errorMessage(error: FormWizard.Error, req: FormWizard.Request, res: express.Response): string {
    if (error.key === 'name' && error.type === 'required') {
      return `Enter your “${req.form.options.fields.name.label}”`
    }
    return super.errorMessage(error, req, res)
  }
}

describe('Base form wizard controller', () => {
  describe('Retrieving all values', () => {
    let controller: TestController

    const allFields: FormWizard.Fields = {
      name: { name: 'name', validate: ['required'] },
      email: { name: 'email', validate: ['required', 'email'] },
    }
    const options: FormWizard.Options = {
      route: '/',
      steps: { '/': { fields: ['name', 'email'] } },
      fields: allFields,
    }

    beforeEach(() => {
      controller = new TestController(options)
    })

    it('should collect values from all steps when using the session', () => {
      const req = {
        sessionModel: { get: jest.fn(fieldName => `value for “${fieldName}” from session`) },
        form: {
          options: { allFields },
          values: jest.fn(() => {
            throw new Error('request values should not be accessed')
          }),
        },
      } as unknown as FormWizard.Request

      const allValues = controller.getAllValues(req)
      expect(allValues).toHaveProperty('name', 'value for “name” from session')
      expect(allValues).toHaveProperty('email', 'value for “email” from session')
    })

    it('should collect values from current step when using the request form', () => {
      const req = {
        sessionModel: {
          get: jest.fn(() => {
            throw new Error('session should not be accessed')
          }),
        },
        form: { options: { allFields }, values: { name: 'name from request' } },
      } as unknown as FormWizard.Request

      const allValues = controller.getAllValues(req, false)
      expect(allValues).toHaveProperty('name', 'name from request')
      expect(allValues).toHaveProperty('email', undefined)
    })
  })

  describe('Error messages', () => {
    it.each([
      { scenario: 'generic', fieldName: 'email', expectedError: 'This field is required' },
      { scenario: 'controller-overridden', fieldName: 'name', expectedError: 'Enter your “Name”' },
    ])('should add $scenario human-readable message to error', ({ fieldName, expectedError }) => {
      const options: FormWizard.Options = {
        route: '/',
        steps: { '/': { fields: ['name', 'email'] } },
        fields: {
          name: { name: 'name', label: 'Name', validate: ['required'] },
          email: { name: 'email', label: 'Email', validate: ['required', 'email'] },
        },
      }
      const controller = new TestController(options)

      const req = {
        method: 'POST',
        sessionModel: jest.fn(),
        form: {
          options,
          values: { name: '', email: '' },
          errors: {},
        },
      } as unknown as FormWizard.Request
      const res = {} as express.Response

      const error = controller.validateField(fieldName, req, res)
      expect(error).toHaveProperty('message', expectedError)
    })

    it('should throw an error when no generic human-readable message is found for error type', () => {
      const options: FormWizard.Options = {
        route: '/',
        steps: { '/': { fields: ['mobile'] } },
        fields: {
          mobile: { name: 'mobile', validate: ['ukmobilephone'] },
        },
      }
      const controller = new TestController(options)

      const req = {
        method: 'POST',
        sessionModel: jest.fn(),
        form: {
          options,
          values: { mobile: 'n/a' },
          errors: {},
        },
      } as unknown as FormWizard.Request
      const res = {} as express.Response

      expect(() => {
        controller.validateField('mobile', req, res)
      }).toThrow('Error message not set for type')
    })

    it('should be able to convert an API error into a form wizard validation error', () => {
      const controller = new TestController({ route: '/', steps: {}, fields: {} })
      const apiError = mockThrownError({})
      const validationError = controller.convertIntoValidationError(apiError)
      expect(controller.isValidationError({ fieldName: validationError })).toBe(true)
      expect(validationError.key).toBeUndefined()
      expect(validationError.field).toBeUndefined()
      expect(validationError.type).toEqual('default')
      expect(validationError.message).toEqual('Sorry, there was a problem with your request')
    })
  })

  describe('Validation', () => {
    it.each(['tomorrow', '30/2/2025'])('should consider %p an invalid UK date', input => {
      const options: FormWizard.Options = {
        route: '/',
        steps: { '/': { fields: ['date'] } },
        fields: {
          date: { name: 'date', validate: ['ukDate'] },
        },
      }
      const controller = new TestController(options)

      const req = {
        method: 'POST',
        sessionModel: jest.fn(),
        form: {
          options,
          values: { date: input },
          errors: {},
        },
      } as unknown as FormWizard.Request
      const res = {} as express.Response

      const error = controller.validateField('date', req, res)
      expect(error).toHaveProperty('message', 'Enter a date')
    })

    it('should allow a blank if UK date is not required', () => {
      const options: FormWizard.Options = {
        route: '/',
        steps: { '/': { fields: ['date'] } },
        fields: {
          date: { name: 'date', validate: ['ukDate'] },
        },
      }
      const controller = new TestController(options)

      const req = {
        method: 'POST',
        sessionModel: jest.fn(),
        form: {
          options,
          values: { date: '' },
          errors: {},
        },
      } as unknown as FormWizard.Request
      const res = {} as express.Response

      const error = controller.validateField('date', req, res)
      expect(error).toBeUndefined()
    })

    it.each(['now', '10am', '2310'])('should consider %p an invalid UK time', input => {
      const options: FormWizard.Options = {
        route: '/',
        steps: { '/': { fields: ['time'] } },
        fields: {
          time: { name: 'time', validate: ['ukTime'] },
        },
      }
      const controller = new TestController(options)

      const req = {
        method: 'POST',
        sessionModel: jest.fn(),
        form: {
          options,
          values: { time: input },
          errors: {},
        },
      } as unknown as FormWizard.Request
      const res = {} as express.Response

      const error = controller.validateField('time', req, res)
      expect(error).toHaveProperty('message', 'Enter a time')
    })

    it('should allow a blank if UK time is not required', () => {
      const options: FormWizard.Options = {
        route: '/',
        steps: { '/': { fields: ['time'] } },
        fields: {
          time: { name: 'time', validate: ['ukTime'] },
        },
      }
      const controller = new TestController(options)

      const req = {
        method: 'POST',
        sessionModel: jest.fn(),
        form: {
          options,
          values: { time: '' },
          errors: {},
        },
      } as unknown as FormWizard.Request
      const res = {} as express.Response

      const error = controller.validateField('time', req, res)
      expect(error).toBeUndefined()
    })
  })

  describe('Sessions', () => {
    function makeApp(shouldClearSessionOnSuccess: boolean): express.Express {
      const app = express()

      // cookies needed for form wizard session handling
      app.use(cookieParser())
      app.use(cookieSession({ keys: [''] }))

      // accept POSTs
      app.use(express.json())

      // CSRF middleware needed for base controller to forward secrets properly
      app.use((_req, res, next) => {
        res.locals.csrfToken = 'csrf-token'
        next()
      })

      // template rendering middleware is expected to exist
      nunjucksSetup(app)

      class Controller extends BaseController {
        successHandler(req: FormWizard.Request, res: express.Response, next: express.NextFunction) {
          if (shouldClearSessionOnSuccess) {
            res.locals.clearSessionOnSuccess = true
          }

          super.successHandler(req, res, next)
        }
      }

      // debug route to inspect session contents
      app.get('/dump-session', (req, res) => {
        const sessionAsJson = JSON.stringify({
          ...req.session,
        })
        res.send(sessionAsJson)
      })

      const router = FormWizard(
        { '/': { fields: ['name'], entryPoint: true, next: '/dump-session' } },
        { name: { name: 'name', label: 'Name', validate: ['required'], component: 'govukInput' } },
        {
          name: 'test',
          journeyName: 'test',
          controller: Controller,
          template: 'partials/formWizardLayout',
          csrf: false,
        },
      )
      app.use('/', router)

      return app
    }

    it('should be cleared on success when locals flag is set', async () => {
      const app = makeApp(true)
      const agent = request.agent(app)

      await agent.get('/').expect(200)
      return agent
        .post('/')
        .send({ name: 'John' })
        .redirects(1)
        .expect(200)
        .expect(res => {
          const session = JSON.parse(res.text)

          // clearing wizard journey retains the keys in the session but the values are empty objects
          expect(session).toHaveProperty('hmpo-wizard-test', {})
          expect(session).toHaveProperty('hmpo-journey-test', {})
        })
    })

    it('should not be cleared on success when locals flag is absent', async () => {
      const app = makeApp(false)
      const agent = request.agent(app)

      await agent.get('/').expect(200)
      return agent
        .post('/')
        .send({ name: 'John' })
        .redirects(1)
        .expect(200)
        .expect(res => {
          const session = JSON.parse(res.text)

          // session model is not cleared and form value exists
          expect(session).toHaveProperty('hmpo-wizard-test')
          expect(session['hmpo-wizard-test']).toHaveProperty('name', 'John')

          // journey model is not cleared and history properties exist
          expect(session).toHaveProperty('hmpo-journey-test')
          expect(session['hmpo-journey-test']).toHaveProperty('lastVisited')
          expect(session['hmpo-journey-test']).toHaveProperty('history')
          expect(session['hmpo-journey-test']).toHaveProperty('registered-models')
        })
    })

    it('should not be cleared on error', async () => {
      const app = makeApp(true)
      const agent = request.agent(app)

      await agent.get('/').expect(200)
      await agent.post('/').send({ name: '' }).redirects(1).expect(200)
      await agent.get('/dump-session').expect(res => {
        const session = JSON.parse(res.text)

        // session model is not cleared and error properties exist
        expect(session).toHaveProperty('hmpo-wizard-test')
        expect(session['hmpo-wizard-test']).toHaveProperty('errors')
        expect(session['hmpo-wizard-test']).toHaveProperty('errorValues')

        // journey model is not cleared and history properties exist
        expect(session).toHaveProperty('hmpo-journey-test')
        expect(session['hmpo-journey-test']).toHaveProperty('lastVisited')
        expect(session['hmpo-journey-test']).toHaveProperty('registered-models')
      })
    })
  })
})

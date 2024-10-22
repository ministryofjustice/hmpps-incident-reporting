import type Express from 'express'
import FormWizard from 'hmpo-form-wizard'

import { mockThrownError } from '../data/testData/thrownErrors'
import { BaseController } from './index'

class TestController extends BaseController {
  protected errorMessage(error: FormWizard.Error): string {
    if (error.key === 'name' && error.type === 'required') {
      return 'Enter your name'
    }
    return super.errorMessage(error)
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
      { messageSource: 'generic', fieldName: 'email', expectedError: 'This field is required' },
      { messageSource: 'controller-overridden', fieldName: 'name', expectedError: 'Enter your name' },
    ])('should add $messageSource human-readable message to error', ({ fieldName, expectedError }) => {
      const options: FormWizard.Options = {
        route: '/',
        steps: { '/': { fields: ['name', 'email'] } },
        fields: {
          name: { name: 'name', validate: ['required'] },
          email: { name: 'email', validate: ['required', 'email'] },
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
      const res = {} as Express.Response

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
      const res = {} as Express.Response

      expect(() => {
        controller.validateField('mobile', req, res)
      }).toThrow('Error message not set for type')
    })

    it('should be able to convert an API error into a form wizard validation error', () => {
      const controller = new TestController({ route: '/', steps: {}, fields: {} })
      const apiError = mockThrownError({})
      const validationError = controller.convertIntoValidationError(apiError)
      expect(controller.isValidationError({ fieldName: validationError })).toBeTruthy()
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
      const res = {} as Express.Response

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
      const res = {} as Express.Response

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
      const res = {} as Express.Response

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
      const res = {} as Express.Response

      const error = controller.validateField('time', req, res)
      expect(error).toBeUndefined()
    })
  })
})

import type Express from 'express'
import type FormWizard from 'hmpo-form-wizard'

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

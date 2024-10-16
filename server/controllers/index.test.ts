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
})

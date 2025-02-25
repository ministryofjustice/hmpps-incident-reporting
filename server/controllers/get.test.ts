import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import express from 'express'
import FormWizard from 'hmpo-form-wizard'
import request from 'supertest'

import nunjucksSetup from '../utils/nunjucksSetup'
import { GetBaseController } from './get'

const fields: FormWizard.Fields = {
  name: {
    label: 'Name',
    validate: ['required'],
    component: 'govukInput',
  },
  email: {
    label: 'Email',
    component: 'govukInput',
  },
}

const steps: FormWizard.Steps = {
  '/': {
    entryPoint: true,
    fields: ['name', 'email'],
    next: '/done',
  },
}

const successHandlerSpy = jest.fn()

class TestController extends GetBaseController {
  successHandler(req: FormWizard.Request, res: express.Response, next: express.NextFunction): void {
    const allValues = this.getAllValues(req, false)
    successHandlerSpy(allValues)

    super.successHandler(req, res, next)
  }
}

const config: FormWizard.Config = {
  controller: TestController,
  template: 'partials/formWizardLayout',
}

describe('GET / query string base form wizard controller', () => {
  let app: express.Express

  beforeEach(() => {
    app = express()

    // cookies needed for form wizard session handling
    app.use(cookieParser())
    app.use(cookieSession({ keys: [''] }))

    // CSRF middleware needed for base controller to forward secrets properly
    app.use((_req, res, next) => {
      res.locals.csrfToken = 'csrf-token'
      next()
    })

    // middleware to render form so that error handling can be tested
    nunjucksSetup(app)

    const router = FormWizard(steps, fields, config)
    app.use('/', router)

    successHandlerSpy.mockReset()
  })

  it('should forbid POST calls', () => {
    return request(app)
      .post('/')
      .send({ name: 'John' })
      .expect(405)
      .expect(() => {
        expect(successHandlerSpy).not.toHaveBeenCalled()
      })
  })

  it('should display form if no fields had been submitted', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect(res => {
        expect(res.text).not.toContain('This field is required')
        expect(res.text).toContain('Email')

        expect(successHandlerSpy).not.toHaveBeenCalled()
      })
  })

  it('should show error messages for unsuccessful form submissions', () => {
    return request(app)
      .get('/')
      .query({ name: '', email: 'john@localhost' })
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('This field is required')

        expect(successHandlerSpy).not.toHaveBeenCalled()
      })
  })

  it('should handle successful form submissions', () => {
    return request(app)
      .get('/')
      .query({ name: 'John', email: '' })
      .expect(res => {
        expect(res.headers.location).toEqual('/done')

        expect(successHandlerSpy).toHaveBeenCalledWith({ name: 'John', email: '' })
      })
  })
})

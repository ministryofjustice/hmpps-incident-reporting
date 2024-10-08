import { Router } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { Forbidden, Unauthorized } from 'http-errors'
import request from 'supertest'

import { appWithAllRoutes } from './routes/testutils/appSetup'
import * as routes from './routes'

jest.mock('./routes/index')

let mockedRoutes: jest.Mocked<typeof routes>['default']

beforeEach(() => {
  mockedRoutes = (routes as unknown as jest.Mocked<typeof routes>).default
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Error handling', () => {
  describe('when requesting a missing page', () => {
    beforeEach(() => {
      // there are no routes in this app
      mockedRoutes.mockReturnValue(Router())
    })

    it('should render content with stack in dev mode', () => {
      return request(appWithAllRoutes({}))
        .get('/unknown')
        .expect(404)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Page not found')
          expect(res.text).toContain('NotFoundError: Not Found')
          expect(res.text).not.toContain('Sorry, there is a problem with the service')
        })
    })

    it('should render content without stack in production mode', () => {
      return request(appWithAllRoutes({ production: true }))
        .get('/unknown')
        .expect(404)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Page not found')
          expect(res.text).not.toContain('NotFoundError: Not Found')
          expect(res.text).not.toContain('Sorry, there is a problem with the service')
        })
    })
  })

  describe('should redirect to sign out route', () => {
    it.each([
      { description: 'an unauthorised', error: Unauthorized },
      { description: 'a forbidden', error: Forbidden },
    ])('when $description is caught', ({ error }) => {
      // there is a protected route that raises an auth error and a sign-out route
      const router = Router()
      router.get('/protected', () => {
        // eslint-disable-next-line new-cap
        throw new error()
      })
      router.get('/sign-out', (req, res) => {
        res.send('signed out')
      })
      mockedRoutes.mockReturnValue(router)

      return request(appWithAllRoutes({}))
        .get('/protected')
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.redirects[0]).toContain('/sign-out')
          expect(res.text).toEqual('signed out')
        })
    })
  })

  describe('of errors from form wizard', () => {
    beforeEach(() => {
      const router = Router()
      const steps: FormWizard.Steps = {
        // entrypoint has no fields so redirects to name
        '/': {
          entryPoint: true,
          resetJourney: true,
          template: 'pages/index',
          next: 'name',
        },
        // page 2 includes required name field
        '/name': {
          fields: ['name'],
          template: 'pages/index',
          next: 'done',
        },
        // page 3 requires page 2 to be valid (name field must be supplied)
        '/done': {
          noPost: true,
          template: 'pages/index',
        },
      }
      const fields: FormWizard.Fields = { name: { validate: ['required'] } }
      const formConfig: FormWizard.Config = { name: 'redirect-test', checkSession: false, csrf: false }
      router.use(FormWizard(steps, fields, formConfig))
      mockedRoutes.mockReturnValue(router)
    })

    it('should handle redirect to a previous invalid step', async () => {
      const agent = request.agent(appWithAllRoutes({}))
      await agent
        .post('/')
        .expect(200)
        .redirects(1)
        .expect(res => {
          expect(res.redirects[0]).toContain('/name')
        })
      await agent
        .get('/done')
        .expect(200)
        .redirects(1)
        .expect(res => {
          expect(res.redirects[0]).toContain('/name')
        })
    })
  })
})

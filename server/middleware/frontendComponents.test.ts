import type { NextFunction, Request, Response } from 'express'
import nock from 'nock'

import config from '../config'
import type { Services } from '../services'
import FrontendComponentsClient from '../data/frontendComponentsClient'
import { mockCaseload, mockFrontendComponentResponse } from '../data/testData/frontendComponents'
import frontendComponents from './frontendComponents'

describe('Frontend components middleware', () => {
  const fakeApiClient = nock(config.apis.frontendComponents.url)
  const frontendComponentsMiddleware = frontendComponents({
    frontendComponentsClient: new FrontendComponentsClient(),
  } as Services)
  const userToken = 'user-token'

  afterEach(() => {
    nock.cleanAll()
  })

  it('should load frontend components', async () => {
    fakeApiClient
      .get('/components')
      .query({ component: ['header', 'footer'] })
      .matchHeader('authorization', `Bearer ${userToken}`)
      .reply(
        200,
        mockFrontendComponentResponse({
          header: {
            html: 'header html',
            css: ['/header.css'],
            javascript: ['/header.js'],
          },
          footer: {
            html: 'footer html',
            css: ['/footer.css', '/footer-2.css'],
            javascript: ['/footer.js'],
          },
        }),
      )

    const req = {} as Request
    const res = { locals: { user: { token: userToken } } } as Response
    const next: NextFunction = jest.fn()
    await frontendComponentsMiddleware(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(res.locals.feComponents).toEqual({
      header: 'header html',
      footer: 'footer html',
      cssIncludes: ['/header.css', '/footer.css', '/footer-2.css'],
      jsIncludes: ['/header.js', '/footer.js'],
    })
    expect(res.locals.user.activeCaseLoad).toStrictEqual(mockCaseload)
    expect(res.locals.user.caseLoads).toStrictEqual([mockCaseload])
  })

  it('should call next request handler even if frontend components failed to load', async () => {
    fakeApiClient
      .get('/components')
      .query({ component: ['header', 'footer'] })
      .matchHeader('authorization', `Bearer ${userToken}`)
      .reply(401, { status: 401, userMessage: 'Unauthorized', developerMessage: 'Unauthorized' })

    const req = {} as Request
    const res = { locals: { user: { token: userToken } } } as Response
    const next: NextFunction = jest.fn()
    await frontendComponentsMiddleware(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(res.locals.feComponents).toBeUndefined()
    expect(res.locals.user.activeCaseLoad).toBeUndefined()
    expect(res.locals.user.caseLoads).toBeUndefined()
  })
})

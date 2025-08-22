import type { Express } from 'express'
import type { Response } from 'superagent'

import { stubFor } from './wiremock'
import type { AvailableComponent, Component } from '../../server/data/frontendComponentsClient'
import { mockFrontendComponentResponse } from '../../server/data/testData/frontendComponents'
import { mockReportingOfficer } from '../../server/data/testData/users'

const stubComponents = (
  user: Express.User,
  components: Partial<Record<AvailableComponent, Component>> = {},
): Promise<Response> =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: '/frontendComponents/components',
      queryParameters: {
        component: { includes: Object.keys(components).map(component => ({ equalTo: component })) },
      },
    },
    response: {
      headers: { 'Content-Type': 'application/json' },
      jsonBody: mockFrontendComponentResponse(user, components),
    },
  })

const stubCSS = (name: AvailableComponent, css: string): Promise<Response> =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/frontendComponents/${name}.css`,
    },
    response: {
      headers: {
        'Content-Type': 'text/css',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
      body: css,
    },
  })

const stubJavascript = (name: AvailableComponent, js: string): Promise<Response> =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: `/frontendComponents/${name}.js`,
    },
    response: {
      headers: {
        'Content-Type': 'text/javascript',
        'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
      body: js,
    },
  })

export default {
  stubFallbackHeaderAndFooter({ user = mockReportingOfficer }: { user?: Express.User } = {}): Promise<Response> {
    return stubComponents(user)
  },
  stubFrontendComponentsHeaderAndFooter({ user = mockReportingOfficer }: { user?: Express.User } = {}): Promise<
    Response[]
  > {
    return Promise.all([
      stubCSS('header', 'header { background: red }'),
      stubCSS('footer', 'footer { background: yellow }'),
      stubJavascript('header', 'window.FrontendComponentsHeaderDidLoad = true;'),
      stubJavascript('footer', 'window.FrontendComponentsFooterDidLoad = true;'),
      stubComponents(user, {
        header: {
          html: '<header>HEADER</header>',
          css: ['http://localhost:9091/frontendComponents/header.css'],
          javascript: ['http://localhost:9091/frontendComponents/header.js'],
        },
        footer: {
          html: '<footer>FOOTER</footer>',
          css: ['http://localhost:9091/frontendComponents/footer.css'],
          javascript: ['http://localhost:9091/frontendComponents/footer.js'],
        },
      }),
    ])
  },
  stubFrontendComponentsApiPing(): Promise<Response> {
    return stubFor({
      request: {
        method: 'GET',
        urlPath: '/frontendComponents/ping',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: 'UP' },
      },
    })
  },
}

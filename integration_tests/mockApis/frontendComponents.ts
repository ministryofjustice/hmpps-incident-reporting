import type { Response } from 'superagent'

import { stubFor } from './wiremock'

const stubHeaderFail = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: '/components/header',
    },
    response: {
      status: 500,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    },
  })

const stubFooterFail = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: '/components/footer',
    },
    response: {
      status: 500,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    },
  })

export default {
  stubFrontendComponentsFail: (): Promise<[Response, Response]> => Promise.all([stubHeaderFail(), stubFooterFail()]),
}

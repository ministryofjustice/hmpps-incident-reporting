import config from '../config'
import RestClient from './restClient'
import type { AgencyType } from './prisonApi'

export interface Component {
  html: string
  css: string[]
  javascript: string[]
}

export type AvailableComponent = 'header' | 'footer'

export interface CaseLoad {
  caseLoadId: string
  description: string
  type: AgencyType
  caseloadFunction: string
  currentlyActive: boolean
}

export interface Service {
  id: string
  heading: string
  description: string
  href: string
}

export interface ComponentsResponse extends Record<AvailableComponent, Component> {
  meta: {
    activeCaseLoad: CaseLoad
    caseLoads: CaseLoad[]
    services: Service[]
  }
}

export default class FrontendComponentsClient {
  private static restClient(token: string): RestClient {
    return new RestClient('HMPPS Components Client', config.apis.frontendComponents, token)
  }

  getComponents<T extends AvailableComponent[]>(
    components: T,
    userToken: string,
  ): Promise<Pick<ComponentsResponse, 'meta' | T[number]>> {
    return FrontendComponentsClient.restClient(userToken).get({
      path: '/components',
      query: { component: components },
      headers: { 'x-user-token': userToken },
    })
  }
}

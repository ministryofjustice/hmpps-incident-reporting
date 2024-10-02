import logger from '../../logger'
import config from '../config'
import RestClient from './restClient'

export interface Component {
  html: string
  css: string[]
  javascript: string[]
}

export type AvailableComponent = 'header' | 'footer'

type CaseLoad = {
  caseLoadId: string
  description: string
  type: string
  caseloadFunction: string
  currentlyActive: boolean
}

type Service = {
  description: string
  heading: string
  href: string
  id: string
}

export interface FrontendComponentsMeta {
  activeCaseLoad: CaseLoad
  caseLoads: CaseLoad[]
  services: Service[]
}

export interface FrontendComponentsResponse {
  header?: Component
  footer?: Component
  meta: FrontendComponentsMeta
}

export default class FrontendComponentsClient {
  private static restClient(token: string): RestClient {
    return new RestClient('HMPPS Components Client', config.apis.frontendComponents, token)
  }

  getComponent(component: AvailableComponent, userToken: string): Promise<Component> {
    logger.info(`Getting frontend component ${component}`)
    return FrontendComponentsClient.restClient(userToken).get<Component>({
      path: `/${component}`,
      headers: { 'x-user-token': userToken },
    })
  }

  getComponents<T extends AvailableComponent[]>(components: T, userToken: string): Promise<FrontendComponentsResponse> {
    return FrontendComponentsClient.restClient(userToken).get<FrontendComponentsResponse>({
      path: '/components',
      query: `component=${components.join('&component=')}`,
      headers: { 'x-user-token': userToken },
    })
  }
}

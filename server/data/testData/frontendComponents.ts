import type { AvailableComponent, CaseLoad, Component, ComponentsResponse } from '../frontendComponentsClient'
import { moorland } from './prisonApi'

const emptyComponent: Component = {
  html: '',
  css: [],
  javascript: [],
}

const caseload: CaseLoad = {
  caseLoadId: moorland.agencyId,
  description: moorland.description,
  type: moorland.agencyType,
  caseloadFunction: 'GENERAL',
  currentlyActive: true,
}

// eslint-disable-next-line import/prefer-default-export
export function mockFrontendComponentResponse(
  components: Partial<Record<AvailableComponent, Component>> = {},
): ComponentsResponse {
  return {
    header: emptyComponent,
    footer: emptyComponent,
    ...components,
    meta: {
      activeCaseLoad: caseload,
      caseLoads: [caseload],
      services: [],
    },
  }
}

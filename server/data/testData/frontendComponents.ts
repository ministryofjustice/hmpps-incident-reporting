import type { AvailableComponent, CaseLoad, Component, ComponentsResponse } from '../frontendComponentsClient'
import { moorland } from './prisonApi'

const emptyComponent: Component = {
  html: '',
  css: [],
  javascript: [],
}

export const mockCaseload: CaseLoad = {
  caseLoadId: moorland.agencyId,
  description: moorland.description,
  type: moorland.agencyType,
  caseloadFunction: 'GENERAL',
  currentlyActive: true,
}

export function mockFrontendComponentResponse(
  components: Partial<Record<AvailableComponent, Component>> = {},
): ComponentsResponse {
  return {
    header: emptyComponent,
    footer: emptyComponent,
    ...components,
    meta: {
      activeCaseLoad: mockCaseload,
      caseLoads: [mockCaseload],
      services: [],
    },
  }
}

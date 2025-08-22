import type { Express } from 'express'

import type { AvailableComponent, CaseLoad, Component, ComponentsResponse } from '../frontendComponentsClient'
import type { Agency } from '../prisonApi'
import { moorland } from './prisonApi'

const emptyComponent: Component = {
  html: '',
  css: [],
  javascript: [],
}

export function makeMockCaseload(prison: Agency, currentlyActive = true): CaseLoad {
  return {
    caseLoadId: prison.agencyId,
    description: prison.description,
    type: prison.agencyType,
    caseloadFunction: 'GENERAL',
    currentlyActive,
  }
}

/** Moorland caseload */
export const mockCaseload = makeMockCaseload(moorland)

export function mockFrontendComponentResponse(
  user: Express.User,
  components: Partial<Record<AvailableComponent, Component>> = {},
): ComponentsResponse {
  const caseLoads = user?.caseLoads ?? [mockCaseload]
  return {
    header: emptyComponent,
    footer: emptyComponent,
    ...components,
    meta: {
      activeCaseLoad: caseLoads[0],
      caseLoads,
      services: [],
    },
  }
}

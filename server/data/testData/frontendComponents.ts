import type { Express } from 'express'

import type { AvailableComponent, CaseLoad, Component, ComponentsResponse } from '../frontendComponentsClient'
import { AgencyType } from '../constants'
import { moorland } from './prisonRegister'

const emptyComponent: Component = {
  html: '',
  css: [],
  javascript: [],
}

/** Make a caseload for a test prison */
export function makeMockCaseload(prison: { agencyId: string; description: string }, currentlyActive = true): CaseLoad {
  return {
    caseLoadId: prison.agencyId,
    description: prison.description,
    type: AgencyType.INST,
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

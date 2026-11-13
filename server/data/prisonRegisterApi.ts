import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'

import logger from '../../logger'
import config from '../config'
import { errorResponseStatusMatches } from '../utils/utils'
import { RegisterAgencyType } from './constants'

/** Subset of Prison Register’s agency details used by this service */
export interface Agency {
  agencyId: string
  description: string | null
  agencyType: string
  active: boolean
}

export class PrisonRegisterApi extends RestClient {
  constructor(systemToken: string) {
    super('Prison Register API', config.apis.prisonRegisterApi, logger, {
      getToken: async () => systemToken,
    })
  }

  /** Look up agency details of any type, active or not (can be a prison, a PECS region, etc) */
  async getAgency(agencyId: string): Promise<Agency | null> {
    try {
      return await this.get<Agency>(
        {
          path: `/api/agencies/${encodeURIComponent(agencyId)}`,
        },
        asSystem(),
      )
    } catch (error) {
      if (errorResponseStatusMatches(error, 404)) {
        // return null if not found
        return null
      }
      throw error
    }
  }

  /** List all PECS regions */
  async getPecsRegions(activeOnly = true): Promise<Agency[]> {
    return this.get<Agency[]>(
      {
        path: `/api/agencies/type/${RegisterAgencyType.PECS}`,
        query: { activeOnly },
      },
      asSystem(),
    )
  }
}

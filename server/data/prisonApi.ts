import config from '../config'
import RestClient from './restClient'

export type Prison = {
  agencyId: string
  description: string
  agencyType: string
  active: boolean
}

export class PrisonApi extends RestClient {
  constructor(systemToken: string) {
    super('HMPPS Prison API', config.apis.hmppsPrisonApi, systemToken)
  }

  async getPrisons(): Promise<Record<string, Prison>> {
    const prisons = await this.get<Prison[]>({
      path: '/api/agencies/prisons',
    })

    // Returns the prisons in an object for easy access
    return prisons.reduce((prev, prisonInfo) => ({ ...prev, [prisonInfo.agencyId]: prisonInfo }), {})
  }
}

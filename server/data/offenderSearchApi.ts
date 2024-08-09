import config from '../config'
import RestClient from './restClient'

export type OffenderSearchPrisoner = {
  prisonerNumber: string
  firstName: string
  lastName: string
}

export class OffenderSearchApi extends RestClient {
  constructor(systemToken: string) {
    super('HMPPS Offender Search API', config.apis.offenderSearchApi, systemToken)
  }

  async getPrisoners(prisonerNumbers: string[]): Promise<Record<string, OffenderSearchPrisoner>> {
    if (prisonerNumbers.length === 0) {
      return {}
    }

    const prisoners = await this.post<OffenderSearchPrisoner[]>({
      path: '/prisoner-search/prisoner-numbers',
      data: {
        prisonerNumbers,
      },
    })

    // Returns the prisoners in an object for easy access
    return prisoners.reduce((prev, prisonerInfo) => ({ ...prev, [prisonerInfo.prisonerNumber]: prisonerInfo }), {})
  }
}

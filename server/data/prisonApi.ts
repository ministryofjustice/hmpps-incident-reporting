import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import { type NomisPrisonerInvolvementRole, type NomisType } from '../reportConfiguration/constants'
import logger from '../../logger'

export enum AgencyType {
  /** Prison */
  INST = 'INST',
  /** PECS region */
  PECS = 'PECS',
  // CRC = 'CRC',
  // POLSTN = 'POLSTN',
  // COMM = 'COMM',
  // APPR = 'APPR',
  // CRT = 'CRT',
  // POLICE = 'POLICE',
  // IMDC = 'IMDC',
  // TRN = 'TRN',
  // OUT = 'OUT',
  // YOT = 'YOT',
  // SCH = 'SCH',
  // STC = 'STC',
  // HOST = 'HOST',
  // AIRPORT = 'AIRPORT',
  // HSHOSP = 'HSHOSP',
  // HOSPITAL = 'HOSPITAL',
  // PAR = 'PAR',
  // PNP = 'PNP',
  // PSY = 'PSY',
}

export type Agency = {
  agencyId: string
  description: string
  agencyType: AgencyType
  active: boolean
}

export type ServicePrison = {
  prisonId: string
  prison: string
}

// Special prisonId designates service active in all prisons
export const SERVICE_ALL_PRISONS = '*ALL*'

export interface Staff {
  firstName: string
  lastName: string
  username: string
  active: boolean
  activeCaseLoadId: string
}

/** Incident Type Configuration */
export interface IncidentTypeConfiguration {
  /** Incident type of this configuration */
  incidentType: NomisType
  /** Incident type description */
  incidentTypeDescription: string
  /** ID internal of this question set for this incident type */
  questionnaireId: number
  /** List of questions (with answers) for this incident type */
  questions: QuestionConfiguration[]
  /** List of roles that can apply to a prisoner in this incident type */
  prisonerRoles: PrisonerRoleConfiguration[]
  /** Indicates this incident type is still usable */
  active?: boolean
  /** Date the incident type was expired */
  expiryDate?: Date
}

/** Incident type question */
export interface QuestionConfiguration {
  /** Question ID */
  questionnaireQueId: number
  /** Question sequence number */
  questionSeq: number
  /** Question description */
  questionDesc: string
  /** Question list sequence */
  questionListSeq: number
  /** Indicates question is active */
  questionActiveFlag: boolean
  /** Date question was retired */
  questionExpiryDate?: Date
  /** Indicate multiple responses can be given */
  multipleAnswerFlag: boolean
  /** Order list of answers */
  answers: AnswerConfiguration[]
}

/** Incident Type Answer */
export interface AnswerConfiguration {
  /** ID for this Answer */
  questionnaireAnsId: number
  /** Sequence for this answer */
  answerSeq: number
  /** Answer Text */
  answerDesc: string
  /** Answer Sequence */
  answerListSeq: number
  /** Indicates this answer is active */
  answerActiveFlag: boolean
  /** Date expired (not used) */
  answerExpiryDate?: Date
  /** Should the answer include date information? */
  dateRequiredFlag: boolean
  /** Should the answer include comment? */
  commentRequiredFlag: boolean
  /** Next questionnaire question ID */
  nextQuestionnaireQueId?: number
}

/** Incident type prisoner role */
interface PrisonerRoleConfiguration {
  /** Role type for this question set */
  prisonerRole: NomisPrisonerInvolvementRole
  /** If a single party can have this role in the question set */
  singleRole: boolean
  /** Indicates this role is active */
  active: boolean
  /** Indicates the date the role was made inactive */
  expiryDate?: Date
}

export interface ReferenceCode {
  domain: string
  code: string
  description: string
  listSeq: number
  systemDataFlag: 'Y' | 'N'
  activeFlag: 'Y' | 'N'
  expiredDate?: Date
  parentDomain?: string
  parentCode?: string
  subCodes: ReferenceCode[]
}

export class PrisonApi extends RestClient {
  constructor(systemToken: string) {
    super('HMPPS Prison API', config.apis.hmppsPrisonApi, logger, {
      getToken: async () => systemToken,
    })
  }

  async getPrison(prisonId: string, activeOnly = true): Promise<Agency | null> {
    try {
      return await this.get<Agency>(
        {
          path: `/api/agencies/${encodeURIComponent(prisonId)}`,
          query: { activeOnly: activeOnly.toString() },
        },
        asSystem(),
      )
    } catch (error) {
      const status = error?.responseStatus
      if (status === 404) {
        // return null if not found
        return null
      }
      throw error
    }
  }

  async getPrisons(): Promise<Record<string, Agency>> {
    const prisons = await this.get<Agency[]>(
      {
        path: '/api/agencies/prisons',
      },
      asSystem(),
    )

    // Returns the prisons in an object for easy access
    return prisons.reduce((prev, prisonInfo) => ({ ...prev, [prisonInfo.agencyId]: prisonInfo }), {})
  }

  async getPecsRegions(activeOnly = true): Promise<Record<string, Agency>> {
    return this.getAgencies(AgencyType.PECS, activeOnly)
  }

  private async getAgencies(agencyType: AgencyType, activeOnly = true): Promise<Record<string, Agency>> {
    const agencies = await this.get<Agency[]>(
      {
        path: `/api/agencies/type/${encodeURIComponent(agencyType)}`,
        query: { activeOnly },
      },
      asSystem(),
    )

    // Returns the agencies in an object for easy access
    return agencies.reduce((prev, agency) => ({ ...prev, [agency.agencyId]: agency }), {})
  }

  /**
   * Returns a list of prisons switched on for the Incidents Reporting service.
   *
   * Requires role ROLE_PRISON_API__SERVICE_AGENCY_SWITCHES__RO
   */
  async getServicePrisonIds(): Promise<string[]> {
    const SERVICE_CODE = 'INCIDENTS'
    const servicePrisons = await this.get<ServicePrison[]>(
      {
        path: `/api/service-prisons/${encodeURIComponent(SERVICE_CODE)}`,
      },
      asSystem(),
    )
    return servicePrisons.map(servicePrison => servicePrison.prisonId)
  }

  async getPhoto(prisonerNumber: string): Promise<Buffer | null> {
    try {
      return await this.get<Buffer>(
        {
          path: `/api/bookings/offenderNo/${encodeURIComponent(prisonerNumber)}/image/data`,
          query: { fullSizeImage: 'false' },
        },
        asSystem(),
      )
    } catch (error) {
      const status = error?.responseStatus
      if (status === 403 || status === 404) {
        // return null if unauthorised or not found
        return null
      }
      throw error
    }
  }

  async getStaffDetails(username: string): Promise<Staff | null> {
    try {
      return await this.get<Staff>(
        {
          path: `/api/users/${username}`,
        },
        asSystem(),
      )
    } catch (error) {
      const status = error?.responseStatus
      if (status === 404) {
        // return null if not found
        return null
      }
      throw error
    }
  }

  /**
   * Load current NOMIS configuration for all incident types, including inactive ones.
   * Optionally, can be filtered to return only 1 type.
   */
  async getIncidentTypeConfiguration(type?: string): Promise<IncidentTypeConfiguration[]> {
    const incidentTypes = await this.get<DatesAsStrings<IncidentTypeConfiguration>[]>(
      {
        path: '/api/incidents/configuration',
        query: { 'incident-type': type },
      },
      asSystem(),
    )
    return incidentTypes.map(
      incidentType =>
        ({
          ...incidentType,
          questions: incidentType.questions.map(
            question =>
              ({
                ...question,
                questionExpiryDate: question.questionExpiryDate && new Date(question.questionExpiryDate),
                answers: question.answers.map(
                  answer =>
                    ({
                      ...answer,
                      answerExpiryDate: answer.answerExpiryDate && new Date(answer.answerExpiryDate),
                    }) satisfies AnswerConfiguration,
                ),
              }) satisfies QuestionConfiguration,
          ),
          prisonerRoles: incidentType.prisonerRoles.map(
            prisonerRole =>
              ({
                ...prisonerRole,
                expiryDate: prisonerRole.expiryDate && new Date(prisonerRole.expiryDate),
              }) satisfies PrisonerRoleConfiguration,
          ),
          expiryDate: incidentType.expiryDate && new Date(incidentType.expiryDate),
        }) satisfies IncidentTypeConfiguration,
    )
  }

  /** Load reference data codes for given domain */
  async getReferenceCodes(domain: string): Promise<ReferenceCode[]> {
    function parseDates(referenceCode: DatesAsStrings<ReferenceCode>): ReferenceCode {
      return {
        ...referenceCode,
        expiredDate: referenceCode.expiredDate && new Date(referenceCode.expiredDate),
        subCodes: (referenceCode.subCodes ?? []).map(parseDates),
      }
    }

    const codes = await this.get<DatesAsStrings<ReferenceCode[]>>(
      {
        path: `/api/reference-domains/domains/${encodeURIComponent(domain)}/codes`,
      },
      asSystem(),
    )
    return codes.map(parseDates).sort((code1, code2) => (code1.listSeq ?? Infinity) - (code2.listSeq ?? Infinity))
  }

  /**
   * List incident types
   * NB: THIS DOES NOT MATCH THE ACTUAL REPORT TYPES
   */
  getIncidentTypes(): Promise<ReferenceCode[]> {
    return this.getReferenceCodes('IR_TYPE')
  }

  /** List options for roles of staff involvement */
  getStaffInvolvementRoles(): Promise<ReferenceCode[]> {
    return this.getReferenceCodes('IR_STF_PART')
  }

  /** List options for roles of prisoner involvement */
  getPrisonerInvolvementRoles(): Promise<ReferenceCode[]> {
    return this.getReferenceCodes('IR_OFF_PART')
  }

  /** List options for outcomes of prisoner involvement */
  getPrisonerInvolvementOutcome(): Promise<ReferenceCode[]> {
    return this.getReferenceCodes('IR_OUTCOME')
  }
}

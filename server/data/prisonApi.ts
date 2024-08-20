import config from '../config'
import RestClient from './restClient'

export type Prison = {
  agencyId: string
  description: string
  agencyType: string
  active: boolean
}

/** Incident Type Configuration */
export interface IncidentTypeConfiguration {
  /** Incident type of this configuration */
  incidentType: string
  /** Incident type description */
  incidentTypeDescription: string
  /** ID internal of this question set for this incident type */
  questionnaireId: number
  /** List of questions (with answers) for this incident type */
  questions: Question[]
  /** List of roles that can apply to a prisoner in this incident type */
  prisonerRoles: PrisonerRole[]
  /** Indicates this incident type is still usable */
  active: boolean
  /** Date the incident type was expired */
  expiryDate?: Date
}

/** Incident type question */
interface Question {
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
  answers: Answer[]
}

/** Incident Type Answer */
interface Answer {
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
interface PrisonerRole {
  /** Role type for this question set */
  prisonerRole: string
  /** If a single party can have this role in the question set */
  singleRole: boolean
  /** Indicates this role is active */
  active: boolean
  /** Indicates the date the role was made inactive */
  expiryDate?: Date
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

  /**
   * Load current NOMIS configuration for all incident types, including inactive ones.
   * Optionally, can be filtered to return only 1 type.
   */
  getIncidentTypeConfiguration(type?: string): Promise<IncidentTypeConfiguration[]> {
    return this.get<DatesAsStrings<IncidentTypeConfiguration>[]>({
      path: '/api/incidents/configuration',
      query: { 'incident-type': type },
    }).then(incidentTypes =>
      incidentTypes.map(
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
                      }) satisfies Answer,
                  ),
                }) satisfies Question,
            ),
            prisonerRoles: incidentType.prisonerRoles.map(
              prisonerRole =>
                ({
                  ...prisonerRole,
                  expiryDate: prisonerRole.expiryDate && new Date(prisonerRole.expiryDate),
                }) satisfies PrisonerRole,
            ),
            expiryDate: incidentType.expiryDate && new Date(incidentType.expiryDate),
          }) satisfies IncidentTypeConfiguration,
      ),
    )
  }
}

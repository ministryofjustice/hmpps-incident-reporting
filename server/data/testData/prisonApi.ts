import type { IncidentTypeConfiguration, Prison, Staff } from '../prisonApi'

export const leeds: Prison = {
  agencyId: 'LEI',
  description: 'Leeds (HMP)',
  agencyType: 'INST',
  active: true,
}

export const moorland: Prison = {
  agencyId: 'MDI',
  description: 'Moorland (HMP & YOI)',
  agencyType: 'INST',
  active: true,
}

export const staffBarry: Staff = {
  username: 'lev79n',
  firstName: 'BARRY',
  lastName: 'HARRISON',
  active: true,
  activeCaseLoadId: 'LEI',
}

export const staffMary: Staff = {
  username: 'abc12a',
  firstName: 'MARY',
  lastName: 'JOHNSON',
  active: true,
  activeCaseLoadId: 'MDI',
}

/**
 * Basic incident report configuration as could have come from NOMIS. For testing only!!
 * This includes 2 report types (ASSAULTS2 and ASSAULTS3), one inactive and its replacement.
 * Both have 2 questions, each with 2 answers.
 */
export const basicIncidentReportConfiguration: readonly IncidentTypeConfiguration[] = [
  {
    questionnaireId: 1,
    incidentType: 'ASSAULTS2',
    incidentTypeDescription: 'Assault (from April 2017)',
    questions: [
      {
        questionnaireQueId: 1,
        questionDesc: 'WAS HEALTHCARE INVOLVED',
        questionSeq: 1,
        questionListSeq: 1,
        questionActiveFlag: true,
        multipleAnswerFlag: false,
        answers: [
          {
            questionnaireAnsId: 1,
            answerDesc: 'YES (ENTER STAFF NAME)',
            answerSeq: 1,
            answerListSeq: 1,
            answerActiveFlag: true,
            dateRequiredFlag: false,
            commentRequiredFlag: true,
            nextQuestionnaireQueId: 2,
          },
          {
            questionnaireAnsId: 2,
            answerDesc: 'NO',
            answerSeq: 2,
            answerListSeq: 2,
            answerActiveFlag: true,
            dateRequiredFlag: false,
            commentRequiredFlag: false,
            nextQuestionnaireQueId: 2,
          },
        ],
      },
      {
        questionnaireQueId: 2,
        questionDesc: 'WERE THE POLICE INFORMED OF THE INCIDENT',
        questionSeq: 2,
        questionListSeq: 2,
        questionActiveFlag: true,
        multipleAnswerFlag: false,
        answers: [
          {
            questionnaireAnsId: 3,
            answerDesc: 'YES (ENTER DATE)',
            answerSeq: 1,
            answerListSeq: 1,
            answerActiveFlag: true,
            dateRequiredFlag: true,
            commentRequiredFlag: false,
            nextQuestionnaireQueId: null,
          },
          {
            questionnaireAnsId: 4,
            answerDesc: 'NO',
            answerSeq: 2,
            answerListSeq: 2,
            answerActiveFlag: true,
            dateRequiredFlag: false,
            commentRequiredFlag: false,
            nextQuestionnaireQueId: null,
          },
        ],
      },
    ],
    prisonerRoles: [
      {
        prisonerRole: 'ACTINV',
        singleRole: false,
        active: true,
      },
      {
        prisonerRole: 'FIGHT',
        singleRole: false,
        active: true,
      },
      {
        prisonerRole: 'PRESENT',
        singleRole: false,
        active: true,
      },
    ],
    active: false,
  },
  {
    questionnaireId: 2,
    incidentType: 'ASSAULTS3',
    incidentTypeDescription: 'Assaults 2022',
    questions: [
      {
        questionnaireQueId: 3,
        questionDesc: 'WAS HEALTHCARE INVOLVED',
        questionSeq: 1,
        questionListSeq: 1,
        questionActiveFlag: true,
        multipleAnswerFlag: false,
        answers: [
          {
            questionnaireAnsId: 5,
            answerDesc: 'YES (ENTER STAFF NAME)',
            answerSeq: 1,
            answerListSeq: 1,
            answerActiveFlag: true,
            dateRequiredFlag: false,
            commentRequiredFlag: true,
            nextQuestionnaireQueId: 4,
          },
          {
            questionnaireAnsId: 6,
            answerDesc: 'NO',
            answerSeq: 2,
            answerListSeq: 2,
            answerActiveFlag: true,
            dateRequiredFlag: false,
            commentRequiredFlag: false,
            nextQuestionnaireQueId: 4,
          },
        ],
      },
      {
        questionnaireQueId: 4,
        questionDesc: 'WERE THE POLICE INFORMED OF THE INCIDENT',
        questionSeq: 2,
        questionListSeq: 2,
        questionActiveFlag: true,
        multipleAnswerFlag: false,
        answers: [
          {
            questionnaireAnsId: 7,
            answerDesc: 'YES (ENTER DATE)',
            answerSeq: 1,
            answerListSeq: 1,
            answerActiveFlag: true,
            dateRequiredFlag: true,
            commentRequiredFlag: false,
            nextQuestionnaireQueId: null,
          },
          {
            questionnaireAnsId: 8,
            answerDesc: 'NO',
            answerSeq: 2,
            answerListSeq: 2,
            answerActiveFlag: true,
            dateRequiredFlag: false,
            commentRequiredFlag: false,
            nextQuestionnaireQueId: null,
          },
        ],
      },
    ],
    prisonerRoles: [
      {
        prisonerRole: 'ACTINV',
        singleRole: false,
        active: true,
      },
      {
        prisonerRole: 'FIGHT',
        singleRole: false,
        active: true,
      },
      {
        prisonerRole: 'PRESENT',
        singleRole: false,
        active: true,
      },
    ],
    active: true,
  },
]

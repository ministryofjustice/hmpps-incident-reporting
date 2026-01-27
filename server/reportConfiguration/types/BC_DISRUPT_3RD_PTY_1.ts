// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2025-11-18T11:52:43.042Z

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

export const BC_DISRUPT_3RD_PTY_1: IncidentTypeConfiguration = {
  incidentType: 'BC_DISRUPT_3RD_PTY_1',
  active: true,
  startingQuestionCode: '100010',
  questions: {
    '100010': {
      code: '100010',
      active: true,
      question: 'Was there an impact to the daily regime?',
      label: 'Was there an impact to the daily regime?',
      multipleAnswers: false,
      answers: [
        {
          code: '100011',
          response: 'Yes',
          active: true,
          label: 'Yes',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '100012',
          response: 'No',
          active: true,
          label: 'No',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
      ],
    },
  },
  prisonerRoles: [
    {
      prisonerRole: 'ACTIVE_INVOLVEMENT',
      onlyOneAllowed: false,
      active: true,
    },
  ],
}

export default BC_DISRUPT_3RD_PTY_1

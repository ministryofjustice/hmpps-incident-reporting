// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2026-01-27T13:21:00.000Z

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

export const BC_LOSS_COMMS_1: IncidentTypeConfiguration = {
  incidentType: 'BC_LOSS_COMMS_1',
  active: true,
  startingQuestionCode: '100040',
  questions: {
    '100040': {
      code: '100040',
      active: true,
      question: 'Was there an impact to the daily regime?',
      label: 'Was there an impact to the daily regime?',
      multipleAnswers: false,
      answers: [
        {
          code: '100041',
          response: 'Yes',
          active: true,
          label: 'Yes',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '100042',
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

export default BC_LOSS_COMMS_1

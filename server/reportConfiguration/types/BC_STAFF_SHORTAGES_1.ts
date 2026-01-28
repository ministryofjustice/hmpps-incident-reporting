// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2026-01-27T13:21:00.000Z

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

export const BC_STAFF_SHORTAGES_1: IncidentTypeConfiguration = {
  incidentType: 'BC_STAFF_SHORTAGES_1',
  active: false,
  startingQuestionCode: '100070',
  questions: {
    '100070': {
      code: '100070',
      active: true,
      question: 'Was there an impact to the daily regime?',
      label: 'Was there an impact to the daily regime?',
      multipleAnswers: false,
      answers: [
        {
          code: '100071',
          response: 'Yes',
          active: true,
          label: 'Yes',
          commentRequested: true,
          commentMandatory: true,
          commentLabel: 'Please provide summary information about the impacts on the regime',
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '100072',
          response: 'No',
          active: true,
          label: 'No',
          commentRequested: true,
          commentMandatory: true,
          commentLabel: 'Please provide how negative impacts were avoided',
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

export default BC_STAFF_SHORTAGES_1

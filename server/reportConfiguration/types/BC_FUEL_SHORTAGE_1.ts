// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2026-01-27T13:21:00.000Z

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

export const BC_FUEL_SHORTAGE_1: IncidentTypeConfiguration = {
  incidentType: 'BC_FUEL_SHORTAGE_1',
  active: false,
  startingQuestionCode: '100020',
  questions: {
    '100020': {
      code: '100020',
      active: true,
      question: 'Was there an impact to the daily regime?',
      label: 'Was there an impact to the daily regime?',
      multipleAnswers: false,
      answers: [
        {
          code: '100021',
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
          code: '100022',
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

export default BC_FUEL_SHORTAGE_1

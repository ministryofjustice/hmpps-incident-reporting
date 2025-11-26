// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2025-11-18T11:52:43.042Z

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

export const DIRTY_PROTEST_1: IncidentTypeConfiguration = {
  incidentType: 'DIRTY_PROTEST_1',
  active: false,
  startingQuestionCode: '100000',
  questions: {
    '100000': {
      code: '100000',
      active: true,
      question: 'What was the location of the Incident?',
      label: 'What was the location of the incident?',
      multipleAnswers: false,
      answers: [
        {
          code: '100001',
          response: 'Ordinary Cell',
          active: true,
          label: 'Ordinary cell',
          commentRequired: true,
          dateRequired: false,
          nextQuestionCode: null,
        },
        {
          code: '100002',
          response: 'Specialist cell/unit',
          active: true,
          label: 'Specialist cell/unit',
          commentRequired: true,
          dateRequired: false,
          nextQuestionCode: null,
        },
        {
          code: '100003',
          response: 'Shower/changing room',
          active: true,
          label: 'Shower/changing room',
          commentRequired: true,
          dateRequired: false,
          nextQuestionCode: null,
        },
        {
          code: '100004',
          response: 'Other Location within Prison',
          active: true,
          label: 'Other location within prison',
          commentRequired: true,
          dateRequired: false,
          nextQuestionCode: null,
        },
        {
          code: '100005',
          response: 'Crown/Magistrates Court',
          active: true,
          label: 'Crown/magistrates court',
          commentRequired: false,
          dateRequired: false,
          nextQuestionCode: null,
        },
        {
          code: '100006',
          response: 'Court Cell',
          active: true,
          label: 'Court cell',
          commentRequired: false,
          dateRequired: false,
          nextQuestionCode: null,
        },
        {
          code: '100007',
          response: 'Vehicle',
          active: true,
          label: 'Vehicle',
          commentRequired: true,
          dateRequired: false,
          nextQuestionCode: null,
        },
      ],
    },
  },
  prisonerRoles: [
    {
      prisonerRole: 'PERPETRATOR',
      onlyOneAllowed: true,
      active: true,
    },
  ],
}

export default DIRTY_PROTEST_1

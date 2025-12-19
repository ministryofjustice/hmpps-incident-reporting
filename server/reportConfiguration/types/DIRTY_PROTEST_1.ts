// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2025-11-18T11:52:43.042Z

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

export const DIRTY_PROTEST_1: IncidentTypeConfiguration = {
  incidentType: 'DIRTY_PROTEST_1',
  active: true,
  startingQuestionCode: '100000',
  questions: {
    '100000': {
      code: '100000',
      active: true,
      question: 'What was the location of the Incident?',
      label: 'What was the location of the incident?',
      questionHint:
        'Please provide the exact location where the dirty protest occurred. If this occurred in the prisoners cell please enter the cell number.',
      multipleAnswers: false,
      answers: [
        {
          code: '100001',
          response: 'Ordinary Cell',
          responseHint: 'The dirty protest occurred in the prisoners cell',
          active: true,
          label: 'Ordinary cell',
          commentRequested: true,
          commentMandatory: true,
          commentLabel: 'Enter the cell number (e.g. M-1-003)',
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '100002',
          response: 'Specialist cell/unit',
          active: true,
          label: 'Specialist cell/unit',
          commentRequested: true,
          commentMandatory: true,
          commentLabel: 'Enter the specialist cell/unit number (e.g SEG-1)',
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '100003',
          response: 'Shower/changing room',
          active: true,
          label: 'Shower/changing room',
          commentLabel: 'Enter the shower/changing room number or name',
          commentRequested: true,
          commentMandatory: true,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '100004',
          response: 'Other Location within Prison',
          active: true,
          label: 'Other location within prison',
          commentLabel: 'Enter the location name within the prison (e.g. Landing A-1)',
          commentRequested: true,
          commentMandatory: true,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '100005',
          response: 'Crown/Magistrates Court',
          active: true,
          label: 'Crown/magistrates court',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '100006',
          response: 'Court Cell',
          active: true,
          label: 'Court cell',
          commentRequested: false,
          commentMandatory: false,
          dateMandatory: false,
          nextQuestionCode: null,
        },
        {
          code: '100007',
          response: 'Vehicle',
          active: true,
          label: 'Vehicle',
          commentRequested: true,
          commentMandatory: true,
          commentLabel: 'Enter the vehicle registration number',
          dateMandatory: false,
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

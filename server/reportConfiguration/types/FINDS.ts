// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts 2024-09-11T16:01:54.329Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const FINDS: IncidentTypeConfiguration = {
  incidentType: 'FINDS',
  active: true,
  startingQuestionId: '1',
  questions: {
    '1': {
      id: '1',
      label: 'What did you find?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Phone (specify model)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'Drug (specify drug)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
} as const

export default FINDS

// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:19:47.573Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_FINDS: IncidentTypeConfiguration = {
  incidentType: 'OLD_FINDS',
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
          nextQuestionId: '2',
        },
        {
          label: 'Drug (specify drug)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '3',
        },
      ],
    },
    '2': {
      id: '2',
      label: 'Did it had a memory card?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '3': {
      id: '3',
      label: 'What was the weight of the drug you found?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Weight',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
} as const

export default OLD_FINDS

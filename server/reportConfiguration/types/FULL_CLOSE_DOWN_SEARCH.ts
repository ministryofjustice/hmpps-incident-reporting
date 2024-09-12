// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:55.509Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const FULL_CLOSE_DOWN_SEARCH: IncidentTypeConfiguration = {
  incidentType: 'FULL_CLOSE_DOWN_SEARCH',
  active: true,
  startingQuestionId: '45067',
  questions: {
    '44146': {
      id: '44146',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44677',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44677',
        },
      ],
    },
    '44385': {
      id: '44385',
      label: 'WERE ANY ILLICIT ITEMS FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44969',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44803',
        },
      ],
    },
    '44432': {
      id: '44432',
      label: 'WHAT WAS THE PURPOSE OF THE SEARCH',
      multipleAnswers: true,
      answers: [
        {
          label: 'FIREARM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          label: 'AMMUNITION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          label: 'C.I SPRAY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          label: 'OTHER WEAPON',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          label: 'EXPLOSIVES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          label: 'DRUGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          label: 'ESCAPE EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          label: 'GATHER EVIDENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44385',
        },
      ],
    },
    '44570': {
      id: '44570',
      label: 'WERE SUPPORT STAFF FROM OTHER PRISONS DEPLOYED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44677': {
      id: '44677',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45062',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45062',
        },
      ],
    },
    '44723': {
      id: '44723',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45018',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45018',
        },
      ],
    },
    '44803': {
      id: '44803',
      label: 'WERE SPECIALIST DOGS USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44570',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44570',
        },
      ],
    },
    '44969': {
      id: '44969',
      label: 'DESCRIBE THE ILLICIT ITEMS',
      multipleAnswers: true,
      answers: [
        {
          label: 'WEAPONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44803',
        },
        {
          label: 'HOOCH/ALCOHOL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44803',
        },
        {
          label: 'CASH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44803',
        },
        {
          label: 'MOBILE PHONE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44803',
        },
        {
          label: 'INCENDIARY DEVICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44803',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44803',
        },
      ],
    },
    '45018': {
      id: '45018',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44146',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44146',
        },
      ],
    },
    '45062': {
      id: '45062',
      label: 'WHY WAS SEARCH CARRIED OUT',
      multipleAnswers: false,
      answers: [
        {
          label: 'INFORMATION/INTELLIGENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44432',
        },
        {
          label: 'SPECIFIC FIND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44432',
        },
        {
          label: 'HEADQUARTERS INSTRUCTIONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44432',
        },
        {
          label: 'ROUTINE REQUIREMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44432',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44432',
        },
      ],
    },
    '45067': {
      id: '45067',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44723',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45018',
        },
      ],
    },
  },
} as const

export default FULL_CLOSE_DOWN_SEARCH

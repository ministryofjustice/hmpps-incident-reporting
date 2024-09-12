// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:39.971Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const DEATH_OTHER: IncidentTypeConfiguration = {
  incidentType: 'DEATH_OTHER',
  active: true,
  startingQuestionId: '45054',
  questions: {
    '44130': {
      id: '44130',
      label: 'NAME OF DECEASED',
      multipleAnswers: false,
      answers: [
        {
          label: 'NAME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44392',
        },
      ],
    },
    '44142': {
      id: '44142',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44751',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44751',
        },
      ],
    },
    '44237': {
      id: '44237',
      label: 'WHAT VERDICT DID THE INQUEST REACH',
      multipleAnswers: false,
      answers: [
        {
          label: 'NATURAL CAUSES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'SUICIDE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'ACCIDENTAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'MISADVENTURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'OPEN VERDICT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44248': {
      id: '44248',
      label: 'WHO PRONOUNCED DEATH',
      multipleAnswers: false,
      answers: [
        {
          label: 'PRISON MEDICAL OFFICER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44702',
        },
        {
          label: 'HOSPITAL DOCTOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44702',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44702',
        },
      ],
    },
    '44350': {
      id: '44350',
      label: 'HAS AN INQUEST BEEN HELD',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44237',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44382': {
      id: '44382',
      label: 'IS THE DEATH SUBJECT TO A HEALTH AND SAFETY INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44130',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44130',
        },
      ],
    },
    '44392': {
      id: '44392',
      label: 'STATUS OF DECEASED',
      multipleAnswers: false,
      answers: [
        {
          label: 'OFFICER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44645',
        },
        {
          label: 'CIVILIAN STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44645',
        },
        {
          label: 'EXTERNAL CIVILIAN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44645',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44645',
        },
      ],
    },
    '44395': {
      id: '44395',
      label: 'WAS RESUSCITATION ATTEMPTED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45031',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45031',
        },
      ],
    },
    '44397': {
      id: '44397',
      label: 'HAS CORONER BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44350',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44350',
        },
      ],
    },
    '44425': {
      id: '44425',
      label: 'WHAT WERE THE CIRCUMSTANCES OF THE DEATH',
      multipleAnswers: false,
      answers: [
        {
          label: 'APPARENT SELF INFLICTED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44382',
        },
        {
          label: 'APPARENT NATURAL CAUSES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44382',
        },
        {
          label: 'ACCIDENTAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44382',
        },
        {
          label: 'SUSPICIOUS CIRCUMSTANCES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44382',
        },
      ],
    },
    '44434': {
      id: '44434',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44839',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44839',
        },
      ],
    },
    '44645': {
      id: '44645',
      label: 'HAVE NEXT OF KIN BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44397',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44397',
        },
      ],
    },
    '44702': {
      id: '44702',
      label: 'WHAT TIME WAS DEATH PRONOUNCED',
      multipleAnswers: true,
      answers: [
        {
          label: 'DATE',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44425',
        },
        {
          label: 'TIME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44425',
        },
      ],
    },
    '44748': {
      id: '44748',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44142',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44142',
        },
      ],
    },
    '44751': {
      id: '44751',
      label: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44395',
        },
      ],
    },
    '44839': {
      id: '44839',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44748',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44748',
        },
      ],
    },
    '45031': {
      id: '45031',
      label: 'WAS THE PERSON TAKEN TO AN OUTSIDE HOSPITAL',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44248',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44248',
        },
      ],
    },
    '45054': {
      id: '45054',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44434',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44839',
        },
      ],
    },
  },
} as const

export default DEATH_OTHER

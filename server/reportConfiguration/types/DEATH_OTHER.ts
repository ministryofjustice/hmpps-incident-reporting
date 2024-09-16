// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-16T15:41:59.070Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const DEATH_OTHER: IncidentTypeConfiguration = {
  incidentType: 'DEATH_OTHER',
  active: true,
  startingQuestionId: '45054',
  questions: {
    '44130': {
      id: '44130',
      code: 'NAME OF DECEASED',
      label: 'NAME OF DECEASED',
      multipleAnswers: false,
      answers: [
        {
          code: 'NAME',
          label: 'NAME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44392',
        },
      ],
    },
    '44142': {
      id: '44142',
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44751',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44751',
        },
      ],
    },
    '44237': {
      id: '44237',
      code: 'WHAT VERDICT DID THE INQUEST REACH',
      label: 'WHAT VERDICT DID THE INQUEST REACH',
      multipleAnswers: false,
      answers: [
        {
          code: 'NATURAL CAUSES',
          label: 'NATURAL CAUSES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'SUICIDE',
          label: 'SUICIDE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'ACCIDENTAL',
          label: 'ACCIDENTAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'MISADVENTURE',
          label: 'MISADVENTURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'OPEN VERDICT',
          label: 'OPEN VERDICT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44248': {
      id: '44248',
      code: 'WHO PRONOUNCED DEATH',
      label: 'WHO PRONOUNCED DEATH',
      multipleAnswers: false,
      answers: [
        {
          code: 'PRISON MEDICAL OFFICER',
          label: 'PRISON MEDICAL OFFICER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44702',
        },
        {
          code: 'HOSPITAL DOCTOR',
          label: 'HOSPITAL DOCTOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44702',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44702',
        },
      ],
    },
    '44350': {
      id: '44350',
      code: 'HAS AN INQUEST BEEN HELD',
      label: 'HAS AN INQUEST BEEN HELD',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44237',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44382': {
      id: '44382',
      code: 'IS THE DEATH SUBJECT TO A HEALTH AND SAFETY INVESTIGATION',
      label: 'IS THE DEATH SUBJECT TO A HEALTH AND SAFETY INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44130',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44130',
        },
      ],
    },
    '44392': {
      id: '44392',
      code: 'STATUS OF DECEASED',
      label: 'STATUS OF DECEASED',
      multipleAnswers: false,
      answers: [
        {
          code: 'OFFICER',
          label: 'OFFICER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44645',
        },
        {
          code: 'CIVILIAN STAFF',
          label: 'CIVILIAN STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44645',
        },
        {
          code: 'EXTERNAL CIVILIAN',
          label: 'EXTERNAL CIVILIAN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44645',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44645',
        },
      ],
    },
    '44395': {
      id: '44395',
      code: 'WAS RESUSCITATION ATTEMPTED',
      label: 'WAS RESUSCITATION ATTEMPTED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45031',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45031',
        },
      ],
    },
    '44397': {
      id: '44397',
      code: 'HAS CORONER BEEN INFORMED',
      label: 'HAS CORONER BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44350',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44350',
        },
      ],
    },
    '44425': {
      id: '44425',
      code: 'WHAT WERE THE CIRCUMSTANCES OF THE DEATH',
      label: 'WHAT WERE THE CIRCUMSTANCES OF THE DEATH',
      multipleAnswers: false,
      answers: [
        {
          code: 'APPARENT SELF INFLICTED',
          label: 'APPARENT SELF INFLICTED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44382',
        },
        {
          code: 'APPARENT NATURAL CAUSES',
          label: 'APPARENT NATURAL CAUSES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44382',
        },
        {
          code: 'ACCIDENTAL',
          label: 'ACCIDENTAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44382',
        },
        {
          code: 'SUSPICIOUS CIRCUMSTANCES',
          label: 'SUSPICIOUS CIRCUMSTANCES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44382',
        },
      ],
    },
    '44434': {
      id: '44434',
      code: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44839',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44839',
        },
      ],
    },
    '44645': {
      id: '44645',
      code: 'HAVE NEXT OF KIN BEEN INFORMED',
      label: 'HAVE NEXT OF KIN BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44397',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44397',
        },
      ],
    },
    '44702': {
      id: '44702',
      code: 'WHAT TIME WAS DEATH PRONOUNCED',
      label: 'WHAT TIME WAS DEATH PRONOUNCED',
      multipleAnswers: true,
      answers: [
        {
          code: 'DATE',
          label: 'DATE',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44425',
        },
        {
          code: 'TIME',
          label: 'TIME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44425',
        },
      ],
    },
    '44748': {
      id: '44748',
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44142',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44142',
        },
      ],
    },
    '44751': {
      id: '44751',
      code: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      label: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'SPECIFY',
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44395',
        },
      ],
    },
    '44839': {
      id: '44839',
      code: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44748',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44748',
        },
      ],
    },
    '45031': {
      id: '45031',
      code: 'WAS THE PERSON TAKEN TO AN OUTSIDE HOSPITAL',
      label: 'WAS THE PERSON TAKEN TO AN OUTSIDE HOSPITAL',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44248',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44248',
        },
      ],
    },
    '45054': {
      id: '45054',
      code: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44434',
        },
        {
          code: 'NO',
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

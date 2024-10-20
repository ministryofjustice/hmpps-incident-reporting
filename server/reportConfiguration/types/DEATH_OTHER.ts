// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-10-15T17:17:19.486Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const DEATH_OTHER: IncidentTypeConfiguration = {
  incidentType: 'DEATH_OTHER',
  active: true,
  startingQuestionId: '45054',
  questions: {
    '44130': {
      id: '44130',
      active: true,
      code: 'NAME OF DECEASED',
      label: 'NAME OF DECEASED',
      multipleAnswers: false,
      answers: [
        {
          id: '178925',
          code: 'NAME',
          active: true,
          label: 'NAME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44392',
        },
      ],
    },
    '44142': {
      id: '44142',
      active: true,
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          id: '178971',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44751',
        },
        {
          id: '178970',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44751',
        },
      ],
    },
    '44237': {
      id: '44237',
      active: true,
      code: 'WHAT VERDICT DID THE INQUEST REACH',
      label: 'WHAT VERDICT DID THE INQUEST REACH',
      multipleAnswers: false,
      answers: [
        {
          id: '179279',
          code: 'NATURAL CAUSES',
          active: true,
          label: 'NATURAL CAUSES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179282',
          code: 'SUICIDE',
          active: true,
          label: 'SUICIDE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179277',
          code: 'ACCIDENTAL',
          active: true,
          label: 'ACCIDENTAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179278',
          code: 'MISADVENTURE',
          active: true,
          label: 'MISADVENTURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179280',
          code: 'OPEN VERDICT',
          active: true,
          label: 'OPEN VERDICT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179281',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44248': {
      id: '44248',
      active: true,
      code: 'WHO PRONOUNCED DEATH',
      label: 'WHO PRONOUNCED DEATH',
      multipleAnswers: false,
      answers: [
        {
          id: '179320',
          code: 'PRISON MEDICAL OFFICER',
          active: true,
          label: 'PRISON MEDICAL OFFICER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44702',
        },
        {
          id: '179318',
          code: 'HOSPITAL DOCTOR',
          active: true,
          label: 'HOSPITAL DOCTOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44702',
        },
        {
          id: '179319',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44702',
        },
      ],
    },
    '44350': {
      id: '44350',
      active: true,
      code: 'HAS AN INQUEST BEEN HELD',
      label: 'HAS AN INQUEST BEEN HELD',
      multipleAnswers: false,
      answers: [
        {
          id: '179677',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44237',
        },
        {
          id: '179678',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44382': {
      id: '44382',
      active: true,
      code: 'IS THE DEATH SUBJECT TO A HEALTH AND SAFETY INVESTIGATION',
      label: 'IS THE DEATH SUBJECT TO A HEALTH AND SAFETY INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          id: '179795',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44130',
        },
        {
          id: '179794',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44130',
        },
      ],
    },
    '44392': {
      id: '44392',
      active: true,
      code: 'STATUS OF DECEASED',
      label: 'STATUS OF DECEASED',
      multipleAnswers: false,
      answers: [
        {
          id: '179824',
          code: 'OFFICER',
          active: true,
          label: 'OFFICER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44645',
        },
        {
          id: '179822',
          code: 'CIVILIAN STAFF',
          active: true,
          label: 'CIVILIAN STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44645',
        },
        {
          id: '179823',
          code: 'EXTERNAL CIVILIAN',
          active: true,
          label: 'EXTERNAL CIVILIAN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44645',
        },
        {
          id: '179825',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44645',
        },
      ],
    },
    '44395': {
      id: '44395',
      active: true,
      code: 'WAS RESUSCITATION ATTEMPTED',
      label: 'WAS RESUSCITATION ATTEMPTED',
      multipleAnswers: false,
      answers: [
        {
          id: '179834',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45031',
        },
        {
          id: '179833',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45031',
        },
      ],
    },
    '44397': {
      id: '44397',
      active: true,
      code: 'HAS CORONER BEEN INFORMED',
      label: 'HAS CORONER BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          id: '179838',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44350',
        },
        {
          id: '179837',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44350',
        },
      ],
    },
    '44425': {
      id: '44425',
      active: true,
      code: 'WHAT WERE THE CIRCUMSTANCES OF THE DEATH',
      label: 'WHAT WERE THE CIRCUMSTANCES OF THE DEATH',
      multipleAnswers: false,
      answers: [
        {
          id: '179909',
          code: 'APPARENT SELF INFLICTED',
          active: true,
          label: 'APPARENT SELF INFLICTED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44382',
        },
        {
          id: '179908',
          code: 'APPARENT NATURAL CAUSES',
          active: true,
          label: 'APPARENT NATURAL CAUSES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44382',
        },
        {
          id: '179907',
          code: 'ACCIDENTAL',
          active: true,
          label: 'ACCIDENTAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44382',
        },
        {
          id: '179910',
          code: 'SUSPICIOUS CIRCUMSTANCES',
          active: true,
          label: 'SUSPICIOUS CIRCUMSTANCES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44382',
        },
      ],
    },
    '44434': {
      id: '44434',
      active: true,
      code: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          id: '179932',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44839',
        },
        {
          id: '179931',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44839',
        },
      ],
    },
    '44645': {
      id: '44645',
      active: true,
      code: 'HAVE NEXT OF KIN BEEN INFORMED',
      label: 'HAVE NEXT OF KIN BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          id: '180738',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44397',
        },
        {
          id: '180737',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44397',
        },
      ],
    },
    '44702': {
      id: '44702',
      active: true,
      code: 'WHAT TIME WAS DEATH PRONOUNCED',
      label: 'WHAT TIME WAS DEATH PRONOUNCED',
      multipleAnswers: true,
      answers: [
        {
          id: '180957',
          code: 'DATE',
          active: true,
          label: 'DATE',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44425',
        },
        {
          id: '180958',
          code: 'TIME',
          active: true,
          label: 'TIME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44425',
        },
      ],
    },
    '44748': {
      id: '44748',
      active: true,
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          id: '181102',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44142',
        },
        {
          id: '181101',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44142',
        },
      ],
    },
    '44751': {
      id: '44751',
      active: true,
      code: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      label: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          id: '181107',
          code: 'SPECIFY',
          active: true,
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44395',
        },
      ],
    },
    '44839': {
      id: '44839',
      active: true,
      code: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          id: '181347',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44748',
        },
        {
          id: '181346',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44748',
        },
      ],
    },
    '45031': {
      id: '45031',
      active: true,
      code: 'WAS THE PERSON TAKEN TO AN OUTSIDE HOSPITAL',
      label: 'WAS THE PERSON TAKEN TO AN OUTSIDE HOSPITAL',
      multipleAnswers: false,
      answers: [
        {
          id: '182063',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44248',
        },
        {
          id: '182062',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44248',
        },
      ],
    },
    '45054': {
      id: '45054',
      active: true,
      code: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          id: '182204',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44434',
        },
        {
          id: '182205',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44839',
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
    {
      prisonerRole: 'ASSISTED_STAFF',
      onlyOneAllowed: false,
      active: true,
    },
    {
      prisonerRole: 'PERPETRATOR',
      onlyOneAllowed: false,
      active: true,
    },
    {
      prisonerRole: 'PRESENT_AT_SCENE',
      onlyOneAllowed: false,
      active: true,
    },
    {
      prisonerRole: 'SUSPECTED_INVOLVED',
      onlyOneAllowed: false,
      active: true,
    },
  ],
} as const

export default DEATH_OTHER

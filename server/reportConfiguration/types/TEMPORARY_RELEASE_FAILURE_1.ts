// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2025-04-01T22:59:43.998Z

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

export const TEMPORARY_RELEASE_FAILURE_1: IncidentTypeConfiguration = {
  incidentType: 'TEMPORARY_RELEASE_FAILURE_1',
  active: false,
  startingQuestionId: '44885',
  questions: {
    '44259': {
      id: '44259',
      active: false,
      code: 'HAS THE PRISONER BEEN CHARGED WITH A FURTHER OFFENCE',
      label: 'Has the prisoner been charged with a further offence?',
      multipleAnswers: false,
      answers: [
        {
          id: '179344',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44772',
        },
        {
          id: '179345',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44266': {
      id: '44266',
      active: false,
      code: 'HAS THE PRISONER BEEN CHARGED WITH A FURTHER OFFENCE',
      label: 'Has the prisoner been charged with a further offence?',
      multipleAnswers: false,
      answers: [
        {
          id: '179358',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44694',
        },
        {
          id: '179359',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
      ],
    },
    '44345': {
      id: '44345',
      active: false,
      code: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      label: 'Is the incident the subject of a police investigation?',
      multipleAnswers: false,
      answers: [
        {
          id: '179663',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44893',
        },
        {
          id: '179662',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44893',
        },
      ],
    },
    '44351': {
      id: '44351',
      active: false,
      code: 'WAS THE BREACH CHARGED WITH A FURTHER OFFENCE',
      label: 'Was the breach charged with a further offence?',
      multipleAnswers: false,
      answers: [
        {
          id: '179679',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44934',
        },
        {
          id: '179680',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45160',
        },
      ],
    },
    '44358': {
      id: '44358',
      active: false,
      code: 'WAS THE BREACH FAILING TO RETURN ON TIME',
      label: 'Was the breach failing to return on time?',
      multipleAnswers: false,
      answers: [
        {
          id: '179705',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179704',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44351',
        },
      ],
    },
    '44459': {
      id: '44459',
      active: false,
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'Is there any media interest in this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '180013',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44736',
        },
        {
          id: '180012',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44736',
        },
      ],
    },
    '44602': {
      id: '44602',
      active: false,
      code: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      label: 'Has any prosecution taken place or is any pending?',
      multipleAnswers: false,
      answers: [
        {
          id: '180607',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '180606',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44694': {
      id: '44694',
      active: false,
      code: 'WITH WHAT OFFENCE HAS THE PRISONER BEEN CHARGED',
      label: 'With what offence has the prisoner been charged?',
      multipleAnswers: true,
      answers: [
        {
          id: '180902',
          code: 'MURDER/ATTEMPTED MURDER',
          active: true,
          label: 'Murder/attempted murder',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '180901',
          code: 'MANSLAUGHTER',
          active: true,
          label: 'Manslaughter',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '180898',
          code: 'ASSAULT',
          active: true,
          label: 'Assault',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '180906',
          code: 'RAPE/ATTEMPTED RAPE',
          active: true,
          label: 'Rape/attempted rape',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '180904',
          code: 'OTHER SEXUAL OFFENCE',
          active: true,
          label: 'Other sexual offence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '180908',
          code: 'THEFT',
          active: true,
          label: 'Theft',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '180907',
          code: 'ROBBERY',
          active: true,
          label: 'Robbery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '180900',
          code: 'FIREARM OFFENCE',
          active: true,
          label: 'Firearm offence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '180899',
          code: 'DRUG OFFENCE',
          active: true,
          label: 'Drug offence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '180909',
          code: 'VEHICLE CRIME',
          active: true,
          label: 'Vehicle crime',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '180905',
          code: 'PUBLIC ORDER OFFENCE',
          active: true,
          label: 'Public order offence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '180903',
          code: 'OTHER',
          active: true,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44602',
        },
      ],
    },
    '44736': {
      id: '44736',
      active: false,
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'Has the prison service press office been informed?',
      multipleAnswers: false,
      answers: [
        {
          id: '181072',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44942',
        },
        {
          id: '181071',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44942',
        },
      ],
    },
    '44772': {
      id: '44772',
      active: false,
      code: 'IS THAT OFFENCE UNDER THE PRISONERS (RETURN TO CUSTODY)',
      label: 'Is that offence under the prisoners (return to custody)?',
      multipleAnswers: false,
      answers: [
        {
          id: '181162',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44266',
        },
        {
          id: '181163',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44694',
        },
      ],
    },
    '44826': {
      id: '44826',
      active: false,
      code: 'HAS PRISONER BEEN RECAPTURED',
      label: 'Has prisoner been recaptured?',
      multipleAnswers: false,
      answers: [
        {
          id: '181315',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44997',
        },
        {
          id: '181316',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44885': {
      id: '44885',
      active: false,
      code: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      label: 'Were the police informed of the incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '181534',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44345',
        },
        {
          id: '181535',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44893',
        },
      ],
    },
    '44893': {
      id: '44893',
      active: false,
      code: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      label: 'Is the incident the subject of an internal investigation?',
      multipleAnswers: false,
      answers: [
        {
          id: '181561',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44926',
        },
        {
          id: '181560',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44926',
        },
      ],
    },
    '44926': {
      id: '44926',
      active: false,
      code: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      label: "Is the incident subject to a governor's adjudication?",
      multipleAnswers: false,
      answers: [
        {
          id: '181683',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44459',
        },
        {
          id: '181682',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44459',
        },
      ],
    },
    '44934': {
      id: '44934',
      active: false,
      code: 'WITH WHAT OFFENCE HAS THE PRISONER BEEN CHARGED',
      label: 'With what offence has the prisoner been charged?',
      multipleAnswers: true,
      answers: [
        {
          id: '181735',
          code: 'MURDER/ATTEMPTED MURDER',
          active: true,
          label: 'Murder/attempted murder',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '181734',
          code: 'MANSLAUGHTER',
          active: true,
          label: 'Manslaughter',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '181731',
          code: 'ASSAULT',
          active: true,
          label: 'Assault',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '181739',
          code: 'RAPE/ATTEMPTED RAPE',
          active: true,
          label: 'Rape/attempted rape',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '181737',
          code: 'OTHER SEXUAL OFFENCE',
          active: true,
          label: 'Other sexual offence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '181741',
          code: 'THEFT',
          active: true,
          label: 'Theft',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '181740',
          code: 'ROBBERY',
          active: true,
          label: 'Robbery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '181733',
          code: 'FIREARM OFFENCE',
          active: true,
          label: 'Firearm offence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '181732',
          code: 'DRUG OFFENCE',
          active: true,
          label: 'Drug offence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '181742',
          code: 'VEHICLE CRIME',
          active: true,
          label: 'Vehicle crime',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '181738',
          code: 'PUBLIC ORDER OFFENCE',
          active: true,
          label: 'Public order offence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          id: '181736',
          code: 'OTHER',
          active: true,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44602',
        },
      ],
    },
    '44942': {
      id: '44942',
      active: false,
      code: 'WHAT TYPE OF LICENCE WAS BREACHED',
      label: 'What type of licence was breached?',
      multipleAnswers: false,
      answers: [
        {
          id: '181764',
          code: 'COMPASSIONATE',
          active: true,
          label: 'Compassionate',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45081',
        },
        {
          id: '181765',
          code: 'FACILITY',
          active: true,
          label: 'Facility',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45081',
        },
        {
          id: '181766',
          code: 'RESETTLEMENT',
          active: true,
          label: 'Resettlement',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45081',
        },
        {
          id: '181763',
          code: 'COMMUNITY VISIT',
          active: true,
          label: 'Community visit',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45081',
        },
      ],
    },
    '44997': {
      id: '44997',
      active: false,
      code: 'HOW WAS THE PRISONER RECAPTURED',
      label: 'How was the prisoner recaptured?',
      multipleAnswers: false,
      answers: [
        {
          id: '181950',
          code: 'POLICE ARREST',
          active: true,
          label: 'Police arrest',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44259',
        },
        {
          id: '181951',
          code: 'PRISON STAFF ARREST',
          active: true,
          label: 'Prison staff arrest',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44259',
        },
        {
          id: '181952',
          code: 'SURRENDER',
          active: true,
          label: 'Surrender',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44259',
        },
        {
          id: '181949',
          code: 'OTHER',
          active: true,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44259',
        },
      ],
    },
    '45081': {
      id: '45081',
      active: false,
      code: 'WAS THE BREACH FAILING TO RETURN REPORTED TO POLICE AS UAL',
      label: 'Was the breach failing to return reported to police as UAL?',
      multipleAnswers: false,
      answers: [
        {
          id: '182285',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44826',
        },
        {
          id: '182284',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44358',
        },
      ],
    },
    '45160': {
      id: '45160',
      active: false,
      code: 'WAS THE BREACH FAILING TO COMPLY WITH ANY OTHER LICENCE CONDITIONS',
      label: 'Was the breach failing to comply with any other licence conditions?',
      multipleAnswers: false,
      answers: [
        {
          id: '182600',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182599',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
  prisonerRoles: [
    {
      prisonerRole: 'LICENSE_FAILURE',
      onlyOneAllowed: false,
      active: true,
    },
  ],
} as const

export default TEMPORARY_RELEASE_FAILURE_1

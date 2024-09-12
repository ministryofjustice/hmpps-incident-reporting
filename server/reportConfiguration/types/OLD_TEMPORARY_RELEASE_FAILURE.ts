// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:51.308Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_TEMPORARY_RELEASE_FAILURE: IncidentTypeConfiguration = {
  incidentType: 'OLD_TEMPORARY_RELEASE_FAILURE',
  active: false,
  startingQuestionId: '44885',
  questions: {
    '44259': {
      id: '44259',
      label: 'HAS THE PRISONER BEEN CHARGED WITH A FURTHER OFFENCE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44772',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44266': {
      id: '44266',
      label: 'HAS THE PRISONER BEEN CHARGED WITH A FURTHER OFFENCE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44694',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
      ],
    },
    '44345': {
      id: '44345',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44893',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44893',
        },
      ],
    },
    '44351': {
      id: '44351',
      label: 'WAS THE BREACH CHARGED WITH A FURTHER OFFENCE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44934',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45160',
        },
      ],
    },
    '44358': {
      id: '44358',
      label: 'WAS THE BREACH FAILING TO RETURN ON TIME',
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
          nextQuestionId: '44351',
        },
      ],
    },
    '44459': {
      id: '44459',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44736',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44736',
        },
      ],
    },
    '44602': {
      id: '44602',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
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
    '44694': {
      id: '44694',
      label: 'WITH WHAT OFFENCE HAS THE PRISONER BEEN CHARGED',
      multipleAnswers: true,
      answers: [
        {
          label: 'MURDER/ATTEMPTED MURDER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'MANSLAUGHTER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'ASSAULT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'RAPE/ATTEMPTED RAPE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'OTHER SEXUAL OFFENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'THEFT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'ROBBERY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'FIREARM OFFENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'DRUG OFFENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'VEHICLE CRIME',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'PUBLIC ORDER OFFENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44602',
        },
      ],
    },
    '44736': {
      id: '44736',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44942',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44942',
        },
      ],
    },
    '44772': {
      id: '44772',
      label: 'IS THAT OFFENCE UNDER THE PRISONERS (RETURN TO CUSTODY)',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44266',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44694',
        },
      ],
    },
    '44826': {
      id: '44826',
      label: 'HAS PRISONER BEEN RECAPTURED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44997',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44885': {
      id: '44885',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44345',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44893',
        },
      ],
    },
    '44893': {
      id: '44893',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44926',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44926',
        },
      ],
    },
    '44926': {
      id: '44926',
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44459',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44459',
        },
      ],
    },
    '44934': {
      id: '44934',
      label: 'WITH WHAT OFFENCE HAS THE PRISONER BEEN CHARGED',
      multipleAnswers: true,
      answers: [
        {
          label: 'MURDER/ATTEMPTED MURDER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'MANSLAUGHTER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'ASSAULT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'RAPE/ATTEMPTED RAPE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'OTHER SEXUAL OFFENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'THEFT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'ROBBERY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'FIREARM OFFENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'DRUG OFFENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'VEHICLE CRIME',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'PUBLIC ORDER OFFENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44602',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44602',
        },
      ],
    },
    '44942': {
      id: '44942',
      label: 'WHAT TYPE OF LICENCE WAS BREACHED',
      multipleAnswers: false,
      answers: [
        {
          label: 'COMPASSIONATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45081',
        },
        {
          label: 'FACILITY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45081',
        },
        {
          label: 'RESETTLEMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45081',
        },
        {
          label: 'COMMUNITY VISIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45081',
        },
      ],
    },
    '44997': {
      id: '44997',
      label: 'HOW WAS THE PRISONER RECAPTURED',
      multipleAnswers: false,
      answers: [
        {
          label: 'POLICE ARREST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44259',
        },
        {
          label: 'PRISON STAFF ARREST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44259',
        },
        {
          label: 'SURRENDER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44259',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44259',
        },
      ],
    },
    '45081': {
      id: '45081',
      label: 'WAS THE BREACH FAILING TO RETURN REPORTED TO POLICE AS UAL',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44826',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44358',
        },
      ],
    },
    '45160': {
      id: '45160',
      label: 'WAS THE BREACH FAILING TO COMPLY WITH ANY OTHER LICENCE CONDITIONS',
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
  },
} as const

export default OLD_TEMPORARY_RELEASE_FAILURE

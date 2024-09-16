// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:32.335Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const ABSCONDER: IncidentTypeConfiguration = {
  incidentType: 'ABSCONDER',
  active: true,
  startingQuestionId: '44534',
  questions: {
    '44198': {
      id: '44198',
      label: 'HAS THE PRISONER BEEN CHARGED WITH A FURTHER OFFENCE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44854',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44615',
        },
      ],
    },
    '44271': {
      id: '44271',
      label: 'WAS ANY FORM OF DECEPTION USED IN THE ABSCOND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44284',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44284',
        },
      ],
    },
    '44284': {
      id: '44284',
      label: 'WAS THE ABSCOND IN THE COMPANY OF OTHER PRISONERS',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44861',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44861',
        },
      ],
    },
    '44326': {
      id: '44326',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES (ENTER DATE)',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44717',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44717',
        },
      ],
    },
    '44402': {
      id: '44402',
      label: 'HOW WAS THE PRISONER RECAPTURED',
      multipleAnswers: false,
      answers: [
        {
          label: 'POLICE ARREST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44198',
        },
        {
          label: 'PRISON STAFF ARREST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44198',
        },
        {
          label: 'SURRENDER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44198',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44198',
        },
      ],
    },
    '44416': {
      id: '44416',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44615',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44615',
        },
      ],
    },
    '44467': {
      id: '44467',
      label: 'ESTIMATED COST OF DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER AMOUNT IN POUND STERLING',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44534': {
      id: '44534',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44941',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44766',
        },
      ],
    },
    '44609': {
      id: '44609',
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45077',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45077',
        },
      ],
    },
    '44615': {
      id: '44615',
      label: 'WAS DAMAGE CAUSED TO PRISON PROPERTY',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44868',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44976',
        },
      ],
    },
    '44717': {
      id: '44717',
      label: 'FROM WHICH AREA DID THE ABSCOND TAKE PLACE',
      multipleAnswers: false,
      answers: [
        {
          label: 'FROM ESTABLISHMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44271',
        },
        {
          label: 'SUPERVISED OUTSIDE PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44271',
        },
        {
          label: 'UNSUPERVISED OUTSIDE PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44271',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44271',
        },
      ],
    },
    '44766': {
      id: '44766',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44609',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44609',
        },
      ],
    },
    '44800': {
      id: '44800',
      label: 'DESCRIBE THE DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'MINOR',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44467',
        },
        {
          label: 'SERIOUS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44467',
        },
        {
          label: 'EXTENSIVE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44467',
        },
      ],
    },
    '44854': {
      id: '44854',
      label: 'WITH WHAT OFFENCE HAS THE PRISONER BEEN CHARGED',
      multipleAnswers: true,
      answers: [
        {
          label: 'MURDER/ATTEMPTED MURDER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44416',
        },
        {
          label: 'MANSLAUGHTER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44416',
        },
        {
          label: 'ASSAULT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44416',
        },
        {
          label: 'RAPE/ATTEMPTED RAPE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44416',
        },
        {
          label: 'OTHER SEXUAL OFFENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44416',
        },
        {
          label: 'THEFT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44416',
        },
        {
          label: 'ROBBERY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44416',
        },
        {
          label: 'FIREARM OFFENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44416',
        },
        {
          label: 'DRUG OFFENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44416',
        },
        {
          label: 'VEHICLE CRIME',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44416',
        },
        {
          label: 'PUBLIC ORDER OFFENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44416',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44416',
        },
      ],
    },
    '44861': {
      id: '44861',
      label: 'HAS PRISONER BEEN RECAPTURED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES (ENTER DATE)',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44402',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44615',
        },
      ],
    },
    '44868': {
      id: '44868',
      label: 'DESCRIBE THE DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'MINOR',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44976',
        },
        {
          label: 'SERIOUS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44976',
        },
        {
          label: 'EXTENSIVE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44976',
        },
      ],
    },
    '44941': {
      id: '44941',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44766',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44766',
        },
      ],
    },
    '44976': {
      id: '44976',
      label: 'WAS ANY DAMAGE CAUSED TO PRIVATE PROPERTY DURING ABSCOND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44800',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '45077': {
      id: '45077',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44326',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44326',
        },
      ],
    },
  },
} as const

export default ABSCONDER

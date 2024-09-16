// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:52.556Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_TEMPORARY_RELEASE_FAILURE2: IncidentTypeConfiguration = {
  incidentType: 'OLD_TEMPORARY_RELEASE_FAILURE2',
  active: false,
  startingQuestionId: '55179',
  questions: {
    '55179': {
      id: '55179',
      label: 'What was the main management outcome of the incident?',
      multipleAnswers: true,
      answers: [
        {
          label: 'No further action',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55180',
        },
        {
          label: 'IEP Regression',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55180',
        },
        {
          label: 'Placed on report/adjudication referal',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55180',
        },
        {
          label: 'Police referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55180',
        },
        {
          label: 'CPS referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55180',
        },
        {
          label: 'Prosecution referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55180',
        },
      ],
    },
    '55180': {
      id: '55180',
      label: 'Is any member of staff facing disciplinary charges?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55181',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55181',
        },
      ],
    },
    '55181': {
      id: '55181',
      label: 'Was ROTL Standard or Restricted?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Standard ROTL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55182',
        },
        {
          label: 'Restricted ROTL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55182',
        },
      ],
    },
    '55182': {
      id: '55182',
      label: 'What Type Of Temporary Licence Was Breached?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Resettlement Day',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55183',
        },
        {
          label: 'Resettlement Overnight',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55183',
        },
        {
          label: 'Childcare Resettlement',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55183',
        },
        {
          label: 'Special Purpose (medical)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55183',
        },
        {
          label: 'Special Purpose (other)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55183',
        },
      ],
    },
    '55183': {
      id: '55183',
      label: 'What Was The Specific Purpose Of Temporary Release?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Court / Legal / Police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55184',
        },
        {
          label: 'Maintaining Family Ties',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55184',
        },
        {
          label: 'Other Compassionate Reason (emergency child care, attend funeral etc.)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55184',
        },
        {
          label: 'Other RDR Linked to Sentence Plan',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55184',
        },
        {
          label: 'Training Or Education',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55184',
        },
        {
          label: 'Medical',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55184',
        },
        {
          label: 'Paid and unpaid work placements',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55184',
        },
        {
          label: 'Marriage or civil partnership of the offender',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55184',
        },
        {
          label: 'Inter-prison transfers',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55184',
        },
      ],
    },
    '55184': {
      id: '55184',
      label: 'Were UAL contingency plans (including notification to the police) activated?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55185',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55188',
        },
      ],
    },
    '55185': {
      id: '55185',
      label: 'Why were UAL contingency plans activated?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Apparent failure to return',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55186',
        },
        {
          label: "Revocation of the prisoner's licence",
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55186',
        },
      ],
    },
    '55186': {
      id: '55186',
      label: 'Has the prisoner surrendered/been recaptured?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes (Enter Date)',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '55187',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55188',
        },
      ],
    },
    '55187': {
      id: '55187',
      label: 'How did prisoner surrender/get recaptured?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Surrendered before midnight on return date',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55188',
        },
        {
          label: 'Surrender To HMPS (after midnight on return date)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55188',
        },
        {
          label: 'Surrender To Police  (after midnight on return date)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55188',
        },
        {
          label: 'Arrest By HMPS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55188',
        },
        {
          label: 'Arrest By Police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55188',
        },
        {
          label: 'Admitted to hospital for treatment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55188',
        },
        {
          label: 'Deceased',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55188',
        },
        {
          label: 'Other (Provide Details)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '55188',
        },
      ],
    },
    '55188': {
      id: '55188',
      label: 'Was the prisoner arrested for an offence allegedly committed whilst temporarily released?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55189',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
      ],
    },
    '55189': {
      id: '55189',
      label: 'Has The Prisoner Been Charged With Any Offence (INCLUDE the offence of failure to return)?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55190',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
      ],
    },
    '55190': {
      id: '55190',
      label: 'With What Type Of Offence or Offences Has The Prisoner Been Charged?',
      multipleAnswers: true,
      answers: [
        {
          label: 'Violence Against The Person',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55191',
        },
        {
          label: 'Sexual Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55191',
        },
        {
          label: 'Robbery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55191',
        },
        {
          label: 'Burglary',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55191',
        },
        {
          label: 'Theft And Handling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55191',
        },
        {
          label: 'Fraud And Forgery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55191',
        },
        {
          label: 'Drug Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55191',
        },
        {
          label: 'Motoring Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55191',
        },
        {
          label: 'Failure To Return From ROTL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55191',
        },
        {
          label: 'Other Offence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55191',
        },
      ],
    },
    '55191': {
      id: '55191',
      label: 'Has The Prisoner Been Found Guilty Of Offences Committed On ROTL?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55192',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
      ],
    },
    '55192': {
      id: '55192',
      label: 'What Offence Or Offences Has The Prisoner Been Found Guilty Of?',
      multipleAnswers: true,
      answers: [
        {
          label: 'Violence Against The Person',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
        {
          label: 'Sexual Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
        {
          label: 'Robbery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
        {
          label: 'Burglary',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
        {
          label: 'Theft And Handling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
        {
          label: 'Fraud And Forgery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
        {
          label: 'Drug Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
        {
          label: 'Motoring Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
        {
          label: 'Failure To Return From ROTL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
        {
          label: 'Other Offence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55193',
        },
      ],
    },
    '55193': {
      id: '55193',
      label: 'Was Any Part Of The Failure Failing To Comply With Any Other Licence Conditions (Standard or Bespoke)?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55194',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55195',
        },
      ],
    },
    '55194': {
      id: '55194',
      label: 'Please Specify Which Conditions apply',
      multipleAnswers: true,
      answers: [
        {
          label: 'Location',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55195',
        },
        {
          label: 'Alcohol/drugs (under influence)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55195',
        },
        {
          label: 'Gambling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55195',
        },
        {
          label: 'Finds (fill in separate report)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55195',
        },
        {
          label: 'Social Media',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55195',
        },
        {
          label: 'Bad Behaviour',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55195',
        },
        {
          label: 'Media Contact',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55195',
        },
        {
          label: 'Other (Provide Details)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '55195',
        },
      ],
    },
    '55195': {
      id: '55195',
      label: 'Was failure due to matters beyond the prisoner’s control?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55196',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '55196',
        },
      ],
    },
    '55196': {
      id: '55196',
      label:
        'Have SFO Team, Offender Manager In The Community, Victim Liaison Officer And Employer (where appropriate) been informed?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes (Enter Date)',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '55197',
        },
        {
          label: 'No (Enter Reason)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '55197',
        },
      ],
    },
    '55197': {
      id: '55197',
      label: 'Has The Deputy Director Of Custody Been Informed?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes (Enter Date)',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '55198',
        },
        {
          label: 'No (Enter Reason)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '55198',
        },
      ],
    },
    '55198': {
      id: '55198',
      label: 'Have PPCS Been Informed?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes (Enter Date)',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
          label: 'No (Enter Reasons)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
} as const

export default OLD_TEMPORARY_RELEASE_FAILURE2

// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:53.145Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const TEMPORARY_RELEASE_FAILURE: IncidentTypeConfiguration = {
  incidentType: 'TEMPORARY_RELEASE_FAILURE',
  active: true,
  startingQuestionId: '59179',
  questions: {
    '59179': {
      id: '59179',
      label: 'What was the main management outcome of the incident?',
      multipleAnswers: true,
      answers: [
        {
          label: 'No further action',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59180',
        },
        {
          label: 'IEP Regression',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59180',
        },
        {
          label: 'Placed on report/adjudication referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59180',
        },
        {
          label: 'Police referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59180',
        },
        {
          label: 'CPS referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59180',
        },
        {
          label: 'Prosecution referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59180',
        },
      ],
    },
    '59180': {
      id: '59180',
      label: 'Is any member of staff facing disciplinary charges?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59181',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59181',
        },
      ],
    },
    '59181': {
      id: '59181',
      label: 'Was ROTL Standard or Restricted?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Standard ROTL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59182',
        },
        {
          label: 'Restricted ROTL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59182',
        },
      ],
    },
    '59182': {
      id: '59182',
      label: 'What Type Of Temporary Licence Was Breached?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Resettlement Day',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59183',
        },
        {
          label: 'Resettlement Overnight',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59183',
        },
        {
          label: 'Childcare Resettlement',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59183',
        },
        {
          label: 'Special Purpose (medical)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59183',
        },
        {
          label: 'Special Purpose (other)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59183',
        },
      ],
    },
    '59183': {
      id: '59183',
      label: 'What Was The Specific Purpose Of Temporary Release?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Training or Education',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          label: 'Unpaid Work Placements',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          label: 'Paid Work Placements',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          label: 'Maintain Family Ties',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          label: 'Outside Prison Activity',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          label: 'Accommodation Related',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          label: 'Other Day Release linked to Sentence/Resettlement Plan',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          label: 'Resettlement Overnight Release',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          label: 'Childcare Resettlement Leave',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          label: 'Funeral/Visiting Dying Relative',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          label: 'Medical Treatment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          label: 'Other Compassionate Reason',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          label: 'Court/Legal/Police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
      ],
    },
    '59184': {
      id: '59184',
      label: 'Were UAL contingency plans (including notification to the police) activated?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59185',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
      ],
    },
    '59185': {
      id: '59185',
      label: 'Why were UAL contingency plans activated?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Apparent failure to return',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59186',
        },
        {
          label: "Revocation of the prisoner's licence",
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59186',
        },
      ],
    },
    '59186': {
      id: '59186',
      label: 'Has the prisoner surrendered/been recaptured?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes (Enter Date)',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '59187',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
      ],
    },
    '59187': {
      id: '59187',
      label: 'How did prisoner surrender/get recaptured?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Surrendered before midnight on return date',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          label: 'Surrender To HMPS (after midnight on return date)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          label: 'Surrender To Police (after midnight on return date)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          label: 'Arrest By HMPS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          label: 'Arrest By Police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          label: 'Admitted to hospital for treatment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          label: 'Deceased',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          label: 'Other (Provide Details)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59188',
        },
      ],
    },
    '59188': {
      id: '59188',
      label: 'Was the prisoner late returning back to prison?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59189',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59189',
        },
      ],
    },
    '59189': {
      id: '59189',
      label:
        'Was prisoner arrested for an offence allegedly committed whilst temp released? (do not include FAILURE TO RETURN)',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59190',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
      ],
    },
    '59190': {
      id: '59190',
      label: 'For What Type Of Offence Or Offences Has The Prisoner Been Arrested?',
      multipleAnswers: true,
      answers: [
        {
          label: 'Violence Against The Person',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          label: 'Sexual Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          label: 'Robbery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          label: 'Burglary',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          label: 'Theft And Handling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          label: 'Fraud And Forgery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          label: 'Drug Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          label: 'Motoring Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          label: 'Other Offence (Please specify)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          label: 'Unknown',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
      ],
    },
    '59191': {
      id: '59191',
      label: 'Has The Prisoner Been Charged With Any Offence (INCLUDE the offence of failure to return)?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59192',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
      ],
    },
    '59192': {
      id: '59192',
      label: 'With What Type Of Offence or Offences Has The Prisoner Been Charged?',
      multipleAnswers: true,
      answers: [
        {
          label: 'Violence Against The Person',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          label: 'Sexual Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          label: 'Robbery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          label: 'Burglary',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          label: 'Theft And Handling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          label: 'Fraud And Forgery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          label: 'Drug Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          label: 'Motoring Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          label: 'Other Offence (Please specify)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59193',
        },
      ],
    },
    '59193': {
      id: '59193',
      label: 'Has The Prisoner Been Found Guilty Of Offences Committed On ROTL?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59194',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
      ],
    },
    '59194': {
      id: '59194',
      label: 'What Offence Or Offences Has The Prisoner Been Found Guilty Of?',
      multipleAnswers: true,
      answers: [
        {
          label: 'Violence Against The Person',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          label: 'Sexual Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          label: 'Robbery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          label: 'Burglary',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          label: 'Theft And Handling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          label: 'Fraud And Forgery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          label: 'Drug Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          label: 'Motoring Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          label: 'Failure To Return From ROTL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          label: 'Other Offence (Please specify)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59195',
        },
      ],
    },
    '59195': {
      id: '59195',
      label: 'Was Any Part Of The Failure Failing To Comply With Any Other Licence Conditions (Standard or Bespoke)?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59196',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
      ],
    },
    '59196': {
      id: '59196',
      label: 'Please Specify Which Conditions apply',
      multipleAnswers: true,
      answers: [
        {
          label: 'Location',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          label: 'Alcohol/drugs (under influence)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          label: 'Gambling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          label: 'Finds (fill in separate report)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          label: 'Social Media',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          label: 'Bad Behaviour',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          label: 'Media Contact',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          label: 'Other (Provide Details)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59197',
        },
      ],
    },
    '59197': {
      id: '59197',
      label: 'Was failure due to matters beyond the prisoner’s control?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59198',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59198',
        },
      ],
    },
    '59198': {
      id: '59198',
      label: 'Has the NOMS SFO Team been informed (SFO CASES only)',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '59199',
        },
        {
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59199',
        },
      ],
    },
    '59199': {
      id: '59199',
      label: 'Has the Offender Manager been informed?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '59200',
        },
        {
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59200',
        },
      ],
    },
    '59200': {
      id: '59200',
      label: 'Has the Victim Liaison Officer been informed (where appropriate)?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '59201',
        },
        {
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59201',
        },
      ],
    },
    '59201': {
      id: '59201',
      label: 'Has the ROTL Placement Provider been informed (where appropriate)?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '59202',
        },
        {
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59202',
        },
      ],
    },
    '59202': {
      id: '59202',
      label: 'Has The Deputy Director Of Custody Been Informed?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '59203',
        },
        {
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59203',
        },
      ],
    },
    '59203': {
      id: '59203',
      label: 'Have PPCS Been Informed?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
} as const

export default TEMPORARY_RELEASE_FAILURE

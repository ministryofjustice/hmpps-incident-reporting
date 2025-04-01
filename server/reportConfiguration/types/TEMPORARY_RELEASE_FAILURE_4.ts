// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2025-04-01T22:59:45.944Z

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

export const TEMPORARY_RELEASE_FAILURE_4: IncidentTypeConfiguration = {
  incidentType: 'TEMPORARY_RELEASE_FAILURE_4',
  active: true,
  startingQuestionId: '59179',
  questions: {
    '59179': {
      id: '59179',
      active: true,
      code: 'What was the main management outcome of the incident?',
      label: 'What was the main management outcome of the incident?',
      multipleAnswers: true,
      answers: [
        {
          id: '210684',
          code: 'No further action',
          active: true,
          label: 'No further action',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59180',
        },
        {
          id: '210685',
          code: 'IEP Regression',
          active: true,
          label: 'IEP regression',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59180',
        },
        {
          id: '210686',
          code: 'Placed on report/adjudication referral',
          active: true,
          label: 'Placed on report/adjudication referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59180',
        },
        {
          id: '210687',
          code: 'Police referral',
          active: true,
          label: 'Police referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59180',
        },
        {
          id: '210688',
          code: 'CPS referral',
          active: true,
          label: 'CPS referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59180',
        },
        {
          id: '210689',
          code: 'Prosecution referral',
          active: true,
          label: 'Prosecution referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59180',
        },
      ],
    },
    '59180': {
      id: '59180',
      active: true,
      code: 'Is any member of staff facing disciplinary charges?',
      label: 'Is any member of staff facing disciplinary charges?',
      multipleAnswers: false,
      answers: [
        {
          id: '210690',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59181',
        },
        {
          id: '210691',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59181',
        },
      ],
    },
    '59181': {
      id: '59181',
      active: true,
      code: 'Was ROTL Standard or Restricted?',
      label: 'Was ROTL standard or restricted?',
      multipleAnswers: false,
      answers: [
        {
          id: '210692',
          code: 'Standard ROTL',
          active: true,
          label: 'Standard ROTL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59182',
        },
        {
          id: '210693',
          code: 'Restricted ROTL',
          active: true,
          label: 'Restricted ROTL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59182',
        },
      ],
    },
    '59182': {
      id: '59182',
      active: true,
      code: 'What Type Of Temporary Licence Was Breached?',
      label: 'What type of temporary licence was breached?',
      multipleAnswers: false,
      answers: [
        {
          id: '210694',
          code: 'Resettlement Day',
          active: true,
          label: 'Resettlement day',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59183',
        },
        {
          id: '210695',
          code: 'Resettlement Overnight',
          active: true,
          label: 'Resettlement overnight',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59183',
        },
        {
          id: '210696',
          code: 'Childcare Resettlement',
          active: true,
          label: 'Childcare resettlement',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59183',
        },
        {
          id: '210697',
          code: 'Special Purpose (medical)',
          active: true,
          label: 'Special purpose (medical)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59183',
        },
        {
          id: '210698',
          code: 'Special Purpose (other)',
          active: true,
          label: 'Special purpose (other)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59183',
        },
      ],
    },
    '59183': {
      id: '59183',
      active: true,
      code: 'What Was The Specific Purpose Of Temporary Release?',
      label: 'What was the specific purpose of temporary release?',
      multipleAnswers: false,
      answers: [
        {
          id: '210699',
          code: 'Training or Education',
          active: true,
          label: 'Training or education',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          id: '210700',
          code: 'Unpaid Work Placements',
          active: true,
          label: 'Unpaid work placements',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          id: '210701',
          code: 'Paid Work Placements',
          active: true,
          label: 'Paid work placements',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          id: '210702',
          code: 'Maintain Family Ties',
          active: true,
          label: 'Maintain family ties',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          id: '210703',
          code: 'Outside Prison Activity',
          active: true,
          label: 'Outside prison activity',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          id: '210704',
          code: 'Accommodation Related',
          active: true,
          label: 'Accommodation related',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          id: '210705',
          code: 'Other Day Release linked to Sentence/Resettlement Plan',
          active: true,
          label: 'Other day release linked to sentence/resettlement plan',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          id: '210706',
          code: 'Resettlement Overnight Release',
          active: true,
          label: 'Resettlement overnight release',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          id: '210707',
          code: 'Childcare Resettlement Leave',
          active: true,
          label: 'Childcare resettlement leave',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          id: '210708',
          code: 'Funeral/Visiting Dying Relative',
          active: true,
          label: 'Funeral/visiting dying relative',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          id: '210709',
          code: 'Medical Treatment',
          active: true,
          label: 'Medical treatment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          id: '210710',
          code: 'Other Compassionate Reason',
          active: true,
          label: 'Other compassionate reason',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
        {
          id: '210711',
          code: 'Court/Legal/Police',
          active: true,
          label: 'Court/legal/police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59184',
        },
      ],
    },
    '59184': {
      id: '59184',
      active: true,
      code: 'Were UAL contingency plans (including notification to the police) activated?',
      label: 'Were UAL contingency plans (including notification to the police) activated?',
      multipleAnswers: false,
      answers: [
        {
          id: '210712',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59185',
        },
        {
          id: '210713',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
      ],
    },
    '59185': {
      id: '59185',
      active: true,
      code: 'Why were UAL contingency plans activated?',
      label: 'Why were UAL contingency plans activated?',
      multipleAnswers: false,
      answers: [
        {
          id: '210714',
          code: 'Apparent failure to return',
          active: true,
          label: 'Apparent failure to return',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59186',
        },
        {
          id: '210715',
          code: "Revocation of the prisoner's licence",
          active: true,
          label: "Revocation of the prisoner's licence",
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59186',
        },
      ],
    },
    '59186': {
      id: '59186',
      active: true,
      code: 'Has the prisoner surrendered/been recaptured?',
      label: 'Has the prisoner surrendered/been recaptured?',
      multipleAnswers: false,
      answers: [
        {
          id: '210716',
          code: 'Yes (Enter Date)',
          active: true,
          label: 'Yes (enter date)',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '59187',
        },
        {
          id: '210717',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
      ],
    },
    '59187': {
      id: '59187',
      active: true,
      code: 'How did prisoner surrender/get recaptured?',
      label: 'How did prisoner surrender/get recaptured?',
      multipleAnswers: false,
      answers: [
        {
          id: '210718',
          code: 'Surrendered before midnight on return date',
          active: true,
          label: 'Surrendered before midnight on return date',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          id: '210719',
          code: 'Surrender To HMPS (after midnight on return date)',
          active: true,
          label: 'Surrender to HMPS (after midnight on return date)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          id: '210720',
          code: 'Surrender To Police (after midnight on return date)',
          active: true,
          label: 'Surrender to police (after midnight on return date)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          id: '210721',
          code: 'Arrest By HMPS',
          active: true,
          label: 'Arrest by HMPS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          id: '210722',
          code: 'Arrest By Police',
          active: true,
          label: 'Arrest by police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          id: '210723',
          code: 'Admitted to hospital for treatment',
          active: true,
          label: 'Admitted to hospital for treatment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          id: '210724',
          code: 'Deceased',
          active: true,
          label: 'Deceased',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59188',
        },
        {
          id: '210725',
          code: 'Other (Provide Details)',
          active: true,
          label: 'Other (provide details)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59188',
        },
      ],
    },
    '59188': {
      id: '59188',
      active: true,
      code: 'Was the prisoner late returning back to prison?',
      label: 'Was the prisoner late returning back to prison?',
      multipleAnswers: false,
      answers: [
        {
          id: '210726',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59189',
        },
        {
          id: '210727',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59189',
        },
      ],
    },
    '59189': {
      id: '59189',
      active: true,
      code: 'Was prisoner arrested for an offence allegedly committed whilst temp released? (do not include FAILURE TO RETURN)',
      label:
        'Was prisoner arrested for an offence allegedly committed whilst temp released? (do not include failure to return)?',
      multipleAnswers: false,
      answers: [
        {
          id: '210728',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59190',
        },
        {
          id: '210729',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
      ],
    },
    '59190': {
      id: '59190',
      active: true,
      code: 'For What Type Of Offence Or Offences Has The Prisoner Been Arrested?',
      label: 'For what type of offence or offences has the prisoner been arrested?',
      multipleAnswers: true,
      answers: [
        {
          id: '210730',
          code: 'Violence Against The Person',
          active: true,
          label: 'Violence against the person',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          id: '210731',
          code: 'Sexual Offences',
          active: true,
          label: 'Sexual offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          id: '210732',
          code: 'Robbery',
          active: true,
          label: 'Robbery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          id: '210733',
          code: 'Burglary',
          active: true,
          label: 'Burglary',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          id: '210734',
          code: 'Theft And Handling',
          active: true,
          label: 'Theft and handling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          id: '210735',
          code: 'Fraud And Forgery',
          active: true,
          label: 'Fraud and forgery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          id: '210736',
          code: 'Drug Offences',
          active: true,
          label: 'Drug offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          id: '210737',
          code: 'Motoring Offences',
          active: true,
          label: 'Motoring offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          id: '210738',
          code: 'Other Offence (Please specify)',
          active: true,
          label: 'Other offence (please specify)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59191',
        },
        {
          id: '210739',
          code: 'Unknown',
          active: true,
          label: 'Unknown',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59191',
        },
      ],
    },
    '59191': {
      id: '59191',
      active: true,
      code: 'Has The Prisoner Been Charged With Any Offence (INCLUDE the offence of failure to return)?',
      label: 'Has the prisoner been charged with any offence (include the offence of failure to return)?',
      multipleAnswers: false,
      answers: [
        {
          id: '210740',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59192',
        },
        {
          id: '210741',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
      ],
    },
    '59192': {
      id: '59192',
      active: true,
      code: 'With What Type Of Offence or Offences Has The Prisoner Been Charged?',
      label: 'With what type of offence or offences has the prisoner been charged?',
      multipleAnswers: true,
      answers: [
        {
          id: '210742',
          code: 'Violence Against The Person',
          active: true,
          label: 'Violence against the person',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          id: '210743',
          code: 'Sexual Offences',
          active: true,
          label: 'Sexual offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          id: '210744',
          code: 'Robbery',
          active: true,
          label: 'Robbery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          id: '210745',
          code: 'Burglary',
          active: true,
          label: 'Burglary',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          id: '210746',
          code: 'Theft And Handling',
          active: true,
          label: 'Theft and handling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          id: '210747',
          code: 'Fraud And Forgery',
          active: true,
          label: 'Fraud and forgery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          id: '210748',
          code: 'Drug Offences',
          active: true,
          label: 'Drug offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          id: '210749',
          code: 'Motoring Offences',
          active: true,
          label: 'Motoring offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59193',
        },
        {
          id: '210750',
          code: 'Other Offence (Please specify)',
          active: true,
          label: 'Other offence (please specify)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59193',
        },
      ],
    },
    '59193': {
      id: '59193',
      active: true,
      code: 'Has The Prisoner Been Found Guilty Of Offences Committed On ROTL?',
      label: 'Has the prisoner been found guilty of offences committed on ROTL?',
      multipleAnswers: false,
      answers: [
        {
          id: '210751',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59194',
        },
        {
          id: '210752',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
      ],
    },
    '59194': {
      id: '59194',
      active: true,
      code: 'What Offence Or Offences Has The Prisoner Been Found Guilty Of?',
      label: 'What offence or offences has the prisoner been found guilty of?',
      multipleAnswers: true,
      answers: [
        {
          id: '210753',
          code: 'Violence Against The Person',
          active: true,
          label: 'Violence against the person',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          id: '210754',
          code: 'Sexual Offences',
          active: true,
          label: 'Sexual offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          id: '210755',
          code: 'Robbery',
          active: true,
          label: 'Robbery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          id: '210756',
          code: 'Burglary',
          active: true,
          label: 'Burglary',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          id: '210757',
          code: 'Theft And Handling',
          active: true,
          label: 'Theft and handling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          id: '210758',
          code: 'Fraud And Forgery',
          active: true,
          label: 'Fraud and forgery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          id: '210759',
          code: 'Drug Offences',
          active: true,
          label: 'Drug offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          id: '210760',
          code: 'Motoring Offences',
          active: true,
          label: 'Motoring offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          id: '210761',
          code: 'Failure To Return From ROTL',
          active: true,
          label: 'Failure to return from ROTL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59195',
        },
        {
          id: '210762',
          code: 'Other Offence (Please specify)',
          active: true,
          label: 'Other offence (please specify)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59195',
        },
      ],
    },
    '59195': {
      id: '59195',
      active: true,
      code: 'Was Any Part Of The Failure Failing To Comply With Any Other Licence Conditions (Standard or Bespoke)?',
      label: 'Was any part of the failure failing to comply with any other licence conditions (standard or bespoke)?',
      multipleAnswers: false,
      answers: [
        {
          id: '210763',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59196',
        },
        {
          id: '210764',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
      ],
    },
    '59196': {
      id: '59196',
      active: true,
      code: 'Please Specify Which Conditions apply',
      label: 'Please specify which conditions apply',
      multipleAnswers: true,
      answers: [
        {
          id: '210765',
          code: 'Location',
          active: true,
          label: 'Location',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          id: '210766',
          code: 'Alcohol/drugs (under influence)',
          active: true,
          label: 'Alcohol/drugs (under influence)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          id: '210767',
          code: 'Gambling',
          active: true,
          label: 'Gambling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          id: '210768',
          code: 'Finds (fill in separate report)',
          active: true,
          label: 'Finds (fill in separate report)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          id: '210769',
          code: 'Social Media',
          active: true,
          label: 'Social media',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          id: '210770',
          code: 'Bad Behaviour',
          active: true,
          label: 'Bad behaviour',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          id: '210771',
          code: 'Media Contact',
          active: true,
          label: 'Media contact',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59197',
        },
        {
          id: '210772',
          code: 'Other (Provide Details)',
          active: true,
          label: 'Other (provide details)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59197',
        },
      ],
    },
    '59197': {
      id: '59197',
      active: true,
      code: 'Was failure due to matters beyond the prisoner’s control?',
      label: 'Was failure due to matters beyond the prisoner’s control?',
      multipleAnswers: false,
      answers: [
        {
          id: '210773',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59198',
        },
        {
          id: '210774',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '59198',
        },
      ],
    },
    '59198': {
      id: '59198',
      active: true,
      code: 'Has the NOMS SFO Team been informed (SFO CASES only)',
      label: 'Has the NOMS SFO team been informed (SFO cases only)?',
      multipleAnswers: false,
      answers: [
        {
          id: '210775',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '59199',
        },
        {
          id: '210776',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59199',
        },
      ],
    },
    '59199': {
      id: '59199',
      active: true,
      code: 'Has the Offender Manager been informed?',
      label: 'Has the offender manager been informed?',
      multipleAnswers: false,
      answers: [
        {
          id: '210777',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '59200',
        },
        {
          id: '210778',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59200',
        },
      ],
    },
    '59200': {
      id: '59200',
      active: true,
      code: 'Has the Victim Liaison Officer been informed (where appropriate)?',
      label: 'Has the victim liaison officer been informed (where appropriate)?',
      multipleAnswers: false,
      answers: [
        {
          id: '210779',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '59201',
        },
        {
          id: '210780',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59201',
        },
      ],
    },
    '59201': {
      id: '59201',
      active: true,
      code: 'Has the ROTL Placement Provider been informed (where appropriate)?',
      label: 'Has the ROTL placement provider been informed (where appropriate)?',
      multipleAnswers: false,
      answers: [
        {
          id: '210781',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '59202',
        },
        {
          id: '210782',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59202',
        },
      ],
    },
    '59202': {
      id: '59202',
      active: true,
      code: 'Has The Deputy Director Of Custody Been Informed?',
      label: 'Has the deputy director of custody been informed?',
      multipleAnswers: false,
      answers: [
        {
          id: '210783',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '59203',
        },
        {
          id: '210784',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '59203',
        },
      ],
    },
    '59203': {
      id: '59203',
      active: true,
      code: 'Have PPCS Been Informed?',
      label: 'Have PPCS been informed?',
      multipleAnswers: false,
      answers: [
        {
          id: '210785',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
          id: '210786',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
  prisonerRoles: [
    {
      prisonerRole: 'ABSCONDER',
      onlyOneAllowed: false,
      active: false,
    },
    {
      // NB: new; not allowed in NOMIS
      prisonerRole: 'LICENSE_FAILURE',
      onlyOneAllowed: false,
      active: false,
    },
    {
      prisonerRole: 'TEMPORARY_RELEASE_FAILURE',
      onlyOneAllowed: false,
      active: true,
    },
  ],
} as const

export default TEMPORARY_RELEASE_FAILURE_4

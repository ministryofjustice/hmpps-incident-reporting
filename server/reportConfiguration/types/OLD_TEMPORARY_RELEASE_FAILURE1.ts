// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:51.914Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_TEMPORARY_RELEASE_FAILURE1: IncidentTypeConfiguration = {
  incidentType: 'OLD_TEMPORARY_RELEASE_FAILURE1',
  active: false,
  startingQuestionId: '49308',
  questions: {
    '49308': {
      id: '49308',
      label: 'What Type Of Temporary Licence Was Breached',
      multipleAnswers: false,
      answers: [
        {
          label: 'Resettlement Day',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49309',
        },
        {
          label: 'Resettlement Overnight',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49309',
        },
        {
          label: 'Childcare Resettlement',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49309',
        },
        {
          label: 'Special Purpose',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49309',
        },
      ],
    },
    '49309': {
      id: '49309',
      label: 'What Was The Specific Purpose Of Temporary Release',
      multipleAnswers: false,
      answers: [
        {
          label: 'Court / Legal / Police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49310',
        },
        {
          label: 'CRL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49310',
        },
        {
          label: 'Funeral / Visiting A Dying Relative',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49310',
        },
        {
          label: 'Maintaining Family Ties',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49310',
        },
        {
          label: 'Other Compassionate Reason',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49310',
        },
        {
          label: 'Other RDR Linked to Sentence Plan',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49310',
        },
        {
          label: 'Outside Prison Activity (OPA)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49310',
        },
        {
          label: 'Resettlement Overnight Release (ROR)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49310',
        },
        {
          label: 'Training Or Education',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49310',
        },
      ],
    },
    '49310': {
      id: '49310',
      label: 'Were The Police Informed Of The Incident',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes (Enter Date)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '49311',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49311',
        },
      ],
    },
    '49311': {
      id: '49311',
      label: 'Is The Incident The Subject Of A Police Investigation',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49312',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49312',
        },
      ],
    },
    '49312': {
      id: '49312',
      label: 'Is The Incident The Subject Of An Internal Investigation',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes - Local Only',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49313',
        },
        {
          label: 'Yes - DDC Commissioned',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49313',
        },
        {
          label: 'Yes - SFO Investigation',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49313',
        },
        {
          label: 'No (Enter Reasons)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '49313',
        },
      ],
    },
    '49313': {
      id: '49313',
      label: "Is the Incident Subject To A Governor's Adjudication",
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49314',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49314',
        },
      ],
    },
    '49314': {
      id: '49314',
      label: 'Is There Likely To Be Any Media Interest In This Incident',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49315',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49315',
        },
      ],
    },
    '49315': {
      id: '49315',
      label: 'Has The Prison Service Press Office Been Informed',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes (Enter Date)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '49316',
        },
        {
          label: 'No (Enter Reason)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '49316',
        },
      ],
    },
    '49316': {
      id: '49316',
      label: 'Is The Prisoner Subject To Restricted ROTL',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49317',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49319',
        },
      ],
    },
    '49317': {
      id: '49317',
      label: 'Has The Deputy Director Of Custody Been Informed',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes (Enter Date)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '49318',
        },
        {
          label: 'No (Enter Reason)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '49318',
        },
      ],
    },
    '49318': {
      id: '49318',
      label: 'Have PPCS Been Informed',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes (Enter Date)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '49319',
        },
        {
          label: 'No (Enter Reasons)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '49319',
        },
      ],
    },
    '49319': {
      id: '49319',
      label: 'Was The Failure Of Temporary Licence Or Any Part Of The Breach Failing To Return Or Returning Late',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49320',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49324',
        },
      ],
    },
    '49320': {
      id: '49320',
      label:
        'Was The Failure To Return Reported To The Police As The Offence Of Failure To Return From Temporary Licence',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49321',
        },
        {
          label: 'No (Enter Reasons)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '49321',
        },
      ],
    },
    '49321': {
      id: '49321',
      label: 'Did The Prisoner Surrender To HMPS Custody On The Same Day The Licence Expired',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49322',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49322',
        },
      ],
    },
    '49322': {
      id: '49322',
      label: 'Has The Prisoner Been Recaptured',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes (Enter Date)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '49323',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49324',
        },
      ],
    },
    '49323': {
      id: '49323',
      label: 'How Was The Prisoner Recaptured',
      multipleAnswers: false,
      answers: [
        {
          label: 'Surrender To HMPS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49324',
        },
        {
          label: 'Surrender To Police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49324',
        },
        {
          label: 'Arrest By HMPS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49324',
        },
        {
          label: 'Arrest By Police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49324',
        },
        {
          label: 'Other (Provide Details)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '49324',
        },
      ],
    },
    '49324': {
      id: '49324',
      label:
        'Was Any Part Of The Failure Failing To Comply With Any Other Licence Conditions (These Can Be Standard or Bespoke)',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49325',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49326',
        },
      ],
    },
    '49325': {
      id: '49325',
      label: 'Please Specify Which Conditions (Select As Many As Appropriate)',
      multipleAnswers: true,
      answers: [
        {
          label: 'Alcohol',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49326',
        },
        {
          label: 'Gambling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49326',
        },
        {
          label: 'Drugs',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49326',
        },
        {
          label: 'Location',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49326',
        },
        {
          label: 'Social Media',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49326',
        },
        {
          label: 'Bad Behaviour',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49326',
        },
        {
          label: 'Media Contact',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49326',
        },
        {
          label: 'Other (Provide Details)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '49326',
        },
      ],
    },
    '49326': {
      id: '49326',
      label: 'Has The Prisoner Been Arrested (Including For The Offence Of Failure To Return)',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49327',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49327',
        },
      ],
    },
    '49327': {
      id: '49327',
      label: 'Has The Prisoner Been Charged With Any Offence (Including The Offence Of Failure To Return)',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49328',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49328',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49328',
        },
      ],
    },
    '49328': {
      id: '49328',
      label: 'With What Type Of Offence or Offences Has The Prisoner Been Charged (Select As Many As Appropriate)',
      multipleAnswers: true,
      answers: [
        {
          label: 'Violence Against The Person',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49331',
        },
        {
          label: 'Sexual Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49331',
        },
        {
          label: 'Robbery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49331',
        },
        {
          label: 'Burglary',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49331',
        },
        {
          label: 'Theft And Handling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49331',
        },
        {
          label: 'Fraud And Forgery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49331',
        },
        {
          label: 'Drug Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49331',
        },
        {
          label: 'Motoring Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49331',
        },
        {
          label: 'Failure To Return From ROTL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49331',
        },
        {
          label: 'Other Offence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49331',
        },
      ],
    },
    '49331': {
      id: '49331',
      label: 'Has The Prisoner Been Found Guilty Of Offences Committed On ROTL',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49334',
        },
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49335',
        },
      ],
    },
    '49334': {
      id: '49334',
      label: 'What Offence Or Offences Has The Prisoner Been Found Guilty Of (Select As Many As Appropriate)',
      multipleAnswers: true,
      answers: [
        {
          label: 'Violence Against The Person',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49335',
        },
        {
          label: 'Sexual Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49335',
        },
        {
          label: 'Robbery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49335',
        },
        {
          label: 'Burglary',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49335',
        },
        {
          label: 'Theft And Handling',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49335',
        },
        {
          label: 'Fraud And Forgery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49335',
        },
        {
          label: 'Drug Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49335',
        },
        {
          label: 'Motoring Offences',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49335',
        },
        {
          label: 'Failure To Return From ROTL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49335',
        },
        {
          label: 'Other Offence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '49335',
        },
      ],
    },
    '49335': {
      id: '49335',
      label:
        'Confirm SFO Team, Offender Manager In The Community, Victim Liaison Officer And Employer (where appropriate) Informed',
      multipleAnswers: false,
      answers: [
        {
          label: 'Yes (Date)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
} as const

export default OLD_TEMPORARY_RELEASE_FAILURE1

// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:57.330Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_ROOF_CLIMB: IncidentTypeConfiguration = {
  incidentType: 'OLD_ROOF_CLIMB',
  active: false,
  startingQuestionId: '44417',
  questions: {
    '44145': {
      id: '44145',
      label: 'WAS THIS A FULL OR PARTIAL SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'FULL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44806',
        },
        {
          label: 'PARTIAL',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44806',
        },
      ],
    },
    '44150': {
      id: '44150',
      label: 'ESTIMATED COST OF DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER AMOUNT IN POUND STERLING',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45127',
        },
      ],
    },
    '44151': {
      id: '44151',
      label: 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44518',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44842',
        },
      ],
    },
    '44175': {
      id: '44175',
      label: 'WHO WAS DETAINED IN OUTSIDE HOSPITAL',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44842',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44842',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44842',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44842',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44842',
        },
      ],
    },
    '44177': {
      id: '44177',
      label: 'WHEN WAS THE SYSTEM RE-ACTIVATED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER COMMENT AND DATE',
          commentRequired: true,
          dateRequired: true,
          nextQuestionId: '44328',
        },
      ],
    },
    '44183': {
      id: '44183',
      label: 'DURATION OF INCIDENT IN HOURS',
      multipleAnswers: false,
      answers: [
        {
          label: 'NUMBER OF HOURS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44639',
        },
      ],
    },
    '44196': {
      id: '44196',
      label: 'WAS THERE AN APPARENT REASON FOR THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44337',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45128',
        },
      ],
    },
    '44273': {
      id: '44273',
      label: 'ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44487',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44487',
        },
      ],
    },
    '44289': {
      id: '44289',
      label: 'WAS THE KEYWORD REQUESTED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44767',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45163',
        },
      ],
    },
    '44328': {
      id: '44328',
      label: 'WAS THE SYSTEM RE-ACTIVATED LOCALLY OR BY THE SERVICE SUPPLIER',
      multipleAnswers: false,
      answers: [
        {
          label: 'LOCAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'SERVICE SUPPLIER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44334': {
      id: '44334',
      label: 'WAS DAMAGE CAUSED TO PRISON PROPERTY',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45098',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45127',
        },
      ],
    },
    '44337': {
      id: '44337',
      label: 'DESCRIBE THE APPARENT REASON FOR THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'FACILITIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45128',
        },
        {
          label: 'FOOD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45128',
        },
        {
          label: 'PAY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45128',
        },
        {
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45128',
        },
        {
          label: 'TIME OUT OF CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45128',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45128',
        },
      ],
    },
    '44359': {
      id: '44359',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44375',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44375',
        },
      ],
    },
    '44374': {
      id: '44374',
      label: 'WAS THE AMBULANCE SERVICE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44536',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44536',
        },
      ],
    },
    '44375': {
      id: '44375',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44151',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44151',
        },
      ],
    },
    '44394': {
      id: '44394',
      label: 'WHICH MINOR INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          label: 'GRAZES, SCRATCHES OR ABRASIONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44462',
        },
        {
          label: 'MINOR BRUISES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44462',
        },
        {
          label: 'SWELLINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44462',
        },
        {
          label: 'SUPERFICIAL CUTS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44462',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44462',
        },
      ],
    },
    '44417': {
      id: '44417',
      label: 'IS THE LOCATION OF THE INCIDENT KNOWN',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44927',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
      ],
    },
    '44422': {
      id: '44422',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44853',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44804',
        },
      ],
    },
    '44462': {
      id: '44462',
      label: 'ENTER DESCRIPTION OF PERSON(S) INJURED',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44533',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44533',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44533',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44533',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44533',
        },
      ],
    },
    '44465': {
      id: '44465',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44359',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44359',
        },
      ],
    },
    '44469': {
      id: '44469',
      label: 'WERE WORKS SERVICES STAFF PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44625',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44625',
        },
      ],
    },
    '44475': {
      id: '44475',
      label: 'WERE EXTENDABLE BATONS USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44183',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44183',
        },
      ],
    },
    '44487': {
      id: '44487',
      label: 'DESCRIBE METHOD OF GAINING ACCESS TO AREA AT HEIGHT',
      multipleAnswers: false,
      answers: [
        {
          label: 'EXTERNAL ACCESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44986',
        },
        {
          label: 'INTERNAL ACCESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44986',
        },
        {
          label: 'WORKS EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44986',
        },
        {
          label: 'CONTRACTORS EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44986',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44986',
        },
      ],
    },
    '44518': {
      id: '44518',
      label: 'WAS A SERIOUS INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45155',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
      ],
    },
    '44533': {
      id: '44533',
      label: 'DID INJURIES RESULT IN DETENTION IN OUTSIDE HOSPITAL AS AN IN-PATIENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44175',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44842',
        },
      ],
    },
    '44536': {
      id: '44536',
      label: 'WAS THE FIRE SERVICE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44797',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44797',
        },
      ],
    },
    '44553': {
      id: '44553',
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44465',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44465',
        },
      ],
    },
    '44580': {
      id: '44580',
      label: 'WERE HEALTH CARE CENTRE STAFF PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44469',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44469',
        },
      ],
    },
    '44596': {
      id: '44596',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44422',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44422',
        },
      ],
    },
    '44610': {
      id: '44610',
      label: 'WERE WATER HOSES USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44475',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44475',
        },
      ],
    },
    '44625': {
      id: '44625',
      label: 'WERE IMB MEMBERS PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44374',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44374',
        },
      ],
    },
    '44630': {
      id: '44630',
      label: 'HAVE THE RING LEADERS BEEN ENTERED ON INMATE INVOLVEMENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44756',
        },
        {
          label: 'NO',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44756',
        },
      ],
    },
    '44639': {
      id: '44639',
      label: 'WAS THE INCIDENT IN PUBLIC VIEW',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44334',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44334',
        },
      ],
    },
    '44660': {
      id: '44660',
      label: 'HOW MANY PRISONERS WERE INVOLVED',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER NUMBER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44889',
        },
      ],
    },
    '44687': {
      id: '44687',
      label: 'DESCRIBE WEAPONS USED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FIREARM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
        {
          label: 'CHEMICAL INCAPACITANT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
        {
          label: 'KNIFE/BLADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
        {
          label: 'OTHER SHARP INSTRUMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
        {
          label: 'BLUNT INSTRUMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
        {
          label: 'LIGATURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
        {
          label: 'DANGEROUS LIQUID',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
        {
          label: 'EXCRETA/URINE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
        {
          label: 'SPITTING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
        {
          label: 'FOOD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
        {
          label: 'THROWN FURNITURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
        {
          label: 'THROWN EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44725',
        },
      ],
    },
    '44710': {
      id: '44710',
      label: 'WAS CONTROL AND RESTRAINTS EMPLOYED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44610',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44610',
        },
      ],
    },
    '44714': {
      id: '44714',
      label: 'QUOTE THE VANTIVE CASE NUMBER',
      multipleAnswers: false,
      answers: [
        {
          label: 'NUMBER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44289',
        },
      ],
    },
    '44725': {
      id: '44725',
      label: 'WAS ANY EVACUATION NECESSARY',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44196',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44196',
        },
      ],
    },
    '44756': {
      id: '44756',
      label: 'WAS OPERATION TORNADO USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44710',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44710',
        },
      ],
    },
    '44767': {
      id: '44767',
      label: 'HAS THE SERVICE SUPPLIER BEEN NOTIFIED OF A REPLACEMENT KEYWORD?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45163',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45163',
        },
      ],
    },
    '44780': {
      id: '44780',
      label: 'DESCRIBE HOW THE INCIDENT WAS RESOLVED',
      multipleAnswers: false,
      answers: [
        {
          label: 'NEGOTIATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44660',
        },
        {
          label: 'INTERVENTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44660',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44660',
        },
      ],
    },
    '44797': {
      id: '44797',
      label: 'WERE THE POLICE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44873',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44873',
        },
      ],
    },
    '44804': {
      id: '44804',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44553',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44553',
        },
      ],
    },
    '44806': {
      id: '44806',
      label: 'WHO AUTHORISED THE SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44825',
        },
        {
          label: 'DEPUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44825',
        },
        {
          label: 'DUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44825',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44825',
        },
      ],
    },
    '44815': {
      id: '44815',
      label: 'WERE TRAINED NEGOTIATORS DEPLOYED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44951',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44951',
        },
      ],
    },
    '44825': {
      id: '44825',
      label: 'WAS THE SYSTEM COMPROMISED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44847',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44177',
        },
      ],
    },
    '44842': {
      id: '44842',
      label: 'ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44273',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44273',
        },
      ],
    },
    '44847': {
      id: '44847',
      label: 'DESCRIBE WHAT WAS COMPROMISED AND BY WHOM',
      multipleAnswers: false,
      answers: [
        {
          label: 'DESCRIPTION',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44177',
        },
      ],
    },
    '44853': {
      id: '44853',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44804',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44804',
        },
      ],
    },
    '44873': {
      id: '44873',
      label: 'WERE WEAPONS USED BY THE PERPETRATOR',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44687',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44725',
        },
      ],
    },
    '44889': {
      id: '44889',
      label: 'HAVE THE RING LEADERS BEEN IDENTIFIED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44630',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44630',
        },
      ],
    },
    '44892': {
      id: '44892',
      label: 'WAS THE EMERGENCY RESPONSE VEHICLE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44815',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44815',
        },
      ],
    },
    '44927': {
      id: '44927',
      label: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'ADMINISTRATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'ASSOCIATION AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'CHAPEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'DINING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'DORMITORY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'EXERCISE YARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'GATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'GYM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'RECEPTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'RECESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'SPECIAL UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'SHOWERS/CHANGING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'WING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'WITHIN PERIMETER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'ELSEWHERE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'FUNERAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'HOSPITAL OUTSIDE (PATIENT)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'HOSPITAL OUTSIDE (VISITING)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'OUTSIDE WORKING PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'SPORTS FIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'VEHICLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'WEDDINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'MAGISTRATES COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
        {
          label: 'CROWN COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44596',
        },
      ],
    },
    '44951': {
      id: '44951',
      label: 'WAS AN INCIDENT LIAISON OFFICER PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44580',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44580',
        },
      ],
    },
    '44985': {
      id: '44985',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN LOCALLY OR BY THE SERVICE SUPPLIER',
      multipleAnswers: false,
      answers: [
        {
          label: 'LOCAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45163',
        },
        {
          label: 'SERVICE SUPPLIER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44714',
        },
      ],
    },
    '44986': {
      id: '44986',
      label: 'WAS A CANDR ADVISOR PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44892',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44892',
        },
      ],
    },
    '45028': {
      id: '45028',
      label: 'WHAT TIME WAS THE SYSTEM SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER TIME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44145',
        },
      ],
    },
    '45098': {
      id: '45098',
      label: 'DESCRIBE THE DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'MINOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44150',
        },
        {
          label: 'SERIOUS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44150',
        },
        {
          label: 'EXTENSIVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44150',
        },
      ],
    },
    '45127': {
      id: '45127',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN DURING THE INCIDENT?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44985',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '45128': {
      id: '45128',
      label: 'DESCRIBE THE INCIDENT AS EITHER ACTIVE OR PASSIVE',
      multipleAnswers: false,
      answers: [
        {
          label: 'ACTIVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44780',
        },
        {
          label: 'PASSIVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44780',
        },
      ],
    },
    '45155': {
      id: '45155',
      label: 'WHICH SERIOUS INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FRACTURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
        {
          label: 'SCALD OR BURN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
        {
          label: 'STABBING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
        {
          label: 'CRUSHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
        {
          label: 'EXTENSIVE/MULTIPLE BRUISING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
        {
          label: 'BLACK EYE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
        {
          label: 'BROKEN NOSE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
        {
          label: 'BROKEN TEETH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
        {
          label: 'CUTS REQUIRING SUTURES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
        {
          label: 'BITES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
        {
          label: 'GUN SHOT WOUND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
        {
          label: 'TEMPORARY/PERMANENT BLINDNESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45175',
        },
      ],
    },
    '45163': {
      id: '45163',
      label: 'INDICATE THE NATURE OF THE SHUT DOWN',
      multipleAnswers: true,
      answers: [
        {
          label: 'TELEPHONY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45028',
        },
        {
          label: 'IT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45028',
        },
      ],
    },
    '45175': {
      id: '45175',
      label: 'WAS A MINOR INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44394',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44462',
        },
      ],
    },
  },
} as const

export default OLD_ROOF_CLIMB

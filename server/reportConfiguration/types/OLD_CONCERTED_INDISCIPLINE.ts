// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:38.830Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_CONCERTED_INDISCIPLINE: IncidentTypeConfiguration = {
  incidentType: 'OLD_CONCERTED_INDISCIPLINE',
  active: false,
  startingQuestionId: '44750',
  questions: {
    '44122': {
      id: '44122',
      label: 'WAS CONTROL AND RESTRAINTS EMPLOYED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44979',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44979',
        },
      ],
    },
    '44140': {
      id: '44140',
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44256',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44256',
        },
      ],
    },
    '44156': {
      id: '44156',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44267',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44267',
        },
      ],
    },
    '44161': {
      id: '44161',
      label: 'WERE WORKS SERVICES STAFF PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45165',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45165',
        },
      ],
    },
    '44162': {
      id: '44162',
      label: 'HAS THE SERVICE SUPPLIER BEEN NOTIFIED OF A REPLACEMENT KEYWORD?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44216',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44216',
        },
      ],
    },
    '44170': {
      id: '44170',
      label: 'HOW MANY PRISONERS WERE INVOLVED',
      multipleAnswers: false,
      answers: [
        {
          label: 'NUMBER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44551',
        },
      ],
    },
    '44182': {
      id: '44182',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44783',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44774',
        },
      ],
    },
    '44216': {
      id: '44216',
      label: 'INDICATE THE NATURE OF THE SHUT DOWN',
      multipleAnswers: true,
      answers: [
        {
          label: 'TELEPHONY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44562',
        },
        {
          label: 'IT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44562',
        },
      ],
    },
    '44238': {
      id: '44238',
      label: 'WERE EXTENDABLE BATONS USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44338',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44338',
        },
      ],
    },
    '44250': {
      id: '44250',
      label: 'WAS THE KEYWORD REQUESTED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44162',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44216',
        },
      ],
    },
    '44256': {
      id: '44256',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45065',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45065',
        },
      ],
    },
    '44267': {
      id: '44267',
      label: 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45129',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44884',
        },
      ],
    },
    '44279': {
      id: '44279',
      label: 'QUOTE THE VANTIVE CASE NUMBER',
      multipleAnswers: false,
      answers: [
        {
          label: 'NUMBER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44250',
        },
      ],
    },
    '44296': {
      id: '44296',
      label: 'WERE TRAINED NEGOTIATORS DEPLOYED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44317',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44317',
        },
      ],
    },
    '44299': {
      id: '44299',
      label: 'WAS THE FIRE SERVICE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45174',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45174',
        },
      ],
    },
    '44304': {
      id: '44304',
      label: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'ADMINISTRATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'ASSOCIATION AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'CHAPEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'DINING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'DORMITORY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'EXERCISE YARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'GATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'GYM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'RECEPTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'RECESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'SPECIAL UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'SHOWERS/CHANGING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'WING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'WITHIN PERIMETER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'ELSEWHERE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'FUNERAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'HOSPITAL OUTSIDE (PATIENT)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'HOSPITAL OUTSIDE (VISITING)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'OUTSIDE WORKING PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'SPORTS FIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'VEHICLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'WEDDINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'MAGISTRATES COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
        {
          label: 'CROWN COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
      ],
    },
    '44317': {
      id: '44317',
      label: 'WAS AN INCIDENT LIAISON OFFICER PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45045',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45045',
        },
      ],
    },
    '44336': {
      id: '44336',
      label: 'WAS ANY EVACUATION NECESSARY',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44483',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44483',
        },
      ],
    },
    '44338': {
      id: '44338',
      label: 'DURATION OF INCIDENT IN HOURS',
      multipleAnswers: false,
      answers: [
        {
          label: 'NUMBER OF HOURS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45153',
        },
      ],
    },
    '44387': {
      id: '44387',
      label: 'DESCRIBE THE DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'MINOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44661',
        },
        {
          label: 'SERIOUS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44661',
        },
        {
          label: 'EXTENSIVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44661',
        },
      ],
    },
    '44438': {
      id: '44438',
      label: 'WERE WEAPONS USED BY THE PERPETRATORS',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44654',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
      ],
    },
    '44483': {
      id: '44483',
      label: 'WAS THERE AN APPARENT REASON FOR THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44656',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44738',
        },
      ],
    },
    '44531': {
      id: '44531',
      label: 'WAS A MINOR INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44877',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44734',
        },
      ],
    },
    '44551': {
      id: '44551',
      label: 'HAVE THE RING LEADERS BEEN IDENTIFIED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44623',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44623',
        },
      ],
    },
    '44562': {
      id: '44562',
      label: 'WHAT TIME WAS THE SYSTEM SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER TIME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44577',
        },
      ],
    },
    '44577': {
      id: '44577',
      label: 'WAS THIS A FULL OR PARTIAL SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'FULL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44809',
        },
        {
          label: 'PARTIAL',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44809',
        },
      ],
    },
    '44623': {
      id: '44623',
      label: 'HAVE THE RING LEADERS BEEN ENTERED ON INMATE INVOLVEMENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44917',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44917',
        },
      ],
    },
    '44654': {
      id: '44654',
      label: 'DESCRIBE WEAPONS USED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FIREARM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
        {
          label: 'CHEMICAL INCAPACITANT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
        {
          label: 'KNIFE/BLADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
        {
          label: 'OTHER SHARP INSTRUMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
        {
          label: 'BLUNT INSTRUMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
        {
          label: 'LIGATURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
        {
          label: 'DANGEROUS LIQUID',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
        {
          label: 'EXCRETA/URINE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
        {
          label: 'SPITTING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
        {
          label: 'FOOD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
        {
          label: 'THROWN FURNITURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
        {
          label: 'THROWN EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44336',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44336',
        },
      ],
    },
    '44656': {
      id: '44656',
      label: 'DESCRIBE THE APPARENT REASON FOR THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'FACILITIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44738',
        },
        {
          label: 'FOOD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44738',
        },
        {
          label: 'PAY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44738',
        },
        {
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44738',
        },
        {
          label: 'TIME OUT OF CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44738',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44738',
        },
      ],
    },
    '44661': {
      id: '44661',
      label: 'ESTIMATED COST OF DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER AMOUNT IN POUND STERLING',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44810',
        },
      ],
    },
    '44662': {
      id: '44662',
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
    '44663': {
      id: '44663',
      label: 'WAS A CANDR ADVISOR PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44684',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44684',
        },
      ],
    },
    '44679': {
      id: '44679',
      label: 'ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44867',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44867',
        },
      ],
    },
    '44684': {
      id: '44684',
      label: 'WAS THE EMERGENCY RESPONSE VEHICLE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44296',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44296',
        },
      ],
    },
    '44697': {
      id: '44697',
      label: 'WHO WAS DETAINED IN OUTSIDE HOSPITAL',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44884',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44884',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44884',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44884',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44884',
        },
      ],
    },
    '44724': {
      id: '44724',
      label: 'WHICH SERIOUS INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FRACTURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
        {
          label: 'SCALD OR BURN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
        {
          label: 'STABBING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
        {
          label: 'CRUSHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
        {
          label: 'EXTENSIVE/MULTIPLE BRUISING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
        {
          label: 'BLACK EYE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
        {
          label: 'BROKEN NOSE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
        {
          label: 'BROKEN TEETH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
        {
          label: 'CUTS REQUIRING SUTURES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
        {
          label: 'BITES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
        {
          label: 'GUN SHOT WOUND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
        {
          label: 'TEMPORARY/PERMANENT BLINDNESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
      ],
    },
    '44734': {
      id: '44734',
      label: 'ENTER DESCRIPTION OF PERSON(S) INJURED',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44973',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44973',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44973',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44973',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44973',
        },
      ],
    },
    '44738': {
      id: '44738',
      label: 'DESCRIBE THE INCIDENT AS EITHER ACTIVE OR PASSIVE',
      multipleAnswers: false,
      answers: [
        {
          label: 'ACTIVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44760',
        },
        {
          label: 'PASSIVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44760',
        },
      ],
    },
    '44750': {
      id: '44750',
      label: 'IS THE LOCATION OF THE INCIDENT KNOWN',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44304',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44910',
        },
      ],
    },
    '44758': {
      id: '44758',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN LOCALLY OR BY THE SERVICE SUPPLIER',
      multipleAnswers: false,
      answers: [
        {
          label: 'LOCAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44216',
        },
        {
          label: 'SERVICE SUPPLIER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44279',
        },
      ],
    },
    '44760': {
      id: '44760',
      label: 'DESCRIBE HOW THE INCIDENT WAS RESOLVED',
      multipleAnswers: false,
      answers: [
        {
          label: 'NEGOTIATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44170',
        },
        {
          label: 'INTERVENTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44170',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44170',
        },
      ],
    },
    '44764': {
      id: '44764',
      label: 'WAS THE SYSTEM COMPROMISED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45013',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44902',
        },
      ],
    },
    '44774': {
      id: '44774',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44140',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44140',
        },
      ],
    },
    '44783': {
      id: '44783',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44774',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44774',
        },
      ],
    },
    '44809': {
      id: '44809',
      label: 'WHO AUTHORISED THE SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44764',
        },
        {
          label: 'DEPUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44764',
        },
        {
          label: 'DUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44764',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44764',
        },
      ],
    },
    '44810': {
      id: '44810',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN DURING THE INCIDENT?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44758',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44867': {
      id: '44867',
      label: 'WAS A BARRICADE USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44663',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44663',
        },
      ],
    },
    '44877': {
      id: '44877',
      label: 'WHICH MINOR INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          label: 'GRAZES, SCRATCHES OR ABRASIONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44734',
        },
        {
          label: 'MINOR BRUISES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44734',
        },
        {
          label: 'SWELLINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44734',
        },
        {
          label: 'SUPERFICIAL CUTS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44734',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44734',
        },
      ],
    },
    '44884': {
      id: '44884',
      label: 'ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44679',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44679',
        },
      ],
    },
    '44902': {
      id: '44902',
      label: 'WHEN WAS THE SYSTEM RE-ACTIVATED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER COMMENT AND DATE',
          commentRequired: true,
          dateRequired: true,
          nextQuestionId: '44662',
        },
      ],
    },
    '44910': {
      id: '44910',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44182',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44182',
        },
      ],
    },
    '44917': {
      id: '44917',
      label: 'WAS OPERATION TORNADO USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44122',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44122',
        },
      ],
    },
    '44973': {
      id: '44973',
      label: 'DID INJURIES RESULT IN DETENTION IN OUTSIDE HOSPITAL AS AN IN-PATIENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44697',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44884',
        },
      ],
    },
    '44979': {
      id: '44979',
      label: 'WERE WATER HOSES USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44238',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44238',
        },
      ],
    },
    '45013': {
      id: '45013',
      label: 'DESCRIBE WHAT WAS COMPROMISED AND BY WHOM',
      multipleAnswers: false,
      answers: [
        {
          label: 'DESCRIPTION',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44902',
        },
      ],
    },
    '45045': {
      id: '45045',
      label: 'WERE HEALTH CARE CENTRE STAFF PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44161',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44161',
        },
      ],
    },
    '45065': {
      id: '45065',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44156',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44156',
        },
      ],
    },
    '45117': {
      id: '45117',
      label: 'WAS DAMAGE CAUSED TO PRISON PROPERTY',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44387',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44810',
        },
      ],
    },
    '45129': {
      id: '45129',
      label: 'WAS A SERIOUS INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44724',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44531',
        },
      ],
    },
    '45153': {
      id: '45153',
      label: 'WAS THE INCIDENT IN PUBLIC VIEW',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45117',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45117',
        },
      ],
    },
    '45158': {
      id: '45158',
      label: 'WAS THE AMBULANCE SERVICE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44299',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44299',
        },
      ],
    },
    '45165': {
      id: '45165',
      label: 'WERE BOARD OF VISITORS MEMBERS PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45158',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45158',
        },
      ],
    },
    '45174': {
      id: '45174',
      label: 'WERE THE POLICE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44438',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44438',
        },
      ],
    },
  },
} as const

export default OLD_CONCERTED_INDISCIPLINE

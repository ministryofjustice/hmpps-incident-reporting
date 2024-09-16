// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:37.091Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_BARRICADE: IncidentTypeConfiguration = {
  incidentType: 'OLD_BARRICADE',
  active: false,
  startingQuestionId: '44439',
  questions: {
    '44174': {
      id: '44174',
      label: 'WHO WAS DETAINED IN OUTSIDE HOSPITAL',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45071',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45071',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45071',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45071',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45071',
        },
      ],
    },
    '44185': {
      id: '44185',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44263',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44263',
        },
      ],
    },
    '44191': {
      id: '44191',
      label: 'WAS A DOOR JACK USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44860',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44860',
        },
      ],
    },
    '44206': {
      id: '44206',
      label: 'WAS THE SYSTEM COMPROMISED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44987',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44632',
        },
      ],
    },
    '44222': {
      id: '44222',
      label: 'ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44665',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44665',
        },
      ],
    },
    '44227': {
      id: '44227',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN DURING THE INCIDENT?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44629',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44263': {
      id: '44263',
      label: 'IS THE LOCATION OF THE INCIDENT KNOWN',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44532',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
      ],
    },
    '44348': {
      id: '44348',
      label: 'DESCRIBE THE DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'EXTENSIVE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44413',
        },
        {
          label: 'MINOR',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44413',
        },
        {
          label: 'SERIOUS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44413',
        },
      ],
    },
    '44357': {
      id: '44357',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44879',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45086',
        },
      ],
    },
    '44378': {
      id: '44378',
      label: 'WAS DAMAGE CAUSED TO PRISON PROPERTY',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44348',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45171',
        },
      ],
    },
    '44401': {
      id: '44401',
      label: 'WAS THE KEYWORD REQUESTED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44932',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44530',
        },
      ],
    },
    '44413': {
      id: '44413',
      label: 'ESTIMATED COST OF DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER AMOUNT IN POUND STERLING',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45171',
        },
      ],
    },
    '44439': {
      id: '44439',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44357',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45086',
        },
      ],
    },
    '44461': {
      id: '44461',
      label: 'DESCRIBE WEAPONS USED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FIREARM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
        {
          label: 'CHEMICAL INCAPACITANT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
        {
          label: 'KNIFE/BLADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
        {
          label: 'OTHER SHARP INSTRUMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
        {
          label: 'BLUNT INSTRUMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
        {
          label: 'LIGATURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
        {
          label: 'DANGEROUS LIQUID',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
        {
          label: 'EXCRETA/URINE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
        {
          label: 'SPITTING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
        {
          label: 'FOOD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
        {
          label: 'THROWN FURNITURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
        {
          label: 'THROWN EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44378',
        },
      ],
    },
    '44482': {
      id: '44482',
      label: 'QUOTE THE VANTIVE CASE NUMBER',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER NUMBER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44401',
        },
      ],
    },
    '44492': {
      id: '44492',
      label: 'WHO AUTHORISED THE SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44206',
        },
        {
          label: 'DEPUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44206',
        },
        {
          label: 'DUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44206',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44206',
        },
      ],
    },
    '44505': {
      id: '44505',
      label: 'DESCRIBE HOW THE INCIDENT WAS RESOLVED',
      multipleAnswers: false,
      answers: [
        {
          label: 'NEGOTIATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44191',
        },
        {
          label: 'INTERVENTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44191',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44191',
        },
      ],
    },
    '44515': {
      id: '44515',
      label: 'WERE WEAPONS USED BY THE PERPETRATOR',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44461',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44378',
        },
      ],
    },
    '44530': {
      id: '44530',
      label: 'INDICATE THE NATURE OF THE SHUT DOWN',
      multipleAnswers: true,
      answers: [
        {
          label: 'TELEPHONY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44666',
        },
        {
          label: 'IT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44666',
        },
      ],
    },
    '44532': {
      id: '44532',
      label: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'ADMINISTRATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'ASSOCIATION AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'CHAPEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'DINING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'DORMITORY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'EXERCISE YARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'GATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'GYM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'RECEPTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'RECESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'SPECIAL UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'SHOWERS/CHANGING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'WING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'WITHIN PERIMETER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'ELSEWHERE (ENTER DETAILS)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'FUNERAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'HOSPITAL OUTSIDE (PATIENT)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'HOSPITAL OUTSIDE (VISITING)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'OUTSIDE WORKING PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'SPORTS FIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'VEHICLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'WEDDINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'MAGISTRATES COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
        {
          label: 'CROWN COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44938',
        },
      ],
    },
    '44563': {
      id: '44563',
      label: 'ENTER DESCRIPTION OF PERSON(S) INJURED',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44796',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44796',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44796',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44796',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44796',
        },
      ],
    },
    '44620': {
      id: '44620',
      label: 'WAS THE SYSTEM RE-ACTIVATED LOCALLY OR BY THE IT AND T SERVICE SUPPLIER?',
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
    '44629': {
      id: '44629',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN LOCALLY OR BY THE SERVICE SUPPLIER',
      multipleAnswers: false,
      answers: [
        {
          label: 'LOCAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44530',
        },
        {
          label: 'SERVICE SUPPLIER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44482',
        },
      ],
    },
    '44632': {
      id: '44632',
      label: 'WHEN WAS THE SYSTEM RE-ACTIVATED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER COMMENT AND DATE',
          commentRequired: true,
          dateRequired: true,
          nextQuestionId: '44620',
        },
      ],
    },
    '44634': {
      id: '44634',
      label: 'WHICH MINOR INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          label: 'GRAZES, SCRATCHES OR ABRASIONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44563',
        },
        {
          label: 'MINOR BRUISES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44563',
        },
        {
          label: 'SWELLINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44563',
        },
        {
          label: 'SUPERFICIAL CUTS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44563',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44563',
        },
      ],
    },
    '44665': {
      id: '44665',
      label: 'WAS THERE AN APPARENT REASON FOR THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44704',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44505',
        },
      ],
    },
    '44666': {
      id: '44666',
      label: 'WHAT TIME WAS THE SYSTEM SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER TIME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44947',
        },
      ],
    },
    '44704': {
      id: '44704',
      label: 'DESCRIBE THE APPARENT REASON FOR THE INCIDENT',
      multipleAnswers: true,
      answers: [
        {
          label: 'FACILITIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44505',
        },
        {
          label: 'FOOD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44505',
        },
        {
          label: 'PAY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44505',
        },
        {
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44505',
        },
        {
          label: 'TIME OUT OF CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44505',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44505',
        },
      ],
    },
    '44722': {
      id: '44722',
      label: 'WHICH SERIOUS INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FRACTURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
        {
          label: 'SCALD OR BURN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
        {
          label: 'STABBING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
        {
          label: 'CRUSHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
        {
          label: 'EXTENSIVE/MULTIPLE BRUISING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
        {
          label: 'BLACK EYE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
        {
          label: 'BROKEN NOSE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
        {
          label: 'BROKEN TEETH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
        {
          label: 'CUTS REQUIRING SUTURES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
        {
          label: 'BITES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
        {
          label: 'GUN SHOT WOUND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
        {
          label: 'TEMPORARY/PERMANENT BLINDNESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
      ],
    },
    '44796': {
      id: '44796',
      label: 'DID INJURIES RESULT IN DETENTION IN OUTSIDE HOSPITAL AS AN IN-PATIENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44174',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45071',
        },
      ],
    },
    '44816': {
      id: '44816',
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44914',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44914',
        },
      ],
    },
    '44860': {
      id: '44860',
      label: 'WERE WATER HOSES USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45022',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45022',
        },
      ],
    },
    '44879': {
      id: '44879',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45086',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45086',
        },
      ],
    },
    '44914': {
      id: '44914',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44185',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44185',
        },
      ],
    },
    '44932': {
      id: '44932',
      label: 'HAS THE SERVICE SUPPLIER BEEN NOTIFIED OF A REPLACEMENT KEYWORD?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44530',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44530',
        },
      ],
    },
    '44938': {
      id: '44938',
      label: 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45075',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45071',
        },
      ],
    },
    '44947': {
      id: '44947',
      label: 'WAS THIS A FULL OR PARTIAL SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'FULL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44492',
        },
        {
          label: 'PARTIAL',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44492',
        },
      ],
    },
    '44987': {
      id: '44987',
      label: 'DESCRIBE WHAT WAS COMPROMISED AND BY WHOM',
      multipleAnswers: false,
      answers: [
        {
          label: 'DESCRIBE COMPROMISE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44632',
        },
      ],
    },
    '45022': {
      id: '45022',
      label: 'WAS CONTROL AND RESTRAINTS EMPLOYED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44515',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44515',
        },
      ],
    },
    '45071': {
      id: '45071',
      label: 'ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44222',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44222',
        },
      ],
    },
    '45075': {
      id: '45075',
      label: 'WAS A SERIOUS INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44722',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45083',
        },
      ],
    },
    '45083': {
      id: '45083',
      label: 'WAS A MINOR INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44634',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44563',
        },
      ],
    },
    '45086': {
      id: '45086',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44816',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44816',
        },
      ],
    },
    '45171': {
      id: '45171',
      label: 'DURATION OF INCIDENT IN HOURS',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER HOURS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44227',
        },
      ],
    },
  },
} as const

export default OLD_BARRICADE

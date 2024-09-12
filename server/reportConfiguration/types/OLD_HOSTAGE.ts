// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:56.133Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_HOSTAGE: IncidentTypeConfiguration = {
  incidentType: 'OLD_HOSTAGE',
  active: false,
  startingQuestionId: '44318',
  questions: {
    '44137': {
      id: '44137',
      label: 'WAS A HOSTAGE NEGOTIATION ADVISER PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44365',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44365',
        },
      ],
    },
    '44210': {
      id: '44210',
      label: 'WERE IMB MEMBERS PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44452',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44452',
        },
      ],
    },
    '44213': {
      id: '44213',
      label: 'ESTIMATED COST OF DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER AMOUNT IN POUND STERLING',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44293',
        },
      ],
    },
    '44218': {
      id: '44218',
      label: 'DID INJURIES RESULT IN DETENTION IN OUTSIDE HOSPITAL AS AN IN-PATIENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44235',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44347',
        },
      ],
    },
    '44234': {
      id: '44234',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45093',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45093',
        },
      ],
    },
    '44235': {
      id: '44235',
      label: 'WHO WAS DETAINED IN OUTSIDE HOSPITAL',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44347',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44347',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44347',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44347',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44347',
        },
      ],
    },
    '44239': {
      id: '44239',
      label: 'WHO AUTHORISED THE SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45076',
        },
        {
          label: 'DEPUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45076',
        },
        {
          label: 'DUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45076',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45076',
        },
      ],
    },
    '44257': {
      id: '44257',
      label: 'WERE WATER HOSES USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44891',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44891',
        },
      ],
    },
    '44265': {
      id: '44265',
      label: 'WERE THE POLICE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44963',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44963',
        },
      ],
    },
    '44275': {
      id: '44275',
      label: 'INDICATE THE NATURE OF THE SHUT DOWN',
      multipleAnswers: true,
      answers: [
        {
          label: 'TELEPHONY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44788',
        },
        {
          label: 'IT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44788',
        },
      ],
    },
    '44293': {
      id: '44293',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN DURING THE INCIDENT?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44805',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44311': {
      id: '44311',
      label: 'WAS DAMAGE CAUSED TO PRISON PROPERTY',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44600',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44293',
        },
      ],
    },
    '44318': {
      id: '44318',
      label: 'IS THE LOCATION OF THE INCIDENT KNOWN',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44463',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
      ],
    },
    '44322': {
      id: '44322',
      label: 'WAS THERE EVIDENCE OF COLLUSION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44137',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44137',
        },
      ],
    },
    '44335': {
      id: '44335',
      label: 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45101',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44347',
        },
      ],
    },
    '44347': {
      id: '44347',
      label: 'ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44937',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44937',
        },
      ],
    },
    '44356': {
      id: '44356',
      label: 'HAS THE SERVICE SUPPLIER BEEN NOTIFIED OF A REPLACEMENT KEYWORD?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44275',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44275',
        },
      ],
    },
    '44365': {
      id: '44365',
      label: 'WAS A CANDR ADVISOR PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44959',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44959',
        },
      ],
    },
    '44403': {
      id: '44403',
      label: 'QUOTE THE VANTIVE CASE NUMBER',
      multipleAnswers: false,
      answers: [
        {
          label: 'NUMBER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44831',
        },
      ],
    },
    '44411': {
      id: '44411',
      label: 'DID A TACTICAL FIREARMS ADVISER ATTEND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44939',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44939',
        },
      ],
    },
    '44431': {
      id: '44431',
      label: 'WAS PHYSICAL VIOLENCE USED TOWARDS HOSTAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44777',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44777',
        },
      ],
    },
    '44452': {
      id: '44452',
      label: 'WERE WEAPONS USED BY THE PERPETRATOR',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44474',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
      ],
    },
    '44463': {
      id: '44463',
      label: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'ADMINISTRATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'ASSOCIATION AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'CHAPEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'DINING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'DORMITORY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'EXERCISE YARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'GATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'GYM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'RECEPTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'RECESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'SPECIAL UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'SHOWERS/CHANGING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'WING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'WITHIN PERIMETER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'ELSEWHERE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'FUNERAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'HOSPITAL OUTSIDE (PATIENT)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'HOSPITAL OUTSIDE (VISITING)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'OUTSIDE WORKING PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'SPORTS FIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'VEHICLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'WEDDINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'MAGISTRATES COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
        {
          label: 'CROWN COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44690',
        },
      ],
    },
    '44474': {
      id: '44474',
      label: 'DESCRIBE WEAPONS USED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FIREARM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
        {
          label: 'CHEMICAL INCAPACITANT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
        {
          label: 'KNIFE/BLADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
        {
          label: 'OTHER SHARP INSTRUMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
        {
          label: 'BLUNT INSTRUMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
        {
          label: 'LIGATURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
        {
          label: 'DANGEROUS LIQUID',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
        {
          label: 'EXCRETA/URINE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
        {
          label: 'SPITTING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
        {
          label: 'FOOD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
        {
          label: 'THROWN FURNITURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
        {
          label: 'THROWN EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45162',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45162',
        },
      ],
    },
    '44488': {
      id: '44488',
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
    '44497': {
      id: '44497',
      label: 'WAS A BARRICADE USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44614',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44431',
        },
      ],
    },
    '44555': {
      id: '44555',
      label: 'WAS THE AMBULANCE SERVICE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45078',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45078',
        },
      ],
    },
    '44564': {
      id: '44564',
      label: 'ENTER NUMBER OF PERPETRATORS',
      multipleAnswers: false,
      answers: [
        {
          label: 'NUMBER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45004',
        },
      ],
    },
    '44569': {
      id: '44569',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44335',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44335',
        },
      ],
    },
    '44585': {
      id: '44585',
      label: 'DESCRIBE HOW THE INCIDENT WAS RESOLVED',
      multipleAnswers: false,
      answers: [
        {
          label: 'INTERVENTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44814',
        },
        {
          label: 'NEGOTIATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44891',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44891',
        },
      ],
    },
    '44600': {
      id: '44600',
      label: 'DESCRIBE THE DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'MINOR',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44213',
        },
        {
          label: 'SERIOUS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44213',
        },
        {
          label: 'EXTENSIVE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44213',
        },
      ],
    },
    '44608': {
      id: '44608',
      label: 'WHICH MINOR INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          label: 'GRAZES, SCRATCHES OR ABRASIONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45059',
        },
        {
          label: 'MINOR BRUISES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45059',
        },
        {
          label: 'SWELLINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45059',
        },
        {
          label: 'SUPERFICIAL CUTS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45059',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45059',
        },
      ],
    },
    '44611': {
      id: '44611',
      label: 'DESCRIBE WHAT WAS COMPROMISED AND BY WHOM',
      multipleAnswers: false,
      answers: [
        {
          label: 'DESCRIPTION',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44817',
        },
      ],
    },
    '44613': {
      id: '44613',
      label: 'WAS A MINOR INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44608',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45059',
        },
      ],
    },
    '44614': {
      id: '44614',
      label: 'WAS A HOSTAGE PART OF THE BARRICADE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44431',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44431',
        },
      ],
    },
    '44690': {
      id: '44690',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45135',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45135',
        },
      ],
    },
    '44693': {
      id: '44693',
      label: 'WHICH SERIOUS INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FRACTURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
        {
          label: 'SCALD OR BURN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
        {
          label: 'STABBING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
        {
          label: 'CRUSHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
        {
          label: 'EXTENSIVE/MULTIPLE BRUISING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
        {
          label: 'BLACK EYE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
        {
          label: 'BROKEN NOSE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
        {
          label: 'BROKEN TEETH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
        {
          label: 'CUTS REQUIRING SUTURES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
        {
          label: 'BITES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
        {
          label: 'GUN SHOT WOUND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
        {
          label: 'TEMPORARY/PERMANENT BLINDNESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
      ],
    },
    '44711': {
      id: '44711',
      label: 'WERE HEALTH CARE CENTRE STAFF PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44555',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44555',
        },
      ],
    },
    '44777': {
      id: '44777',
      label: 'WAS THE HOSTAGE PHYSICALLY RESTRAINED BY THE PERPETRATOR',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44585',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44585',
        },
      ],
    },
    '44788': {
      id: '44788',
      label: 'WHAT TIME WAS THE SYSTEM SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER TIME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45012',
        },
      ],
    },
    '44805': {
      id: '44805',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN LOCALLY OR BY THE SERVICE SUPPLIER',
      multipleAnswers: false,
      answers: [
        {
          label: 'LOCAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44275',
        },
        {
          label: 'SERVICE SUPPLIER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44403',
        },
      ],
    },
    '44814': {
      id: '44814',
      label: 'WAS A DOOR JACK USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44257',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44257',
        },
      ],
    },
    '44817': {
      id: '44817',
      label: 'WHEN WAS THE SYSTEM RE-ACTIVATED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER COMMENT AND DATE',
          commentRequired: true,
          dateRequired: true,
          nextQuestionId: '44488',
        },
      ],
    },
    '44823': {
      id: '44823',
      label: 'DESCRIBE STATUS OF PERPETRATORS',
      multipleAnswers: true,
      answers: [
        {
          label: 'PRISONER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44497',
        },
        {
          label: 'VISITOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44497',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44497',
        },
      ],
    },
    '44831': {
      id: '44831',
      label: 'WAS THE KEYWORD REQUESTED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44356',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44275',
        },
      ],
    },
    '44891': {
      id: '44891',
      label: 'WAS THERE EVIDENCE OF THE STOCKHOLM SYNDROME',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44322',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44322',
        },
      ],
    },
    '44937': {
      id: '44937',
      label: 'ARE ANY STAFF ON SICK LEAVE AS A RESULT OF INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44564',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44564',
        },
      ],
    },
    '44939': {
      id: '44939',
      label: 'WERE FIREARMS OFFICERS DEPLOYED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44210',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44210',
        },
      ],
    },
    '44959': {
      id: '44959',
      label: 'WAS THE EMERGENCY RESPONSE VEHICLE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45079',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45079',
        },
      ],
    },
    '44963': {
      id: '44963',
      label: 'WAS A TECHNICAL SUPPORT UNIT PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44411',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44411',
        },
      ],
    },
    '45004': {
      id: '45004',
      label: 'ENTER NUMBER OF HOSTAGES',
      multipleAnswers: false,
      answers: [
        {
          label: 'NUMBER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45143',
        },
      ],
    },
    '45012': {
      id: '45012',
      label: 'WAS THIS A FULL OR PARTIAL SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'FULL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44239',
        },
        {
          label: 'PARTIAL',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44239',
        },
      ],
    },
    '45059': {
      id: '45059',
      label: 'ENTER DESCRIPTION OF PERSON(S) INJURED',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44218',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44218',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44218',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44218',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44218',
        },
      ],
    },
    '45076': {
      id: '45076',
      label: 'WAS THE SYSTEM COMPROMISED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44611',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44817',
        },
      ],
    },
    '45078': {
      id: '45078',
      label: 'WAS THE FIRE SERVICE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45148',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45148',
        },
      ],
    },
    '45079': {
      id: '45079',
      label: 'WAS AN INCIDENT LIAISON OFFICER PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45087',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45087',
        },
      ],
    },
    '45087': {
      id: '45087',
      label: 'WAS A MEDICAL OFFICER PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44711',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44711',
        },
      ],
    },
    '45093': {
      id: '45093',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44569',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44569',
        },
      ],
    },
    '45101': {
      id: '45101',
      label: 'WAS A SERIOUS INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44693',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44613',
        },
      ],
    },
    '45135': {
      id: '45135',
      label: 'THE INCIDENT IS SUBJECT TO',
      multipleAnswers: true,
      answers: [
        {
          label: 'INVESTIGATION BY POLICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44234',
        },
        {
          label: 'INVESTIGATION INTERNALLY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44234',
        },
        {
          label: "GOVERNOR'S ADJUDICATION",
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44234',
        },
        {
          label: 'NO INVESTIGATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44234',
        },
      ],
    },
    '45143': {
      id: '45143',
      label: 'DESCRIBE STATUS OF HOSTAGES',
      multipleAnswers: true,
      answers: [
        {
          label: 'PRISONER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44823',
        },
        {
          label: 'STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44823',
        },
        {
          label: 'OFFICER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44823',
        },
        {
          label: 'CIVILIAN STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44823',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44823',
        },
      ],
    },
    '45148': {
      id: '45148',
      label: 'WERE WORKS SERVICES STAFF PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44265',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44265',
        },
      ],
    },
    '45162': {
      id: '45162',
      label: 'DURATION OF INCIDENT IN HOURS',
      multipleAnswers: false,
      answers: [
        {
          label: 'HOURS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44311',
        },
      ],
    },
  },
} as const

export default OLD_HOSTAGE

// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-16T15:42:00.278Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const DAMAGE: IncidentTypeConfiguration = {
  incidentType: 'DAMAGE',
  active: true,
  startingQuestionId: '44784',
  questions: {
    '44167': {
      id: '44167',
      code: 'DID INJURIES RESULT IN DETENTION IN OUTSIDE HOSPITAL AS AN IN-PATIENT',
      label: 'DID INJURIES RESULT IN DETENTION IN OUTSIDE HOSPITAL AS AN IN-PATIENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45002',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44655',
        },
      ],
    },
    '44190': {
      id: '44190',
      code: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44572',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44200',
        },
      ],
    },
    '44200': {
      id: '44200',
      code: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45050',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45050',
        },
      ],
    },
    '44230': {
      id: '44230',
      code: 'ENTER DESCRIPTION OF PERSON(S) INJURED',
      label: 'ENTER DESCRIPTION OF PERSON(S) INJURED',
      multipleAnswers: true,
      answers: [
        {
          code: 'STAFF',
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44167',
        },
        {
          code: 'PRISONERS',
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44167',
        },
        {
          code: 'CIVILIAN GRADES',
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44167',
        },
        {
          code: 'POLICE',
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44167',
        },
        {
          code: 'EXTERNAL CIVILIANS',
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44167',
        },
      ],
    },
    '44295': {
      id: '44295',
      code: 'WAS A SERIOUS INJURY SUSTAINED',
      label: 'WAS A SERIOUS INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44785',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
      ],
    },
    '44324': {
      id: '44324',
      code: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      label: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'ADMINISTRATION',
          label: 'ADMINISTRATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'ASSOCIATION AREA',
          label: 'ASSOCIATION AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'CELL',
          label: 'CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'CHAPEL',
          label: 'CHAPEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'DINING ROOM',
          label: 'DINING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'DORMITORY',
          label: 'DORMITORY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'EDUCATION',
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'EXERCISE YARD',
          label: 'EXERCISE YARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'GATE',
          label: 'GATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'GYM',
          label: 'GYM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'HEALTH CARE CENTRE',
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'KITCHEN',
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'OFFICE',
          label: 'OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'RECEPTION',
          label: 'RECEPTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'RECESS',
          label: 'RECESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'SEGREGATION UNIT',
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'SPECIAL UNIT',
          label: 'SPECIAL UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'SHOWERS/CHANGING ROOM',
          label: 'SHOWERS/CHANGING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'VISITS',
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'WING',
          label: 'WING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'WORKS DEPARTMENT',
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'WORKSHOP',
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'WITHIN PERIMETER',
          label: 'WITHIN PERIMETER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'ELSEWHERE',
          label: 'ELSEWHERE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'FUNERAL',
          label: 'FUNERAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'HOSPITAL OUTSIDE (PATIENT)',
          label: 'HOSPITAL OUTSIDE (PATIENT)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'HOSPITAL OUTSIDE (VISITING)',
          label: 'HOSPITAL OUTSIDE (VISITING)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'OUTSIDE WORKING PARTY',
          label: 'OUTSIDE WORKING PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'SPORTS FIELD',
          label: 'SPORTS FIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'VEHICLE',
          label: 'VEHICLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'WEDDINGS',
          label: 'WEDDINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'MAGISTRATES COURT',
          label: 'MAGISTRATES COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
        {
          code: 'CROWN COURT',
          label: 'CROWN COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44343',
        },
      ],
    },
    '44343': {
      id: '44343',
      code: 'WHAT WAS DAMAGED',
      label: 'WHAT WAS DAMAGED',
      multipleAnswers: true,
      answers: [
        {
          code: 'FURNITURE',
          label: 'FURNITURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44466',
        },
        {
          code: 'FITTINGS',
          label: 'FITTINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44466',
        },
        {
          code: 'MACHINERY',
          label: 'MACHINERY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44466',
        },
        {
          code: 'EQUIPMENT',
          label: 'EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44466',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44466',
        },
      ],
    },
    '44379': {
      id: '44379',
      code: 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
      label: 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44295',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44655',
        },
      ],
    },
    '44466': {
      id: '44466',
      code: 'DESCRIBE THE DAMAGE',
      label: 'DESCRIBE THE DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          code: 'MINOR',
          label: 'MINOR',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44763',
        },
        {
          code: 'SERIOUS',
          label: 'SERIOUS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44763',
        },
        {
          code: 'EXTENSIVE',
          label: 'EXTENSIVE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44763',
        },
      ],
    },
    '44512': {
      id: '44512',
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45082',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45082',
        },
      ],
    },
    '44572': {
      id: '44572',
      code: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44200',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44200',
        },
      ],
    },
    '44576': {
      id: '44576',
      code: 'WHICH MINOR INJURIES WERE SUSTAINED',
      label: 'WHICH MINOR INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          code: 'GRAZES, SCRATCHES OR ABRASIONS',
          label: 'GRAZES, SCRATCHES OR ABRASIONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44230',
        },
        {
          code: 'MINOR BRUISES',
          label: 'MINOR BRUISES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44230',
        },
        {
          code: 'SWELLINGS',
          label: 'SWELLINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44230',
        },
        {
          code: 'SUPERFICIAL CUTS',
          label: 'SUPERFICIAL CUTS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44230',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44230',
        },
      ],
    },
    '44655': {
      id: '44655',
      code: 'ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT',
      label: 'ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44735',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44735',
        },
      ],
    },
    '44735': {
      id: '44735',
      code: 'ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT',
      label: 'ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44324',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44324',
        },
      ],
    },
    '44763': {
      id: '44763',
      code: 'ESTIMATED COST OF DAMAGE',
      label: 'ESTIMATED COST OF DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          code: 'ENTER AMOUNT IN POUND STERLING',
          label: 'ENTER AMOUNT IN POUND STERLING',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44784': {
      id: '44784',
      code: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44190',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44200',
        },
      ],
    },
    '44785': {
      id: '44785',
      code: 'WHICH SERIOUS INJURIES WERE SUSTAINED',
      label: 'WHICH SERIOUS INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          code: 'FRACTURE',
          label: 'FRACTURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
        {
          code: 'SCALD OR BURN',
          label: 'SCALD OR BURN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
        {
          code: 'STABBING',
          label: 'STABBING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
        {
          code: 'CRUSHING',
          label: 'CRUSHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
        {
          code: 'EXTENSIVE/MULTIPLE BRUISING',
          label: 'EXTENSIVE/MULTIPLE BRUISING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
        {
          code: 'BLACK EYE',
          label: 'BLACK EYE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
        {
          code: 'BROKEN NOSE',
          label: 'BROKEN NOSE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
        {
          code: 'BROKEN TEETH',
          label: 'BROKEN TEETH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
        {
          code: 'CUTS REQUIRING SUTURES',
          label: 'CUTS REQUIRING SUTURES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
        {
          code: 'BITES',
          label: 'BITES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
        {
          code: 'GUN SHOT WOUND',
          label: 'GUN SHOT WOUND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
        {
          code: 'TEMPORARY/PERMANENT BLINDNESS',
          label: 'TEMPORARY/PERMANENT BLINDNESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44971',
        },
      ],
    },
    '44971': {
      id: '44971',
      code: 'WAS A MINOR INJURY SUSTAINED',
      label: 'WAS A MINOR INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44576',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44230',
        },
      ],
    },
    '45002': {
      id: '45002',
      code: 'WHO WAS DETAINED IN OUTSIDE HOSPITAL',
      label: 'WHO WAS DETAINED IN OUTSIDE HOSPITAL',
      multipleAnswers: true,
      answers: [
        {
          code: 'STAFF',
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44655',
        },
        {
          code: 'PRISONERS',
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44655',
        },
        {
          code: 'CIVILIAN GRADES',
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44655',
        },
        {
          code: 'POLICE',
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44655',
        },
        {
          code: 'EXTERNAL CIVILIANS',
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44655',
        },
      ],
    },
    '45050': {
      id: '45050',
      code: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44512',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44512',
        },
      ],
    },
    '45082': {
      id: '45082',
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44379',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44379',
        },
      ],
    },
  },
} as const

export default DAMAGE

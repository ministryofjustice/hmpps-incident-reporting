// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:58.543Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const MISCELLANEOUS: IncidentTypeConfiguration = {
  incidentType: 'MISCELLANEOUS',
  active: true,
  startingQuestionId: '44290',
  questions: {
    '44129': {
      id: '44129',
      label: 'DID INJURIES RESULT IN DETENTION IN OUTSIDE HOSPITAL AS AN IN-PATIENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44503',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44588',
        },
      ],
    },
    '44133': {
      id: '44133',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45122',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45122',
        },
      ],
    },
    '44144': {
      id: '44144',
      label: 'WHICH MINOR INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          label: 'GRAZES, SCRATCHES OR ABRASIONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44730',
        },
        {
          label: 'MINOR BRUISES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44730',
        },
        {
          label: 'SWELLINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44730',
        },
        {
          label: 'SUPERFICIAL CUTS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44730',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44730',
        },
      ],
    },
    '44223': {
      id: '44223',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44133',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44133',
        },
      ],
    },
    '44290': {
      id: '44290',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44607',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44133',
        },
      ],
    },
    '44456': {
      id: '44456',
      label: 'WAS A SERIOUS INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44667',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
      ],
    },
    '44503': {
      id: '44503',
      label: 'WHO WAS DETAINED IN OUTSIDE HOSPITAL',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44588',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44588',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44588',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44588',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44588',
        },
      ],
    },
    '44541': {
      id: '44541',
      label: 'ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44601',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44601',
        },
      ],
    },
    '44588': {
      id: '44588',
      label: 'ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44541',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44541',
        },
      ],
    },
    '44591': {
      id: '44591',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44995',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44995',
        },
      ],
    },
    '44601': {
      id: '44601',
      label: 'WAS DAMAGE CAUSED TO PRISON PROPERTY',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45159',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44607': {
      id: '44607',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44223',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44133',
        },
      ],
    },
    '44667': {
      id: '44667',
      label: 'WHICH SERIOUS INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FRACTURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          label: 'SCALD OR BURN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          label: 'STABBING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          label: 'CRUSHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          label: 'EXTENSIVE OR MULTIPLE BRUISING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          label: 'BLACK EYE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          label: 'BROKEN NOSE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          label: 'BROKEN TEETH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          label: 'CUTS REQUIRING SUTURING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          label: 'BITES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          label: 'TEMPORARY/PERMANENT BLINDNESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
      ],
    },
    '44730': {
      id: '44730',
      label: 'ENTER DESCRIPTION OF PERSON(S) INJURED',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44129',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44129',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44129',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44129',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44129',
        },
      ],
    },
    '44857': {
      id: '44857',
      label: 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44456',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44588',
        },
      ],
    },
    '44995': {
      id: '44995',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44857',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44857',
        },
      ],
    },
    '45106': {
      id: '45106',
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
    '45122': {
      id: '45122',
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45139',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45139',
        },
      ],
    },
    '45125': {
      id: '45125',
      label: 'DESCRIBE THE DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'MINOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45106',
        },
        {
          label: 'SERIOUS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45106',
        },
        {
          label: 'EXTENSIVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45106',
        },
      ],
    },
    '45139': {
      id: '45139',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44591',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44591',
        },
      ],
    },
    '45159': {
      id: '45159',
      label: 'WHAT WAS DAMAGED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FURNITURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45125',
        },
        {
          label: 'FITTINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45125',
        },
        {
          label: 'MACHINERY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45125',
        },
        {
          label: 'EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45125',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45125',
        },
      ],
    },
    '45161': {
      id: '45161',
      label: 'WAS A MINOR INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44144',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44730',
        },
      ],
    },
  },
} as const

export default MISCELLANEOUS

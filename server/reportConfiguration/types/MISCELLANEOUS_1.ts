// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2025-04-01T22:59:52.049Z

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

export const MISCELLANEOUS_1: IncidentTypeConfiguration = {
  incidentType: 'MISCELLANEOUS_1',
  active: true,
  startingQuestionId: '44290',
  questions: {
    '44129': {
      id: '44129',
      active: true,
      code: 'DID INJURIES RESULT IN DETENTION IN OUTSIDE HOSPITAL AS AN IN-PATIENT',
      label: 'Did injuries result in detention in outside hospital as an in-patient?',
      multipleAnswers: false,
      answers: [
        {
          id: '178923',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44503',
        },
        {
          id: '178924',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44588',
        },
      ],
    },
    '44133': {
      id: '44133',
      active: true,
      code: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      label: 'Is the incident the subject of an internal investigation?',
      multipleAnswers: false,
      answers: [
        {
          id: '178931',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45122',
        },
        {
          id: '178930',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45122',
        },
      ],
    },
    '44144': {
      id: '44144',
      active: true,
      code: 'WHICH MINOR INJURIES WERE SUSTAINED',
      label: 'Which minor injuries were sustained?',
      multipleAnswers: true,
      answers: [
        {
          id: '178981',
          code: 'GRAZES, SCRATCHES OR ABRASIONS',
          active: true,
          label: 'Grazes, scratches or abrasions',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44730',
        },
        {
          id: '178982',
          code: 'MINOR BRUISES',
          active: true,
          label: 'Minor bruises',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44730',
        },
        {
          id: '178985',
          code: 'SWELLINGS',
          active: true,
          label: 'Swellings',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44730',
        },
        {
          id: '178984',
          code: 'SUPERFICIAL CUTS',
          active: true,
          label: 'Superficial cuts',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44730',
        },
        {
          id: '178983',
          code: 'OTHER',
          active: true,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44730',
        },
      ],
    },
    '44223': {
      id: '44223',
      active: true,
      code: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      label: 'Has any prosecution taken place or is any pending?',
      multipleAnswers: false,
      answers: [
        {
          id: '179220',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44133',
        },
        {
          id: '179219',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44133',
        },
      ],
    },
    '44290': {
      id: '44290',
      active: true,
      code: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      label: 'Were the police informed of the incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '179418',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44607',
        },
        {
          id: '179419',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44133',
        },
      ],
    },
    '44456': {
      id: '44456',
      active: true,
      code: 'WAS A SERIOUS INJURY SUSTAINED',
      label: 'Was a serious injury sustained?',
      multipleAnswers: false,
      answers: [
        {
          id: '180003',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44667',
        },
        {
          id: '180004',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
      ],
    },
    '44503': {
      id: '44503',
      active: true,
      code: 'WHO WAS DETAINED IN OUTSIDE HOSPITAL',
      label: 'Who was detained in outside hospital?',
      multipleAnswers: true,
      answers: [
        {
          id: '180236',
          code: 'STAFF',
          active: true,
          label: 'Staff',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44588',
        },
        {
          id: '180235',
          code: 'PRISONERS',
          active: true,
          label: 'Prisoners',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44588',
        },
        {
          id: '180232',
          code: 'CIVILIAN GRADES',
          active: true,
          label: 'Civilian grades',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44588',
        },
        {
          id: '180234',
          code: 'POLICE',
          active: true,
          label: 'Police',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44588',
        },
        {
          id: '180233',
          code: 'EXTERNAL CIVILIANS',
          active: true,
          label: 'External civilians',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44588',
        },
      ],
    },
    '44541': {
      id: '44541',
      active: true,
      code: 'ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT',
      label: 'Are any staff on sick leave as a result of this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '180412',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44601',
        },
        {
          id: '180411',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44601',
        },
      ],
    },
    '44588': {
      id: '44588',
      active: true,
      code: 'ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT',
      label: 'Are there any staff now off duty as a result of this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '180544',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44541',
        },
        {
          id: '180543',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44541',
        },
      ],
    },
    '44591': {
      id: '44591',
      active: true,
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'Is there any media interest in this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '180557',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44995',
        },
        {
          id: '180556',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44995',
        },
      ],
    },
    '44601': {
      id: '44601',
      active: true,
      code: 'WAS DAMAGE CAUSED TO PRISON PROPERTY',
      label: 'Was damage caused to prison property?',
      multipleAnswers: false,
      answers: [
        {
          id: '180604',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45159',
        },
        {
          id: '180605',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44607': {
      id: '44607',
      active: true,
      code: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      label: 'Is the incident the subject of a police investigation?',
      multipleAnswers: false,
      answers: [
        {
          id: '180620',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44223',
        },
        {
          id: '180621',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44133',
        },
      ],
    },
    '44667': {
      id: '44667',
      active: true,
      code: 'WHICH SERIOUS INJURIES WERE SUSTAINED',
      label: 'Which serious injuries were sustained?',
      multipleAnswers: true,
      answers: [
        {
          id: '180815',
          code: 'FRACTURE',
          active: true,
          label: 'Fracture',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          id: '180816',
          code: 'SCALD OR BURN',
          active: true,
          label: 'Scald or burn',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          id: '180817',
          code: 'STABBING',
          active: true,
          label: 'Stabbing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          id: '180812',
          code: 'CRUSHING',
          active: true,
          label: 'Crushing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          id: '180814',
          code: 'EXTENSIVE OR MULTIPLE BRUISING',
          active: true,
          label: 'Extensive or multiple bruising',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          id: '180809',
          code: 'BLACK EYE',
          active: true,
          label: 'Black eye',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          id: '180810',
          code: 'BROKEN NOSE',
          active: true,
          label: 'Broken nose',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          id: '180811',
          code: 'BROKEN TEETH',
          active: true,
          label: 'Broken teeth',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          id: '180813',
          code: 'CUTS REQUIRING SUTURING',
          active: true,
          label: 'Cuts requiring suturing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          id: '180808',
          code: 'BITES',
          active: true,
          label: 'Bites',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
        {
          id: '180818',
          code: 'TEMPORARY/PERMANENT BLINDNESS',
          active: true,
          label: 'Temporary/permanent blindness',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45161',
        },
      ],
    },
    '44730': {
      id: '44730',
      active: true,
      code: 'ENTER DESCRIPTION OF PERSON(S) INJURED',
      label: 'Enter description of person(s) injured',
      multipleAnswers: true,
      answers: [
        {
          id: '181057',
          code: 'STAFF',
          active: true,
          label: 'Staff',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44129',
        },
        {
          id: '181056',
          code: 'PRISONERS',
          active: true,
          label: 'Prisoners',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44129',
        },
        {
          id: '181053',
          code: 'CIVILIAN GRADES',
          active: true,
          label: 'Civilian grades',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44129',
        },
        {
          id: '181055',
          code: 'POLICE',
          active: true,
          label: 'Police',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44129',
        },
        {
          id: '181054',
          code: 'EXTERNAL CIVILIANS',
          active: true,
          label: 'External civilians',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44129',
        },
      ],
    },
    '44857': {
      id: '44857',
      active: true,
      code: 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
      label: 'Were any injuries received during this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '181416',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44456',
        },
        {
          id: '181417',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44588',
        },
      ],
    },
    '44995': {
      id: '44995',
      active: true,
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'Has the prison service press office been informed?',
      multipleAnswers: false,
      answers: [
        {
          id: '181946',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44857',
        },
        {
          id: '181945',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44857',
        },
      ],
    },
    '45106': {
      id: '45106',
      active: true,
      code: 'ESTIMATED COST OF DAMAGE',
      label: 'Estimated cost of damage',
      multipleAnswers: false,
      answers: [
        {
          id: '182370',
          code: 'ENTER AMOUNT IN POUND STERLING',
          active: true,
          label: 'Enter amount in pound sterling',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '45122': {
      id: '45122',
      active: true,
      code: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      label: "Is the incident subject to a governor's adjudication?",
      multipleAnswers: false,
      answers: [
        {
          id: '182445',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45139',
        },
        {
          id: '182444',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45139',
        },
      ],
    },
    '45125': {
      id: '45125',
      active: true,
      code: 'DESCRIBE THE DAMAGE',
      label: 'Describe the damage',
      multipleAnswers: false,
      answers: [
        {
          id: '182454',
          code: 'MINOR',
          active: true,
          label: 'Minor',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45106',
        },
        {
          id: '182455',
          code: 'SERIOUS',
          active: true,
          label: 'Serious',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45106',
        },
        {
          id: '182453',
          code: 'EXTENSIVE',
          active: true,
          label: 'Extensive',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45106',
        },
      ],
    },
    '45139': {
      id: '45139',
      active: true,
      code: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      label: 'Is any member of staff facing disciplinary charges?',
      multipleAnswers: false,
      answers: [
        {
          id: '182523',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44591',
        },
        {
          id: '182522',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44591',
        },
      ],
    },
    '45159': {
      id: '45159',
      active: true,
      code: 'WHAT WAS DAMAGED',
      label: 'What was damaged?',
      multipleAnswers: true,
      answers: [
        {
          id: '182596',
          code: 'FURNITURE',
          active: true,
          label: 'Furniture',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45125',
        },
        {
          id: '182595',
          code: 'FITTINGS',
          active: true,
          label: 'Fittings',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45125',
        },
        {
          id: '182597',
          code: 'MACHINERY',
          active: true,
          label: 'Machinery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45125',
        },
        {
          id: '182594',
          code: 'EQUIPMENT',
          active: true,
          label: 'Equipment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45125',
        },
        {
          id: '182598',
          code: 'OTHER',
          active: true,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45125',
        },
      ],
    },
    '45161': {
      id: '45161',
      active: true,
      code: 'WAS A MINOR INJURY SUSTAINED',
      label: 'Was a minor injury sustained?',
      multipleAnswers: false,
      answers: [
        {
          id: '182601',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44144',
        },
        {
          id: '182602',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44730',
        },
      ],
    },
  },
  prisonerRoles: [
    {
      prisonerRole: 'ACTIVE_INVOLVEMENT',
      onlyOneAllowed: false,
      active: true,
    },
    {
      prisonerRole: 'ASSISTED_STAFF',
      onlyOneAllowed: false,
      active: true,
    },
    {
      prisonerRole: 'IMPEDED_STAFF',
      onlyOneAllowed: false,
      active: true,
    },
    {
      prisonerRole: 'PERPETRATOR',
      onlyOneAllowed: false,
      active: true,
    },
    {
      prisonerRole: 'SUSPECTED_INVOLVED',
      onlyOneAllowed: false,
      active: true,
    },
    {
      // NB: new; not allowed in NOMIS
      prisonerRole: 'VICTIM',
      onlyOneAllowed: false,
      active: true,
    },
  ],
}

export default MISCELLANEOUS_1

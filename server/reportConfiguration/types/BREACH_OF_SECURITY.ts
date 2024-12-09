// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-12-03T16:21:14.889Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const BREACH_OF_SECURITY: IncidentTypeConfiguration = {
  incidentType: 'BREACH_OF_SECURITY',
  active: true,
  startingQuestionId: '44253',
  questions: {
    '44124': {
      id: '44124',
      active: true,
      code: 'WAS DAMAGE CAUSED TO PRISON PROPERTY',
      label: 'Was damage caused to prison property?',
      multipleAnswers: false,
      answers: [
        {
          id: '178894',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44136',
        },
        {
          id: '178895',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44249',
        },
      ],
    },
    '44136': {
      id: '44136',
      active: true,
      code: 'WHAT WAS DAMAGED',
      label: 'What was damaged?',
      multipleAnswers: true,
      answers: [
        {
          id: '178948',
          code: 'FURNITURE',
          active: true,
          label: 'Furniture',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45016',
        },
        {
          id: '178947',
          code: 'FITTINGS',
          active: true,
          label: 'Fittings',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45016',
        },
        {
          id: '178949',
          code: 'MACHINERY',
          active: true,
          label: 'Machinery',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45016',
        },
        {
          id: '178946',
          code: 'EQUIPMENT',
          active: true,
          label: 'Equipment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45016',
        },
        {
          id: '178950',
          code: 'OTHER',
          active: true,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45016',
        },
      ],
    },
    '44249': {
      id: '44249',
      active: true,
      code: 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
      label: 'Were any injuries received during this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '179321',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45137',
        },
        {
          id: '179322',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44906',
        },
      ],
    },
    '44253': {
      id: '44253',
      active: true,
      code: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      label: 'Were the police informed of the incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '179329',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44286',
        },
        {
          id: '179330',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44364',
        },
      ],
    },
    '44286': {
      id: '44286',
      active: true,
      code: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      label: 'Is the incident the subject of a police investigation?',
      multipleAnswers: false,
      answers: [
        {
          id: '179410',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44364',
        },
        {
          id: '179409',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44364',
        },
      ],
    },
    '44301': {
      id: '44301',
      active: true,
      code: 'DESCRIBE THE ILLICIT ITEM FOUND',
      label: 'Describe the illicit item found',
      multipleAnswers: true,
      answers: [
        {
          id: '179472',
          code: 'WEAPONS',
          active: true,
          label: 'Weapons',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179465',
          code: 'ALCOHOL',
          active: true,
          label: 'Alcohol',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179467',
          code: 'CIGARETTES',
          active: true,
          label: 'Cigarettes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179470',
          code: 'TOBACCO',
          active: true,
          label: 'Tobacco',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179466',
          code: 'CASH',
          active: true,
          label: 'Cash',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179468',
          code: 'ESCAPE EQUIPMENT',
          active: true,
          label: 'Escape equipment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179471',
          code: 'TOOLS',
          active: true,
          label: 'Tools',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '179469',
          code: 'OTHER',
          active: true,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44333': {
      id: '44333',
      active: true,
      code: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      label: 'Has any prosecution taken place or is any pending?',
      multipleAnswers: false,
      answers: [
        {
          id: '179624',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44124',
        },
        {
          id: '179623',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44124',
        },
      ],
    },
    '44364': {
      id: '44364',
      active: true,
      code: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      label: 'Is the incident the subject of an internal investigation?',
      multipleAnswers: false,
      answers: [
        {
          id: '179718',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44786',
        },
        {
          id: '179717',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44786',
        },
      ],
    },
    '44389': {
      id: '44389',
      active: true,
      code: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      label: 'Has any prosecution taken place or is any pending?',
      multipleAnswers: false,
      answers: [
        {
          id: '179814',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44883',
        },
        {
          id: '179813',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44883',
        },
      ],
    },
    '44500': {
      id: '44500',
      active: true,
      code: 'WAS THE DEMONSTRATION KNOWN ABOUT IN ADVANCE',
      label: 'Was the demonstration known about in advance?',
      multipleAnswers: false,
      answers: [
        {
          id: '180225',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44606',
        },
        {
          id: '180226',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44658',
        },
      ],
    },
    '44514': {
      id: '44514',
      active: true,
      code: 'DID UNAUTHORISED PERSONS ENTER THE PRISON',
      label: 'Did unauthorised persons enter the prison?',
      multipleAnswers: false,
      answers: [
        {
          id: '180262',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44543',
        },
        {
          id: '180263',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44883',
        },
      ],
    },
    '44543': {
      id: '44543',
      active: true,
      code: 'WERE THESE PERSONS APPREHENDED',
      label: 'Were these persons apprehended?',
      multipleAnswers: false,
      answers: [
        {
          id: '180417',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44855',
        },
        {
          id: '180418',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44883',
        },
      ],
    },
    '44561': {
      id: '44561',
      active: true,
      code: 'WAS A KNOWN ORGANISATION INVOLVED',
      label: 'Was a known organisation involved?',
      multipleAnswers: false,
      answers: [
        {
          id: '180465',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44500',
        },
        {
          id: '180464',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44500',
        },
      ],
    },
    '44606': {
      id: '44606',
      active: true,
      code: 'HOW WAS IT KNOWN ABOUT',
      label: 'How was it known about?',
      multipleAnswers: false,
      answers: [
        {
          id: '180618',
          code: 'INFORMATION FROM PRISONERS',
          active: true,
          label: 'Information from prisoners',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44658',
        },
        {
          id: '180617',
          code: 'INFORMATION FROM POLICE',
          active: true,
          label: 'Information from police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44658',
        },
        {
          id: '180616',
          code: 'INFORMATION FROM HQ/AM',
          active: true,
          label: 'Information from hq/am',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44658',
        },
        {
          id: '180619',
          code: 'OTHER',
          active: true,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44658',
        },
      ],
    },
    '44616': {
      id: '44616',
      active: true,
      code: 'ESTIMATED COST OF DAMAGE',
      label: 'Estimated cost of damage',
      multipleAnswers: false,
      answers: [
        {
          id: '180643',
          code: 'ENTER AMOUNT IN POUND STERLING',
          active: true,
          label: 'Enter amount in pound sterling',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44249',
        },
      ],
    },
    '44658': {
      id: '44658',
      active: true,
      code: 'WHAT WAS THE REASON FOR THE DEMONSTRATION',
      label: 'What was the reason for the demonstration?',
      multipleAnswers: false,
      answers: [
        {
          id: '180794',
          code: 'PARTICULAR PRISONER',
          active: true,
          label: 'Particular prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44686',
        },
        {
          id: '180792',
          code: 'LOCAL ISSUE',
          active: true,
          label: 'Local issue',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44686',
        },
        {
          id: '180791',
          code: 'GENERAL ISSUE',
          active: true,
          label: 'General issue',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44686',
        },
        {
          id: '180793',
          code: 'OTHER',
          active: true,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44686',
        },
      ],
    },
    '44686': {
      id: '44686',
      active: true,
      code: 'DID THE POLICE ATTEND',
      label: 'Did the police attend?',
      multipleAnswers: false,
      answers: [
        {
          id: '180859',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44728',
        },
        {
          id: '180860',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44124',
        },
      ],
    },
    '44709': {
      id: '44709',
      active: true,
      code: 'WAS THE DEMONSTRATION ORGANISED OR SPONTANEOUS',
      label: 'Was the demonstration organised or spontaneous?',
      multipleAnswers: false,
      answers: [
        {
          id: '180978',
          code: 'ORGANISED',
          active: true,
          label: 'Organised',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44561',
        },
        {
          id: '180979',
          code: 'SPONTANEOUS',
          active: true,
          label: 'Spontaneous',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44561',
        },
      ],
    },
    '44728': {
      id: '44728',
      active: true,
      code: 'WERE ANY ARRESTS MADE',
      label: 'Were any arrests made?',
      multipleAnswers: false,
      answers: [
        {
          id: '181050',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44333',
        },
        {
          id: '181049',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44333',
        },
      ],
    },
    '44786': {
      id: '44786',
      active: true,
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'Is there any media interest in this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '181201',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45095',
        },
        {
          id: '181200',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45095',
        },
      ],
    },
    '44855': {
      id: '44855',
      active: true,
      code: 'WERE THESE PERSONS ARRESTED BY THE POLICE',
      label: 'Were these persons arrested by the police?',
      multipleAnswers: false,
      answers: [
        {
          id: '181412',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44389',
        },
        {
          id: '181413',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44883',
        },
      ],
    },
    '44864': {
      id: '44864',
      active: true,
      code: 'WAS THE SECURE PERIMETER BREACHED',
      label: 'Was the secure perimeter breached?',
      multipleAnswers: false,
      answers: [
        {
          id: '181445',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44918',
        },
        {
          id: '181446',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44514',
        },
      ],
    },
    '44883': {
      id: '44883',
      active: true,
      code: 'WAS THE INCIDENT A DEMONSTRATION',
      label: 'Was the incident a demonstration?',
      multipleAnswers: false,
      answers: [
        {
          id: '181530',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44709',
        },
        {
          id: '181531',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44124',
        },
      ],
    },
    '44906': {
      id: '44906',
      active: true,
      code: 'WERE ANY ILLICIT ITEMS FOUND',
      label: 'Were any illicit items found?',
      multipleAnswers: false,
      answers: [
        {
          id: '181605',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44301',
        },
        {
          id: '181606',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44918': {
      id: '44918',
      active: true,
      code: 'DESCRIBE HOW THE SECURE PERIMETER WAS BREACHED',
      label: 'Describe how the secure perimeter was breached',
      multipleAnswers: false,
      answers: [
        {
          id: '181645',
          code: 'THROWN OVER',
          active: true,
          label: 'Thrown over',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44514',
        },
        {
          id: '181641',
          code: 'CLIMBED OVER',
          active: true,
          label: 'Climbed over',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44514',
        },
        {
          id: '181642',
          code: 'CUT THROUGH',
          active: true,
          label: 'Cut through',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44514',
        },
        {
          id: '181646',
          code: 'VEHICLE RAMMED',
          active: true,
          label: 'Vehicle rammed',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44514',
        },
        {
          id: '181643',
          code: 'EXPLOSIVES',
          active: true,
          label: 'Explosives',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44514',
        },
        {
          id: '181644',
          code: 'OTHER',
          active: true,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44514',
        },
      ],
    },
    '44946': {
      id: '44946',
      active: true,
      code: 'WHAT WAS THE INCIDENT LOCATION',
      label: 'What was the incident location?',
      multipleAnswers: false,
      answers: [
        {
          id: '181777',
          code: 'INSIDE PRISON',
          active: true,
          label: 'Inside prison',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44864',
        },
        {
          id: '181778',
          code: 'OUTSIDE PRISON',
          active: true,
          label: 'Outside prison',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44864',
        },
      ],
    },
    '45016': {
      id: '45016',
      active: true,
      code: 'DESCRIBE THE DAMAGE',
      label: 'Describe the damage',
      multipleAnswers: false,
      answers: [
        {
          id: '182006',
          code: 'MINOR',
          active: true,
          label: 'Minor',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44616',
        },
        {
          id: '182007',
          code: 'SERIOUS',
          active: true,
          label: 'Serious',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44616',
        },
        {
          id: '182005',
          code: 'EXTENSIVE',
          active: true,
          label: 'Extensive',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44616',
        },
      ],
    },
    '45095': {
      id: '45095',
      active: true,
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'Has the prison service press office been informed?',
      multipleAnswers: false,
      answers: [
        {
          id: '182326',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44946',
        },
        {
          id: '182325',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44946',
        },
      ],
    },
    '45137': {
      id: '45137',
      active: true,
      code: 'ENTER DESCRIPTION OF PERSON(S) INJURED',
      label: 'Enter description of person(s) injured',
      multipleAnswers: true,
      answers: [
        {
          id: '182518',
          code: 'STAFF',
          active: true,
          label: 'Staff',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44906',
        },
        {
          id: '182517',
          code: 'PRISONERS',
          active: true,
          label: 'Prisoners',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44906',
        },
        {
          id: '182514',
          code: 'CIVILIAN GRADES',
          active: true,
          label: 'Civilian grades',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44906',
        },
        {
          id: '182516',
          code: 'POLICE',
          active: true,
          label: 'Police',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44906',
        },
        {
          id: '182515',
          code: 'EXTERNAL CIVILIANS',
          active: true,
          label: 'External civilians',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44906',
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
      prisonerRole: 'PRESENT_AT_SCENE',
      onlyOneAllowed: false,
      active: true,
    },
    {
      prisonerRole: 'SUSPECTED_INVOLVED',
      onlyOneAllowed: false,
      active: true,
    },
  ],
} as const

export default BREACH_OF_SECURITY

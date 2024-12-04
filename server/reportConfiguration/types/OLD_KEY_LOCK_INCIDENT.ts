// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-12-03T16:21:44.742Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_KEY_LOCK_INCIDENT: IncidentTypeConfiguration = {
  incidentType: 'OLD_KEY_LOCK_INCIDENT',
  active: false,
  startingQuestionId: '44598',
  questions: {
    '44166': {
      id: '44166',
      active: false,
      code: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      label: 'Has any prosecution taken place or is any pending?',
      multipleAnswers: false,
      answers: [
        {
          id: '179053',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44331',
        },
        {
          id: '179052',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44331',
        },
      ],
    },
    '44228': {
      id: '44228',
      active: false,
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'Has the prison service press office been informed?',
      multipleAnswers: false,
      answers: [
        {
          id: '179240',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44972',
        },
        {
          id: '179239',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44972',
        },
      ],
    },
    '44331': {
      id: '44331',
      active: false,
      code: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      label: 'Is the incident the subject of an internal investigation?',
      multipleAnswers: false,
      answers: [
        {
          id: '179618',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44386',
        },
        {
          id: '179617',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44386',
        },
      ],
    },
    '44355': {
      id: '44355',
      active: false,
      code: 'HAS A REPLICA BEEN FOUND',
      label: 'Has a replica been found?',
      multipleAnswers: false,
      answers: [
        {
          id: '179699',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44894',
        },
        {
          id: '179698',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44894',
        },
      ],
    },
    '44386': {
      id: '44386',
      active: false,
      code: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      label: "Is the incident subject to a governor's adjudication?",
      multipleAnswers: false,
      answers: [
        {
          id: '179807',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44414',
        },
        {
          id: '179806',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44414',
        },
      ],
    },
    '44407': {
      id: '44407',
      active: false,
      code: 'WHAT TOOLS WERE USED',
      label: 'What tools were used?',
      multipleAnswers: true,
      answers: [
        {
          id: '179860',
          code: 'HACKSAW BLADE',
          active: false,
          label: 'Hacksaw blade',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          id: '179863',
          code: 'OTHER BLADE',
          active: false,
          label: 'Other blade',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          id: '179865',
          code: 'WIRE CUTTERS',
          active: false,
          label: 'Wire cutters',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          id: '179857',
          code: 'BOLT CROPPERS',
          active: false,
          label: 'Bolt croppers',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          id: '179859',
          code: 'DIGGING TOOL',
          active: false,
          label: 'Digging tool',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          id: '179858',
          code: 'CROW BAR',
          active: false,
          label: 'Crow bar',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          id: '179861',
          code: 'IMPROVISED TOOL',
          active: false,
          label: 'Improvised tool',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          id: '179864',
          code: 'OTHER TOOL',
          active: false,
          label: 'Other tool',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          id: '179862',
          code: 'NOT KNOWN',
          active: false,
          label: 'Not known',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
      ],
    },
    '44414': {
      id: '44414',
      active: false,
      code: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      label: 'Is any member of staff facing disciplinary charges?',
      multipleAnswers: false,
      answers: [
        {
          id: '179886',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44678',
        },
        {
          id: '179885',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44678',
        },
      ],
    },
    '44449': {
      id: '44449',
      active: false,
      code: 'DESCRIBE THE REMEDIAL ACTION TAKEN',
      label: 'Describe the remedial action taken',
      multipleAnswers: false,
      answers: [
        {
          id: '179981',
          code: 'COMPLETE RELOCK',
          active: false,
          label: 'Complete relock',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44921',
        },
        {
          id: '179983',
          code: 'PARTIAL RELOCK',
          active: false,
          label: 'Partial relock',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44921',
        },
        {
          id: '179982',
          code: 'COMPLETE REPLACEMENT',
          active: false,
          label: 'Complete replacement',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44921',
        },
        {
          id: '179984',
          code: 'PARTIAL REPLACEMENT',
          active: false,
          label: 'Partial replacement',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44921',
        },
      ],
    },
    '44598': {
      id: '44598',
      active: false,
      code: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      label: 'Were the police informed of the incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '180597',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45072',
        },
        {
          id: '180598',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44166',
        },
      ],
    },
    '44619': {
      id: '44619',
      active: false,
      code: 'HAVE THE LOST ITEM(S) BEEN FOUND',
      label: 'Have the lost item(s) been found?',
      multipleAnswers: false,
      answers: [
        {
          id: '180656',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44894',
        },
        {
          id: '180655',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44894',
        },
      ],
    },
    '44678': {
      id: '44678',
      active: false,
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'Is there any media interest in this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '180843',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44228',
        },
        {
          id: '180842',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44228',
        },
      ],
    },
    '44775': {
      id: '44775',
      active: false,
      code: 'HAS ANY REMEDIAL ACTION BEEN TAKEN',
      label: 'Has any remedial action been taken?',
      multipleAnswers: false,
      answers: [
        {
          id: '181168',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44449',
        },
        {
          id: '181169',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44866': {
      id: '44866',
      active: false,
      code: 'WERE TOOLS USED',
      label: 'Were tools used?',
      multipleAnswers: false,
      answers: [
        {
          id: '181450',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44407',
        },
        {
          id: '181451',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
      ],
    },
    '44894': {
      id: '44894',
      active: false,
      code: 'WHAT ACTION WAS TAKEN TO FIND THESE ITEMS',
      label: 'What action was taken to find these items?',
      multipleAnswers: false,
      answers: [
        {
          id: '181562',
          code: 'FULL CLOSE DOWN SEARCH',
          active: false,
          label: 'Full close down search',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44866',
        },
        {
          id: '181564',
          code: 'PARTIAL SEARCH',
          active: false,
          label: 'Partial search',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44866',
        },
        {
          id: '181563',
          code: 'OTHER',
          active: false,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44866',
        },
      ],
    },
    '44921': {
      id: '44921',
      active: false,
      code: 'ESTIMATED COST OF THIS ACTION',
      label: 'Estimated cost of this action',
      multipleAnswers: false,
      answers: [
        {
          id: '181652',
          code: 'ENTER AMOUNT IN POUND STERLING',
          active: false,
          label: 'Enter amount in pound sterling',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44925': {
      id: '44925',
      active: false,
      code: 'WHAT WAS THE SOURCE OF THE TOOLS',
      label: 'What was the source of the tools?',
      multipleAnswers: true,
      answers: [
        {
          id: '181680',
          code: 'WORKS DEPARTMENT',
          active: false,
          label: 'Works department',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181669',
          code: 'CONTRACTORS',
          active: false,
          label: 'Contractors',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181670',
          code: 'EDUCATION',
          active: false,
          label: 'Education',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181673',
          code: 'HEALTH CARE CENTRE',
          active: false,
          label: 'Health care centre',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181671',
          code: 'FARMS AND GARDENS',
          active: false,
          label: 'Farms and gardens',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181672',
          code: 'GYMNASIUM/SPORTS FIELD',
          active: false,
          label: 'Gymnasium/sports field',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181681',
          code: 'WORKSHOPS',
          active: false,
          label: 'Workshops',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181675',
          code: 'KITCHEN',
          active: false,
          label: 'Kitchen',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181674',
          code: 'HOBBIES',
          active: false,
          label: 'Hobbies',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181668',
          code: 'CELL FURNISHINGS',
          active: false,
          label: 'Cell furnishings',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181679',
          code: 'WING/HOUSEBLOCK FURNISHINGS',
          active: false,
          label: 'Wing/houseblock furnishings',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181678',
          code: 'SMUGGLED',
          active: false,
          label: 'Smuggled',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181676',
          code: 'NOT KNOWN',
          active: false,
          label: 'Not known',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          id: '181677',
          code: 'OTHER',
          active: false,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44775',
        },
      ],
    },
    '44972': {
      id: '44972',
      active: false,
      code: 'DESCRIBE THE TYPE OF KEY OR LOCK COMPROMISE',
      label: 'Describe the type of key or lock compromise',
      multipleAnswers: true,
      answers: [
        {
          id: '181869',
          code: 'CLASS 1 PASS KEY',
          active: false,
          label: 'Class 1 pass key',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181871',
          code: 'CLASS 2 PASS KEY',
          active: false,
          label: 'Class 2 pass key',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181866',
          code: 'CELL KEY',
          active: false,
          label: 'Cell key',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181872',
          code: 'CLASS 3 A1 SUITE KEY',
          active: false,
          label: 'Class 3 a1 suite key',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181874',
          code: 'CLASS 3 ACCOUNTABLE KEY',
          active: false,
          label: 'Class 3 accountable key',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181880',
          code: 'HANDCUFF KEY',
          active: false,
          label: 'Handcuff key',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181877',
          code: 'CLOSETING/ESCORT CHAIN KEY',
          active: false,
          label: 'Closeting/escort chain key',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181868',
          code: 'CLASS 1 LOCK',
          active: false,
          label: 'Class 1 lock',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181870',
          code: 'CLASS 2 LOCK',
          active: false,
          label: 'Class 2 lock',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181867',
          code: 'CELL LOCK',
          active: false,
          label: 'Cell lock',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181873',
          code: 'CLASS 3 A1 SUITE LOCK',
          active: false,
          label: 'Class 3 a1 suite lock',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181875',
          code: 'CLASS 3 ACCOUNTABLE LOCK',
          active: false,
          label: 'Class 3 accountable lock',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181879',
          code: 'HANDCUFF',
          active: false,
          label: 'Handcuff',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181876',
          code: 'CLOSETING/ESCORT CHAIN',
          active: false,
          label: 'Closeting/escort chain',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181878',
          code: 'ELECTRONIC LOCK SYSTEM',
          active: false,
          label: 'Electronic lock system',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          id: '181881',
          code: 'OTHER',
          active: false,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45015',
        },
      ],
    },
    '45015': {
      id: '45015',
      active: false,
      code: 'DESCRIBE THE NATURE OF THE COMPROMISE',
      label: 'Describe the nature of the compromise',
      multipleAnswers: true,
      answers: [
        {
          id: '181999',
          code: 'LOSS OF KEY(S)',
          active: false,
          label: 'Loss of key(s)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          id: '181998',
          code: 'LOSS OF HANDCUFFS',
          active: false,
          label: 'Loss of handcuffs',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          id: '181997',
          code: 'LOSS OF CLOSETING/ESCORT CHAIN',
          active: false,
          label: 'Loss of closeting/escort chain',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          id: '181996',
          code: 'COMPLETE LOCK REMOVED',
          active: false,
          label: 'Complete lock removed',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          id: '182000',
          code: 'PART LOCK REMOVED',
          active: false,
          label: 'Part lock removed',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          id: '182001',
          code: 'REPLICA KEY USED',
          active: false,
          label: 'Replica key used',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44355',
        },
        {
          id: '182003',
          code: 'LOCKS PICKED',
          active: false,
          label: 'Locks picked',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44866',
        },
        {
          id: '182002',
          code: 'ELECTRONICS OVERCOME',
          active: false,
          label: 'Electronics overcome',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44866',
        },
        {
          id: '182004',
          code: 'OTHER',
          active: false,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44866',
        },
      ],
    },
    '45072': {
      id: '45072',
      active: false,
      code: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      label: 'Is the incident the subject of a police investigation?',
      multipleAnswers: false,
      answers: [
        {
          id: '182261',
          code: 'YES',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44166',
        },
        {
          id: '182260',
          code: 'NO',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44166',
        },
      ],
    },
  },
  prisonerRoles: [
    {
      prisonerRole: 'ACTIVE_INVOLVEMENT',
      onlyOneAllowed: false,
      active: false,
    },
    {
      prisonerRole: 'ASSISTED_STAFF',
      onlyOneAllowed: false,
      active: false,
    },
    {
      prisonerRole: 'IMPEDED_STAFF',
      onlyOneAllowed: false,
      active: false,
    },
    {
      prisonerRole: 'PERPETRATOR',
      onlyOneAllowed: false,
      active: false,
    },
    {
      prisonerRole: 'SUSPECTED_INVOLVED',
      onlyOneAllowed: false,
      active: false,
    },
  ],
} as const

export default OLD_KEY_LOCK_INCIDENT

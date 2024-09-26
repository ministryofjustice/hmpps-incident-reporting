// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-25T09:26:17.489Z

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
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44331',
        },
        {
          code: 'NO',
          active: false,
          label: 'NO',
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
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44972',
        },
        {
          code: 'NO',
          active: false,
          label: 'NO',
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
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44386',
        },
        {
          code: 'NO',
          active: false,
          label: 'NO',
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
      label: 'HAS A REPLICA BEEN FOUND',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44894',
        },
        {
          code: 'NO',
          active: false,
          label: 'NO',
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
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44414',
        },
        {
          code: 'NO',
          active: false,
          label: 'NO',
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
      label: 'WHAT TOOLS WERE USED',
      multipleAnswers: true,
      answers: [
        {
          code: 'HACKSAW BLADE',
          active: false,
          label: 'HACKSAW BLADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          code: 'OTHER BLADE',
          active: false,
          label: 'OTHER BLADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          code: 'WIRE CUTTERS',
          active: false,
          label: 'WIRE CUTTERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          code: 'BOLT CROPPERS',
          active: false,
          label: 'BOLT CROPPERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          code: 'DIGGING TOOL',
          active: false,
          label: 'DIGGING TOOL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          code: 'CROW BAR',
          active: false,
          label: 'CROW BAR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          code: 'IMPROVISED TOOL',
          active: false,
          label: 'IMPROVISED TOOL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          code: 'OTHER TOOL',
          active: false,
          label: 'OTHER TOOL',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          code: 'NOT KNOWN',
          active: false,
          label: 'NOT KNOWN',
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
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44678',
        },
        {
          code: 'NO',
          active: false,
          label: 'NO',
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
      label: 'DESCRIBE THE REMEDIAL ACTION TAKEN',
      multipleAnswers: false,
      answers: [
        {
          code: 'COMPLETE RELOCK',
          active: false,
          label: 'COMPLETE RELOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44921',
        },
        {
          code: 'PARTIAL RELOCK',
          active: false,
          label: 'PARTIAL RELOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44921',
        },
        {
          code: 'COMPLETE REPLACEMENT',
          active: false,
          label: 'COMPLETE REPLACEMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44921',
        },
        {
          code: 'PARTIAL REPLACEMENT',
          active: false,
          label: 'PARTIAL REPLACEMENT',
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
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45072',
        },
        {
          code: 'NO',
          active: false,
          label: 'NO',
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
      label: 'HAVE THE LOST ITEM(S) BEEN FOUND',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44894',
        },
        {
          code: 'NO',
          active: false,
          label: 'NO',
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
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44228',
        },
        {
          code: 'NO',
          active: false,
          label: 'NO',
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
      label: 'HAS ANY REMEDIAL ACTION BEEN TAKEN',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44449',
        },
        {
          code: 'NO',
          active: false,
          label: 'NO',
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
      label: 'WERE TOOLS USED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44407',
        },
        {
          code: 'NO',
          active: false,
          label: 'NO',
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
      label: 'WHAT ACTION WAS TAKEN TO FIND THESE ITEMS',
      multipleAnswers: false,
      answers: [
        {
          code: 'FULL CLOSE DOWN SEARCH',
          active: false,
          label: 'FULL CLOSE DOWN SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44866',
        },
        {
          code: 'PARTIAL SEARCH',
          active: false,
          label: 'PARTIAL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44866',
        },
        {
          code: 'OTHER',
          active: false,
          label: 'OTHER',
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
      label: 'ESTIMATED COST OF THIS ACTION',
      multipleAnswers: false,
      answers: [
        {
          code: 'ENTER AMOUNT IN POUND STERLING',
          active: false,
          label: 'ENTER AMOUNT IN POUND STERLING',
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
      label: 'WHAT WAS THE SOURCE OF THE TOOLS',
      multipleAnswers: true,
      answers: [
        {
          code: 'WORKS DEPARTMENT',
          active: false,
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'CONTRACTORS',
          active: false,
          label: 'CONTRACTORS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'EDUCATION',
          active: false,
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'HEALTH CARE CENTRE',
          active: false,
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'FARMS AND GARDENS',
          active: false,
          label: 'FARMS AND GARDENS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'GYMNASIUM/SPORTS FIELD',
          active: false,
          label: 'GYMNASIUM/SPORTS FIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'WORKSHOPS',
          active: false,
          label: 'WORKSHOPS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'KITCHEN',
          active: false,
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'HOBBIES',
          active: false,
          label: 'HOBBIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'CELL FURNISHINGS',
          active: false,
          label: 'CELL FURNISHINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'WING/HOUSEBLOCK FURNISHINGS',
          active: false,
          label: 'WING/HOUSEBLOCK FURNISHINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'SMUGGLED',
          active: false,
          label: 'SMUGGLED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'NOT KNOWN',
          active: false,
          label: 'NOT KNOWN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          code: 'OTHER',
          active: false,
          label: 'OTHER',
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
      label: 'DESCRIBE THE TYPE OF KEY OR LOCK COMPROMISE',
      multipleAnswers: true,
      answers: [
        {
          code: 'CLASS 1 PASS KEY',
          active: false,
          label: 'CLASS 1 PASS KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'CLASS 2 PASS KEY',
          active: false,
          label: 'CLASS 2 PASS KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'CELL KEY',
          active: false,
          label: 'CELL KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'CLASS 3 A1 SUITE KEY',
          active: false,
          label: 'CLASS 3 A1 SUITE KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'CLASS 3 ACCOUNTABLE KEY',
          active: false,
          label: 'CLASS 3 ACCOUNTABLE KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'HANDCUFF KEY',
          active: false,
          label: 'HANDCUFF KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'CLOSETING/ESCORT CHAIN KEY',
          active: false,
          label: 'CLOSETING/ESCORT CHAIN KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'CLASS 1 LOCK',
          active: false,
          label: 'CLASS 1 LOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'CLASS 2 LOCK',
          active: false,
          label: 'CLASS 2 LOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'CELL LOCK',
          active: false,
          label: 'CELL LOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'CLASS 3 A1 SUITE LOCK',
          active: false,
          label: 'CLASS 3 A1 SUITE LOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'CLASS 3 ACCOUNTABLE LOCK',
          active: false,
          label: 'CLASS 3 ACCOUNTABLE LOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'HANDCUFF',
          active: false,
          label: 'HANDCUFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'CLOSETING/ESCORT CHAIN',
          active: false,
          label: 'CLOSETING/ESCORT CHAIN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'ELECTRONIC LOCK SYSTEM',
          active: false,
          label: 'ELECTRONIC LOCK SYSTEM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          code: 'OTHER',
          active: false,
          label: 'OTHER',
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
      label: 'DESCRIBE THE NATURE OF THE COMPROMISE',
      multipleAnswers: true,
      answers: [
        {
          code: 'LOSS OF KEY(S)',
          active: false,
          label: 'LOSS OF KEY(S)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          code: 'LOSS OF HANDCUFFS',
          active: false,
          label: 'LOSS OF HANDCUFFS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          code: 'LOSS OF CLOSETING/ESCORT CHAIN',
          active: false,
          label: 'LOSS OF CLOSETING/ESCORT CHAIN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          code: 'COMPLETE LOCK REMOVED',
          active: false,
          label: 'COMPLETE LOCK REMOVED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          code: 'PART LOCK REMOVED',
          active: false,
          label: 'PART LOCK REMOVED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          code: 'REPLICA KEY USED',
          active: false,
          label: 'REPLICA KEY USED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44355',
        },
        {
          code: 'LOCKS PICKED',
          active: false,
          label: 'LOCKS PICKED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44866',
        },
        {
          code: 'ELECTRONICS OVERCOME',
          active: false,
          label: 'ELECTRONICS OVERCOME',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44866',
        },
        {
          code: 'OTHER',
          active: false,
          label: 'OTHER',
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
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44166',
        },
        {
          code: 'NO',
          active: false,
          label: 'NO',
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

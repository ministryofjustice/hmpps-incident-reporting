// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:57.915Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_KEY_LOCK_INCIDENT: IncidentTypeConfiguration = {
  incidentType: 'OLD_KEY_LOCK_INCIDENT',
  active: false,
  startingQuestionId: '44598',
  questions: {
    '44166': {
      id: '44166',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44331',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44331',
        },
      ],
    },
    '44228': {
      id: '44228',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44972',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44972',
        },
      ],
    },
    '44331': {
      id: '44331',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44386',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44386',
        },
      ],
    },
    '44355': {
      id: '44355',
      label: 'HAS A REPLICA BEEN FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44894',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44894',
        },
      ],
    },
    '44386': {
      id: '44386',
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44414',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44414',
        },
      ],
    },
    '44407': {
      id: '44407',
      label: 'WHAT TOOLS WERE USED',
      multipleAnswers: true,
      answers: [
        {
          label: 'HACKSAW BLADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          label: 'OTHER BLADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          label: 'WIRE CUTTERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          label: 'BOLT CROPPERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          label: 'DIGGING TOOL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          label: 'CROW BAR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          label: 'IMPROVISED TOOL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          label: 'OTHER TOOL',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44925',
        },
        {
          label: 'NOT KNOWN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44925',
        },
      ],
    },
    '44414': {
      id: '44414',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44678',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44678',
        },
      ],
    },
    '44449': {
      id: '44449',
      label: 'DESCRIBE THE REMEDIAL ACTION TAKEN',
      multipleAnswers: false,
      answers: [
        {
          label: 'COMPLETE RELOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44921',
        },
        {
          label: 'PARTIAL RELOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44921',
        },
        {
          label: 'COMPLETE REPLACEMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44921',
        },
        {
          label: 'PARTIAL REPLACEMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44921',
        },
      ],
    },
    '44598': {
      id: '44598',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45072',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44166',
        },
      ],
    },
    '44619': {
      id: '44619',
      label: 'HAVE THE LOST ITEM(S) BEEN FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44894',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44894',
        },
      ],
    },
    '44678': {
      id: '44678',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44228',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44228',
        },
      ],
    },
    '44775': {
      id: '44775',
      label: 'HAS ANY REMEDIAL ACTION BEEN TAKEN',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44449',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44866': {
      id: '44866',
      label: 'WERE TOOLS USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44407',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
      ],
    },
    '44894': {
      id: '44894',
      label: 'WHAT ACTION WAS TAKEN TO FIND THESE ITEMS',
      multipleAnswers: false,
      answers: [
        {
          label: 'FULL CLOSE DOWN SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44866',
        },
        {
          label: 'PARTIAL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44866',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44866',
        },
      ],
    },
    '44921': {
      id: '44921',
      label: 'ESTIMATED COST OF THIS ACTION',
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
    '44925': {
      id: '44925',
      label: 'WHAT WAS THE SOURCE OF THE TOOLS',
      multipleAnswers: true,
      answers: [
        {
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'CONTRACTORS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'FARMS AND GARDENS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'GYMNASIUM/SPORTS FIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'WORKSHOPS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'HOBBIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'CELL FURNISHINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'WING/HOUSEBLOCK FURNISHINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'SMUGGLED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'NOT KNOWN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44775',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44775',
        },
      ],
    },
    '44972': {
      id: '44972',
      label: 'DESCRIBE THE TYPE OF KEY OR LOCK COMPROMISE',
      multipleAnswers: true,
      answers: [
        {
          label: 'CLASS 1 PASS KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'CLASS 2 PASS KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'CELL KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'CLASS 3 A1 SUITE KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'CLASS 3 ACCOUNTABLE KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'HANDCUFF KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'CLOSETING/ESCORT CHAIN KEY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'CLASS 1 LOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'CLASS 2 LOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'CELL LOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'CLASS 3 A1 SUITE LOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'CLASS 3 ACCOUNTABLE LOCK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'HANDCUFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'CLOSETING/ESCORT CHAIN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'ELECTRONIC LOCK SYSTEM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45015',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45015',
        },
      ],
    },
    '45015': {
      id: '45015',
      label: 'DESCRIBE THE NATURE OF THE COMPROMISE',
      multipleAnswers: true,
      answers: [
        {
          label: 'LOSS OF KEY(S)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          label: 'LOSS OF HANDCUFFS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          label: 'LOSS OF CLOSETING/ESCORT CHAIN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          label: 'COMPLETE LOCK REMOVED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          label: 'PART LOCK REMOVED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44619',
        },
        {
          label: 'REPLICA KEY USED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44355',
        },
        {
          label: 'LOCKS PICKED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44866',
        },
        {
          label: 'ELECTRONICS OVERCOME',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44866',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44866',
        },
      ],
    },
    '45072': {
      id: '45072',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44166',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44166',
        },
      ],
    },
  },
} as const

export default OLD_KEY_LOCK_INCIDENT

// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-16T15:41:58.435Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const TOOL_LOSS: IncidentTypeConfiguration = {
  incidentType: 'TOOL_LOSS',
  active: true,
  startingQuestionId: '45142',
  questions: {
    '44195': {
      id: '44195',
      code: 'WHAT ACTION WAS TAKEN TO FIND THESE ITEMS',
      label: 'WHAT ACTION WAS TAKEN TO FIND THESE ITEMS',
      multipleAnswers: false,
      answers: [
        {
          code: 'FULL CLOSE DOWN SEARCH',
          label: 'FULL CLOSE DOWN SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44565',
        },
        {
          code: 'PARTIAL SEARCH',
          label: 'PARTIAL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44565',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44565',
        },
      ],
    },
    '44372': {
      id: '44372',
      code: 'IS THE MISSING ITEM THOUGHT TO BE',
      label: 'IS THE MISSING ITEM THOUGHT TO BE',
      multipleAnswers: false,
      answers: [
        {
          code: 'LOST',
          label: 'LOST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44445',
        },
        {
          code: 'MISLAID',
          label: 'MISLAID',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44445',
        },
        {
          code: 'STOLEN',
          label: 'STOLEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44445',
        },
      ],
    },
    '44412': {
      id: '44412',
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44593',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44593',
        },
      ],
    },
    '44445': {
      id: '44445',
      code: "IS THE MISSING ITEM THOUGHT TO BE IN A PRISONER'S POSSESSION",
      label: "IS THE MISSING ITEM THOUGHT TO BE IN A PRISONER'S POSSESSION",
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44195',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44195',
        },
      ],
    },
    '44477': {
      id: '44477',
      code: 'HOW ARE TOOLS/IMPLEMENTS STORED',
      label: 'HOW ARE TOOLS/IMPLEMENTS STORED',
      multipleAnswers: false,
      answers: [
        {
          code: 'SHADOW BOARD',
          label: 'SHADOW BOARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44509',
        },
        {
          code: 'SECURE CABINET',
          label: 'SECURE CABINET',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44509',
        },
        {
          code: 'SECURE ROOM',
          label: 'SECURE ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44509',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44509',
        },
      ],
    },
    '44489': {
      id: '44489',
      code: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44993',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44993',
        },
      ],
    },
    '44509': {
      id: '44509',
      code: 'IS THE F78A CHECKING SYSTEM IN OPERATION',
      label: 'IS THE F78A CHECKING SYSTEM IN OPERATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44565': {
      id: '44565',
      code: 'HAS THE ITEM BEEN FOUND',
      label: 'HAS THE ITEM BEEN FOUND',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45169',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
      ],
    },
    '44593': {
      id: '44593',
      code: 'WHAT TOOL OR IMPLEMENT IS MISSING',
      label: 'WHAT TOOL OR IMPLEMENT IS MISSING',
      multipleAnswers: true,
      answers: [
        {
          code: 'KNIFE',
          label: 'KNIFE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          code: 'HACKSAW',
          label: 'HACKSAW',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          code: 'OTHER SAW',
          label: 'OTHER SAW',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          code: 'SPADE',
          label: 'SPADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          code: 'AXE',
          label: 'AXE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          code: 'PICKAXE',
          label: 'PICKAXE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          code: 'PLIERS',
          label: 'PLIERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          code: 'SCREWDRIVER',
          label: 'SCREWDRIVER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          code: 'WIRE CUTTERS',
          label: 'WIRE CUTTERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          code: 'BOLT CROPPERS',
          label: 'BOLT CROPPERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          code: 'SCISSORS',
          label: 'SCISSORS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44950',
        },
      ],
    },
    '44603': {
      id: '44603',
      code: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44672',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44672',
        },
      ],
    },
    '44672': {
      id: '44672',
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44412',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44412',
        },
      ],
    },
    '44808': {
      id: '44808',
      code: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44489',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44489',
        },
      ],
    },
    '44950': {
      id: '44950',
      code: 'WHERE WAS THE TOOLS LOST FROM',
      label: 'WHERE WAS THE TOOLS LOST FROM',
      multipleAnswers: true,
      answers: [
        {
          code: 'WORKS DEPARTMENT',
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          code: 'CONTRACTORS',
          label: 'CONTRACTORS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          code: 'EDUCATION',
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          code: 'HEALTH CARE CENTRE',
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          code: 'FARMS AND GARDENS',
          label: 'FARMS AND GARDENS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          code: 'GYMNASIUM/SPORTSFIELD',
          label: 'GYMNASIUM/SPORTSFIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          code: 'WORKSHOP',
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          code: 'KITCHEN',
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          code: 'CELL HOBBIES',
          label: 'CELL HOBBIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          code: 'WING OFFICE',
          label: 'WING OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44372',
        },
      ],
    },
    '44993': {
      id: '44993',
      code: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44603',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44603',
        },
      ],
    },
    '45142': {
      id: '45142',
      code: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44808',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44489',
        },
      ],
    },
    '45169': {
      id: '45169',
      code: 'WHERE WAS THE ITEM FOUND',
      label: 'WHERE WAS THE ITEM FOUND',
      multipleAnswers: false,
      answers: [
        {
          code: 'PRISONERS POSSESSION',
          label: 'PRISONERS POSSESSION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
        {
          code: 'CONCEALED',
          label: 'CONCEALED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
        {
          code: 'DISCARDED',
          label: 'DISCARDED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
        {
          code: 'WHERE MISLAID/LOST',
          label: 'WHERE MISLAID/LOST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44477',
        },
      ],
    },
  },
} as const

export default TOOL_LOSS

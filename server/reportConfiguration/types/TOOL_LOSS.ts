// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:39.442Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const TOOL_LOSS: IncidentTypeConfiguration = {
  incidentType: 'TOOL_LOSS',
  active: true,
  startingQuestionId: '45142',
  questions: {
    '44195': {
      id: '44195',
      label: 'WHAT ACTION WAS TAKEN TO FIND THESE ITEMS',
      multipleAnswers: false,
      answers: [
        {
          label: 'FULL CLOSE DOWN SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44565',
        },
        {
          label: 'PARTIAL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44565',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44565',
        },
      ],
    },
    '44372': {
      id: '44372',
      label: 'IS THE MISSING ITEM THOUGHT TO BE',
      multipleAnswers: false,
      answers: [
        {
          label: 'LOST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44445',
        },
        {
          label: 'MISLAID',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44445',
        },
        {
          label: 'STOLEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44445',
        },
      ],
    },
    '44412': {
      id: '44412',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44593',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44593',
        },
      ],
    },
    '44445': {
      id: '44445',
      label: "IS THE MISSING ITEM THOUGHT TO BE IN A PRISONER'S POSSESSION",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44195',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44195',
        },
      ],
    },
    '44477': {
      id: '44477',
      label: 'HOW ARE TOOLS/IMPLEMENTS STORED',
      multipleAnswers: false,
      answers: [
        {
          label: 'SHADOW BOARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44509',
        },
        {
          label: 'SECURE CABINET',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44509',
        },
        {
          label: 'SECURE ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44509',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44509',
        },
      ],
    },
    '44489': {
      id: '44489',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44993',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44993',
        },
      ],
    },
    '44509': {
      id: '44509',
      label: 'IS THE F78A CHECKING SYSTEM IN OPERATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44565': {
      id: '44565',
      label: 'HAS THE ITEM BEEN FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45169',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
      ],
    },
    '44593': {
      id: '44593',
      label: 'WHAT TOOL OR IMPLEMENT IS MISSING',
      multipleAnswers: true,
      answers: [
        {
          label: 'KNIFE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          label: 'HACKSAW',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          label: 'OTHER SAW',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          label: 'SPADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          label: 'AXE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          label: 'PICKAXE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          label: 'PLIERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          label: 'SCREWDRIVER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          label: 'WIRE CUTTERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          label: 'BOLT CROPPERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          label: 'SCISSORS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44950',
        },
      ],
    },
    '44603': {
      id: '44603',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44672',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44672',
        },
      ],
    },
    '44672': {
      id: '44672',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44412',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44412',
        },
      ],
    },
    '44808': {
      id: '44808',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44489',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44489',
        },
      ],
    },
    '44950': {
      id: '44950',
      label: 'WHERE WAS THE TOOLS LOST FROM',
      multipleAnswers: true,
      answers: [
        {
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          label: 'CONTRACTORS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          label: 'FARMS AND GARDENS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          label: 'GYMNASIUM/SPORTSFIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          label: 'CELL HOBBIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          label: 'WING OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44372',
        },
      ],
    },
    '44993': {
      id: '44993',
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44603',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44603',
        },
      ],
    },
    '45142': {
      id: '45142',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44808',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44489',
        },
      ],
    },
    '45169': {
      id: '45169',
      label: 'WHERE WAS THE ITEM FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'PRISONERS POSSESSION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
        {
          label: 'CONCEALED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
        {
          label: 'DISCARDED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
        {
          label: 'WHERE MISLAID/LOST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
        {
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

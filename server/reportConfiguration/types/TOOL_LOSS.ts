// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-10-15T17:17:18.664Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const TOOL_LOSS: IncidentTypeConfiguration = {
  incidentType: 'TOOL_LOSS',
  active: true,
  startingQuestionId: '45142',
  questions: {
    '44195': {
      id: '44195',
      active: true,
      code: 'WHAT ACTION WAS TAKEN TO FIND THESE ITEMS',
      label: 'WHAT ACTION WAS TAKEN TO FIND THESE ITEMS',
      multipleAnswers: false,
      answers: [
        {
          id: '179154',
          code: 'FULL CLOSE DOWN SEARCH',
          active: true,
          label: 'FULL CLOSE DOWN SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44565',
        },
        {
          id: '179156',
          code: 'PARTIAL SEARCH',
          active: true,
          label: 'PARTIAL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44565',
        },
        {
          id: '179155',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44565',
        },
      ],
    },
    '44372': {
      id: '44372',
      active: true,
      code: 'IS THE MISSING ITEM THOUGHT TO BE',
      label: 'IS THE MISSING ITEM THOUGHT TO BE',
      multipleAnswers: false,
      answers: [
        {
          id: '179749',
          code: 'LOST',
          active: true,
          label: 'LOST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44445',
        },
        {
          id: '179750',
          code: 'MISLAID',
          active: true,
          label: 'MISLAID',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44445',
        },
        {
          id: '179751',
          code: 'STOLEN',
          active: true,
          label: 'STOLEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44445',
        },
      ],
    },
    '44412': {
      id: '44412',
      active: true,
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          id: '179883',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44593',
        },
        {
          id: '179882',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44593',
        },
      ],
    },
    '44445': {
      id: '44445',
      active: true,
      code: "IS THE MISSING ITEM THOUGHT TO BE IN A PRISONER'S POSSESSION",
      label: "IS THE MISSING ITEM THOUGHT TO BE IN A PRISONER'S POSSESSION",
      multipleAnswers: false,
      answers: [
        {
          id: '179974',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44195',
        },
        {
          id: '179973',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44195',
        },
      ],
    },
    '44477': {
      id: '44477',
      active: true,
      code: 'HOW ARE TOOLS/IMPLEMENTS STORED',
      label: 'HOW ARE TOOLS/IMPLEMENTS STORED',
      multipleAnswers: false,
      answers: [
        {
          id: '180133',
          code: 'SHADOW BOARD',
          active: true,
          label: 'SHADOW BOARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44509',
        },
        {
          id: '180131',
          code: 'SECURE CABINET',
          active: true,
          label: 'SECURE CABINET',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44509',
        },
        {
          id: '180132',
          code: 'SECURE ROOM',
          active: true,
          label: 'SECURE ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44509',
        },
        {
          id: '180130',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44509',
        },
      ],
    },
    '44489': {
      id: '44489',
      active: true,
      code: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          id: '180170',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44993',
        },
        {
          id: '180169',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44993',
        },
      ],
    },
    '44509': {
      id: '44509',
      active: true,
      code: 'IS THE F78A CHECKING SYSTEM IN OPERATION',
      label: 'IS THE F78A CHECKING SYSTEM IN OPERATION',
      multipleAnswers: false,
      answers: [
        {
          id: '180253',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '180252',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44565': {
      id: '44565',
      active: true,
      code: 'HAS THE ITEM BEEN FOUND',
      label: 'HAS THE ITEM BEEN FOUND',
      multipleAnswers: false,
      answers: [
        {
          id: '180473',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45169',
        },
        {
          id: '180474',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
      ],
    },
    '44593': {
      id: '44593',
      active: true,
      code: 'WHAT TOOL OR IMPLEMENT IS MISSING',
      label: 'WHAT TOOL OR IMPLEMENT IS MISSING',
      multipleAnswers: true,
      answers: [
        {
          id: '180563',
          code: 'KNIFE',
          active: true,
          label: 'KNIFE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          id: '180562',
          code: 'HACKSAW',
          active: true,
          label: 'HACKSAW',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          id: '180565',
          code: 'OTHER SAW',
          active: true,
          label: 'OTHER SAW',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          id: '180570',
          code: 'SPADE',
          active: true,
          label: 'SPADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          id: '180560',
          code: 'AXE',
          active: true,
          label: 'AXE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          id: '180566',
          code: 'PICKAXE',
          active: true,
          label: 'PICKAXE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          id: '180567',
          code: 'PLIERS',
          active: true,
          label: 'PLIERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          id: '180569',
          code: 'SCREWDRIVER',
          active: true,
          label: 'SCREWDRIVER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          id: '180571',
          code: 'WIRE CUTTERS',
          active: true,
          label: 'WIRE CUTTERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          id: '180561',
          code: 'BOLT CROPPERS',
          active: true,
          label: 'BOLT CROPPERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          id: '180568',
          code: 'SCISSORS',
          active: true,
          label: 'SCISSORS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44950',
        },
        {
          id: '180564',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44950',
        },
      ],
    },
    '44603': {
      id: '44603',
      active: true,
      code: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          id: '180609',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44672',
        },
        {
          id: '180608',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44672',
        },
      ],
    },
    '44672': {
      id: '44672',
      active: true,
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          id: '180830',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44412',
        },
        {
          id: '180829',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44412',
        },
      ],
    },
    '44808': {
      id: '44808',
      active: true,
      code: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          id: '181276',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44489',
        },
        {
          id: '181275',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44489',
        },
      ],
    },
    '44950': {
      id: '44950',
      active: true,
      code: 'WHERE WAS THE TOOLS LOST FROM',
      label: 'WHERE WAS THE TOOLS LOST FROM',
      multipleAnswers: true,
      answers: [
        {
          id: '181796',
          code: 'WORKS DEPARTMENT',
          active: true,
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          id: '181788',
          code: 'CONTRACTORS',
          active: true,
          label: 'CONTRACTORS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          id: '181789',
          code: 'EDUCATION',
          active: true,
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          id: '181792',
          code: 'HEALTH CARE CENTRE',
          active: true,
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          id: '181790',
          code: 'FARMS AND GARDENS',
          active: true,
          label: 'FARMS AND GARDENS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          id: '181791',
          code: 'GYMNASIUM/SPORTSFIELD',
          active: true,
          label: 'GYMNASIUM/SPORTSFIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          id: '181797',
          code: 'WORKSHOP',
          active: true,
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          id: '181793',
          code: 'KITCHEN',
          active: true,
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          id: '181787',
          code: 'CELL HOBBIES',
          active: true,
          label: 'CELL HOBBIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          id: '181795',
          code: 'WING OFFICE',
          active: true,
          label: 'WING OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44372',
        },
        {
          id: '181794',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44372',
        },
      ],
    },
    '44993': {
      id: '44993',
      active: true,
      code: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          id: '181941',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44603',
        },
        {
          id: '181940',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44603',
        },
      ],
    },
    '45142': {
      id: '45142',
      active: true,
      code: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          id: '182533',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44808',
        },
        {
          id: '182534',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44489',
        },
      ],
    },
    '45169': {
      id: '45169',
      active: true,
      code: 'WHERE WAS THE ITEM FOUND',
      label: 'WHERE WAS THE ITEM FOUND',
      multipleAnswers: false,
      answers: [
        {
          id: '182624',
          code: 'PRISONERS POSSESSION',
          active: true,
          label: 'PRISONERS POSSESSION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
        {
          id: '182621',
          code: 'CONCEALED',
          active: true,
          label: 'CONCEALED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
        {
          id: '182622',
          code: 'DISCARDED',
          active: true,
          label: 'DISCARDED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
        {
          id: '182625',
          code: 'WHERE MISLAID/LOST',
          active: true,
          label: 'WHERE MISLAID/LOST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44477',
        },
        {
          id: '182623',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44477',
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
  ],
} as const

export default TOOL_LOSS

// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-25T09:25:42.446Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_ASSAULT1: IncidentTypeConfiguration = {
  incidentType: 'OLD_ASSAULT1',
  active: false,
  startingQuestionId: '61179',
  questions: {
    '61179': {
      id: '61179',
      active: false,
      code: 'What was the main management outcome of this incident?',
      label: 'What was the main management outcome of this incident?',
      multipleAnswers: false,
      answers: [
        {
          code: 'No further action',
          active: false,
          label: 'No further action',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61180',
        },
        {
          code: 'IEP regression',
          active: false,
          label: 'IEP regression',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61180',
        },
        {
          code: 'Placed on report/adjudication referral',
          active: false,
          label: 'Placed on report/adjudication referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61180',
        },
        {
          code: 'Police referral',
          active: false,
          label: 'Police referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61180',
        },
      ],
    },
    '61180': {
      id: '61180',
      active: false,
      code: 'Is any member of staff facing disciplinary charges?',
      label: 'Is any member of staff facing disciplinary charges?',
      multipleAnswers: false,
      answers: [
        {
          code: 'no',
          active: false,
          label: 'no',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61181': {
      id: '61181',
      active: false,
      code: 'Is there any media interest in this incident?',
      label: 'Is there any media interest in this incident?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61182': {
      id: '61182',
      active: false,
      code: 'Has the prison service press office been informed?',
      label: 'Has the prison service press office been informed?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61183': {
      id: '61183',
      active: false,
      code: 'Is the location of the incident known?',
      label: 'Is the location of the incident known?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: true,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61184': {
      id: '61184',
      active: false,
      code: 'What was the location of the incident?',
      label: 'What was the location of the incident?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61185': {
      id: '61185',
      active: false,
      code: 'Was this a sexual assault?',
      label: 'Was this a sexual assault?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61186': {
      id: '61186',
      active: false,
      code: 'Did the assault occur during a fight?',
      label: 'Did the assault occur during a fight?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61187': {
      id: '61187',
      active: false,
      code: 'What type of assault was it?',
      label: 'What type of assault was it?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61188': {
      id: '61188',
      active: false,
      code: 'Were any staff assaulted?',
      label: 'Were any staff assaulted?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61189': {
      id: '61189',
      active: false,
      code: 'Describe the type of staff',
      label: 'Describe the type of staff',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61190': {
      id: '61190',
      active: false,
      code: 'Was spitting used in this incident?',
      label: 'Was spitting used in this incident?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61191': {
      id: '61191',
      active: false,
      code: 'Is the assailant known to have an infectious disease that can be transmitted in saliva?',
      label: 'Is the assailant known to have an infectious disease that can be transmitted in saliva?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61192': {
      id: '61192',
      active: false,
      code: 'Did the saliva hit the body or clothing of the victim(s)?',
      label: 'Did the saliva hit the body or clothing of the victim(s)?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61193': {
      id: '61193',
      active: false,
      code: 'Where did it hit?',
      label: 'Where did it hit?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61194': {
      id: '61194',
      active: false,
      code: 'Were any weapons used?',
      label: 'Were any weapons used?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61195': {
      id: '61195',
      active: false,
      code: 'Describe the weapons used?',
      label: 'Describe the weapons used?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61196': {
      id: '61196',
      active: false,
      code: 'Were any injuries received during this incident?',
      label: 'Were any injuries received during this incident?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61197': {
      id: '61197',
      active: false,
      code: 'Enter description of person(s) injured',
      label: 'Enter description of person(s) injured',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61198': {
      id: '61198',
      active: false,
      code: 'Was a serious injury sustained?',
      label: 'Was a serious injury sustained?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61200': {
      id: '61200',
      active: false,
      code: 'Which serious injuries were sustained?',
      label: 'Which serious injuries were sustained?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61201': {
      id: '61201',
      active: false,
      code: 'Was a minor injury sustained?',
      label: 'Was a minor injury sustained?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61202': {
      id: '61202',
      active: false,
      code: 'Which minor injuries were sustained?',
      label: 'Which minor injuries were sustained?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61203': {
      id: '61203',
      active: false,
      code: 'Did injuries result in attendance to outside hospital?',
      label: 'Did injuries result in attendance to outside hospital?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61204': {
      id: '61204',
      active: false,
      code: 'Type of hospital admission',
      label: 'Type of hospital admission',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61205': {
      id: '61205',
      active: false,
      code: 'Who was admitted to outside hospital?',
      label: 'Who was admitted to outside hospital?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61206': {
      id: '61206',
      active: false,
      code: 'Was medical treatment for concussion or internal injuries required?',
      label: 'Was medical treatment for concussion or internal injuries required?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61207': {
      id: '61207',
      active: false,
      code: 'Are there any staff now off duty as a result of this incident?',
      label: 'Are there any staff now off duty as a result of this incident?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61208': {
      id: '61208',
      active: false,
      code: 'Are any staff on sick leave as a result of this incident?',
      label: 'Are any staff on sick leave as a result of this incident?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61209': {
      id: '61209',
      active: false,
      code: 'Did the assault occur in public view?',
      label: 'Did the assault occur in public view?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61210': {
      id: '61210',
      active: false,
      code: 'Is there any audio or visual footage of the assault?',
      label: 'Is there any audio or visual footage of the assault?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61211': {
      id: '61211',
      active: false,
      code: 'What is the source of the footage?',
      label: 'What is the source of the footage?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61212': {
      id: '61212',
      active: false,
      code: 'Was there an apparent reason for the assault?',
      label: 'Was there an apparent reason for the assault?',
      multipleAnswers: false,
      answers: [
        {
          code: 'n',
          active: false,
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
  prisonerRoles: [],
} as const

export default OLD_ASSAULT1

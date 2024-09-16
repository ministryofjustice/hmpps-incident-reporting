// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:34.575Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_ASSAULT2: IncidentTypeConfiguration = {
  incidentType: 'OLD_ASSAULT2',
  active: false,
  startingQuestionId: '61213',
  questions: {
    '61213': {
      id: '61213',
      label: 'What was the main management outcome of this incident?',
      multipleAnswers: false,
      answers: [
        {
          label: 'No further action',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61214',
        },
        {
          label: 'IEP regression',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61214',
        },
        {
          label: 'Placed on report/adjudication referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61214',
        },
        {
          label: 'Police referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61214',
        },
      ],
    },
    '61214': {
      id: '61214',
      label: 'Is any member of staff facing disciplinary charges?',
      multipleAnswers: false,
      answers: [
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61215',
        },
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61215',
        },
      ],
    },
    '61215': {
      id: '61215',
      label: 'Is there any media interest in this incident?',
      multipleAnswers: false,
      answers: [
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61216',
        },
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61216',
        },
      ],
    },
    '61216': {
      id: '61216',
      label: 'Has the prison service press office been informed?',
      multipleAnswers: false,
      answers: [
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61217',
        },
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61217',
        },
      ],
    },
    '61217': {
      id: '61217',
      label: 'Is the location of the incident known?',
      multipleAnswers: false,
      answers: [
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61218',
        },
      ],
    },
    '61218': {
      id: '61218',
      label: 'What was the location of the incident?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Administration',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Association area',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Cell',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Chapel',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Crown Court',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Dining room',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Dormitory',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Education',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Elsewhere',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Exercise yard',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'External roof',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Funeral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Gate',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Gym',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Health care centre',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Hospital outside (patient)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Hospital outside (visiting)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Induction/First night centre',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Kitchen',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Magistrates court',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Mail room',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Office',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Outside working party',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Reception',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Recess',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Segregation unit',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Showers/changing room',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Special unit',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Sports field',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Vehicle',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Visits',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Vulnerable prisoners unit (VPU)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Weddings',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Wing',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Within perimeter',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Works department',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          label: 'Workshop',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
      ],
    },
    '61219': {
      id: '61219',
      label: 'Was this a sexual assault?',
      multipleAnswers: false,
      answers: [
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61220',
        },
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61220',
        },
      ],
    },
    '61220': {
      id: '61220',
      label: 'Did the assault occur during a fight?',
      multipleAnswers: false,
      answers: [
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61221',
        },
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61221',
        },
      ],
    },
    '61221': {
      id: '61221',
      label: 'What type of assault was it?',
      multipleAnswers: false,
      answers: [
        {
          label: 'Prisoner on prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61222',
        },
        {
          label: 'Prisoner on staff',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61223',
        },
        {
          label: 'Prisoner on other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61222',
        },
        {
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61222',
        },
      ],
    },
    '61222': {
      id: '61222',
      label: 'Were any staff assaulted?',
      multipleAnswers: false,
      answers: [
        {
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61224',
        },
        {
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61223',
        },
      ],
    },
    '61223': {
      id: '61223',
      label: 'Describe the type of staff',
      multipleAnswers: true,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61224': {
      id: '61224',
      label: 'Was spitting used in this incident?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61225': {
      id: '61225',
      label: 'Is the assailant known to have an infectious disease that can be transmitted in saliva?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61226': {
      id: '61226',
      label: 'Did the saliva hit the body or clothing of the victim(s)?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61227': {
      id: '61227',
      label: 'Where did it hit?',
      multipleAnswers: true,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61228': {
      id: '61228',
      label: 'Were any weapons used?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61229': {
      id: '61229',
      label: 'Describe the weapons used?',
      multipleAnswers: true,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61230': {
      id: '61230',
      label: 'Were any injuries received during this incident?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61231': {
      id: '61231',
      label: 'Enter description of person(s) injured',
      multipleAnswers: true,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61232': {
      id: '61232',
      label: 'Enter description of person(s) injured',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61233': {
      id: '61233',
      label: 'Which serious injuries were sustained?',
      multipleAnswers: true,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61234': {
      id: '61234',
      label: 'Was a minor injury sustained?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61235': {
      id: '61235',
      label: 'Which minor injuries were sustained?',
      multipleAnswers: true,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61236': {
      id: '61236',
      label: 'Did injuries result in attendance to outside hospital?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61237': {
      id: '61237',
      label: 'Type of hospital admission',
      multipleAnswers: true,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61238': {
      id: '61238',
      label: 'Who was admitted to outside hospital?',
      multipleAnswers: true,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61239': {
      id: '61239',
      label: 'Was medical treatment for concussion or internal injuries required?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61240': {
      id: '61240',
      label: 'Are there any staff now off duty as a result of this incident?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61241': {
      id: '61241',
      label: 'Are any staff on sick leave as a result of this incident?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61242': {
      id: '61242',
      label: 'Did the assault occur in public view?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61243': {
      id: '61243',
      label: 'Is there any audio or visual footage of the assault?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61244': {
      id: '61244',
      label: 'What is the source of the footage?',
      multipleAnswers: true,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61245': {
      id: '61245',
      label: 'Was there an apparent reason for the assault?',
      multipleAnswers: false,
      answers: [
        {
          label: 'n',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
} as const

export default OLD_ASSAULT2

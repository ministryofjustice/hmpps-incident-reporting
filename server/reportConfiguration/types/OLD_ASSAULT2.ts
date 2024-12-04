// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-12-03T16:21:08.997Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_ASSAULT2: IncidentTypeConfiguration = {
  incidentType: 'OLD_ASSAULT2',
  active: false,
  startingQuestionId: '61213',
  questions: {
    '61213': {
      id: '61213',
      active: false,
      code: 'What was the main management outcome of this incident?',
      label: 'What was the main management outcome of this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '212725',
          code: 'No further action',
          active: false,
          label: 'No further action',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61214',
        },
        {
          id: '212726',
          code: 'IEP regression',
          active: false,
          label: 'IEP regression',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61214',
        },
        {
          id: '212727',
          code: 'Placed on report/adjudication referral',
          active: false,
          label: 'Placed on report/adjudication referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61214',
        },
        {
          id: '212728',
          code: 'Police referral',
          active: false,
          label: 'Police referral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61214',
        },
      ],
    },
    '61214': {
      id: '61214',
      active: false,
      code: 'Is any member of staff facing disciplinary charges?',
      label: 'Is any member of staff facing disciplinary charges?',
      multipleAnswers: false,
      answers: [
        {
          id: '212729',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61215',
        },
        {
          id: '212730',
          code: 'Yes',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61215',
        },
      ],
    },
    '61215': {
      id: '61215',
      active: false,
      code: 'Is there any media interest in this incident?',
      label: 'Is there any media interest in this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '212731',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61216',
        },
        {
          id: '212732',
          code: 'Yes',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61216',
        },
      ],
    },
    '61216': {
      id: '61216',
      active: false,
      code: 'Has the prison service press office been informed?',
      label: 'Has the prison service press office been informed?',
      multipleAnswers: false,
      answers: [
        {
          id: '212733',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61217',
        },
        {
          id: '212734',
          code: 'Yes',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61217',
        },
      ],
    },
    '61217': {
      id: '61217',
      active: false,
      code: 'Is the location of the incident known?',
      label: 'Is the location of the incident known?',
      multipleAnswers: false,
      answers: [
        {
          id: '212735',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212736',
          code: 'Yes',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61218',
        },
      ],
    },
    '61218': {
      id: '61218',
      active: false,
      code: 'What was the location of the incident?',
      label: 'What was the location of the incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '212737',
          code: 'Administration',
          active: false,
          label: 'Administration',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212738',
          code: 'Association area',
          active: false,
          label: 'Association area',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212739',
          code: 'Cell',
          active: false,
          label: 'Cell',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212740',
          code: 'Chapel',
          active: false,
          label: 'Chapel',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212741',
          code: 'Crown Court',
          active: false,
          label: 'Crown court',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212742',
          code: 'Dining room',
          active: false,
          label: 'Dining room',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212743',
          code: 'Dormitory',
          active: false,
          label: 'Dormitory',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212744',
          code: 'Education',
          active: false,
          label: 'Education',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212745',
          code: 'Elsewhere',
          active: false,
          label: 'Elsewhere',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212746',
          code: 'Exercise yard',
          active: false,
          label: 'Exercise yard',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212747',
          code: 'External roof',
          active: false,
          label: 'External roof',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212748',
          code: 'Funeral',
          active: false,
          label: 'Funeral',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212749',
          code: 'Gate',
          active: false,
          label: 'Gate',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212750',
          code: 'Gym',
          active: false,
          label: 'Gym',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212751',
          code: 'Health care centre',
          active: false,
          label: 'Health care centre',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212752',
          code: 'Hospital outside (patient)',
          active: false,
          label: 'Hospital outside (patient)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212753',
          code: 'Hospital outside (visiting)',
          active: false,
          label: 'Hospital outside (visiting)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212754',
          code: 'Induction/First night centre',
          active: false,
          label: 'Induction/first night centre',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212755',
          code: 'Kitchen',
          active: false,
          label: 'Kitchen',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212756',
          code: 'Magistrates court',
          active: false,
          label: 'Magistrates court',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212757',
          code: 'Mail room',
          active: false,
          label: 'Mail room',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212758',
          code: 'Office',
          active: false,
          label: 'Office',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212759',
          code: 'Outside working party',
          active: false,
          label: 'Outside working party',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212760',
          code: 'Reception',
          active: false,
          label: 'Reception',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212761',
          code: 'Recess',
          active: false,
          label: 'Recess',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212762',
          code: 'Segregation unit',
          active: false,
          label: 'Segregation unit',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212763',
          code: 'Showers/changing room',
          active: false,
          label: 'Showers/changing room',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212764',
          code: 'Special unit',
          active: false,
          label: 'Special unit',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212765',
          code: 'Sports field',
          active: false,
          label: 'Sports field',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212766',
          code: 'Vehicle',
          active: false,
          label: 'Vehicle',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212767',
          code: 'Visits',
          active: false,
          label: 'Visits',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212768',
          code: 'Vulnerable prisoners unit (VPU)',
          active: false,
          label: 'Vulnerable prisoners unit (vpu)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212769',
          code: 'Weddings',
          active: false,
          label: 'Weddings',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212770',
          code: 'Wing',
          active: false,
          label: 'Wing',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212771',
          code: 'Within perimeter',
          active: false,
          label: 'Within perimeter',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212772',
          code: 'Works department',
          active: false,
          label: 'Works department',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61219',
        },
        {
          id: '212773',
          code: 'Workshop',
          active: false,
          label: 'Workshop',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61219',
        },
      ],
    },
    '61219': {
      id: '61219',
      active: false,
      code: 'Was this a sexual assault?',
      label: 'Was this a sexual assault?',
      multipleAnswers: false,
      answers: [
        {
          id: '212774',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61220',
        },
        {
          id: '212775',
          code: 'Yes',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61220',
        },
      ],
    },
    '61220': {
      id: '61220',
      active: false,
      code: 'Did the assault occur during a fight?',
      label: 'Did the assault occur during a fight?',
      multipleAnswers: false,
      answers: [
        {
          id: '212776',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61221',
        },
        {
          id: '212777',
          code: 'Yes',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61221',
        },
      ],
    },
    '61221': {
      id: '61221',
      active: false,
      code: 'What type of assault was it?',
      label: 'What type of assault was it?',
      multipleAnswers: false,
      answers: [
        {
          id: '212778',
          code: 'Prisoner on prisoner',
          active: false,
          label: 'Prisoner on prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61222',
        },
        {
          id: '212779',
          code: 'Prisoner on staff',
          active: false,
          label: 'Prisoner on staff',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61223',
        },
        {
          id: '212780',
          code: 'Prisoner on other',
          active: false,
          label: 'Prisoner on other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61222',
        },
        {
          id: '212781',
          code: 'Other',
          active: false,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '61222',
        },
      ],
    },
    '61222': {
      id: '61222',
      active: false,
      code: 'Were any staff assaulted?',
      label: 'Were any staff assaulted?',
      multipleAnswers: false,
      answers: [
        {
          id: '212782',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61224',
        },
        {
          id: '212783',
          code: 'Yes',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '61223',
        },
      ],
    },
    '61223': {
      id: '61223',
      active: false,
      code: 'Describe the type of staff',
      label: 'Describe the type of staff',
      multipleAnswers: true,
      answers: [
        {
          id: '213039',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61224': {
      id: '61224',
      active: false,
      code: 'Was spitting used in this incident?',
      label: 'Was spitting used in this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '213040',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61225': {
      id: '61225',
      active: false,
      code: 'Is the assailant known to have an infectious disease that can be transmitted in saliva?',
      label: 'Is the assailant known to have an infectious disease that can be transmitted in saliva?',
      multipleAnswers: false,
      answers: [
        {
          id: '213041',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61226': {
      id: '61226',
      active: false,
      code: 'Did the saliva hit the body or clothing of the victim(s)?',
      label: 'Did the saliva hit the body or clothing of the victim(s)?',
      multipleAnswers: false,
      answers: [
        {
          id: '213042',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61227': {
      id: '61227',
      active: false,
      code: 'Where did it hit?',
      label: 'Where did it hit?',
      multipleAnswers: true,
      answers: [
        {
          id: '213043',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61228': {
      id: '61228',
      active: false,
      code: 'Were any weapons used?',
      label: 'Were any weapons used?',
      multipleAnswers: false,
      answers: [
        {
          id: '213044',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61229': {
      id: '61229',
      active: false,
      code: 'Describe the weapons used?',
      label: 'Describe the weapons used?',
      multipleAnswers: true,
      answers: [
        {
          id: '213045',
          code: 'n',
          active: true,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61230': {
      id: '61230',
      active: false,
      code: 'Were any injuries received during this incident?',
      label: 'Were any injuries received during this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '213046',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61231': {
      id: '61231',
      active: false,
      code: 'Enter description of person(s) injured',
      label: 'Enter description of person(s) injured',
      multipleAnswers: true,
      answers: [
        {
          id: '213047',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61232': {
      id: '61232',
      active: false,
      code: 'Enter description of person(s) injured',
      label: 'Enter description of person(s) injured',
      multipleAnswers: false,
      answers: [
        {
          id: '213048',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61233': {
      id: '61233',
      active: false,
      code: 'Which serious injuries were sustained?',
      label: 'Which serious injuries were sustained?',
      multipleAnswers: true,
      answers: [
        {
          id: '213049',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61234': {
      id: '61234',
      active: false,
      code: 'Was a minor injury sustained?',
      label: 'Was a minor injury sustained?',
      multipleAnswers: false,
      answers: [
        {
          id: '213050',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61235': {
      id: '61235',
      active: false,
      code: 'Which minor injuries were sustained?',
      label: 'Which minor injuries were sustained?',
      multipleAnswers: true,
      answers: [
        {
          id: '213051',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61236': {
      id: '61236',
      active: false,
      code: 'Did injuries result in attendance to outside hospital?',
      label: 'Did injuries result in attendance to outside hospital?',
      multipleAnswers: false,
      answers: [
        {
          id: '213052',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61237': {
      id: '61237',
      active: false,
      code: 'Type of hospital admission',
      label: 'Type of hospital admission',
      multipleAnswers: true,
      answers: [
        {
          id: '213053',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61238': {
      id: '61238',
      active: false,
      code: 'Who was admitted to outside hospital?',
      label: 'Who was admitted to outside hospital?',
      multipleAnswers: true,
      answers: [
        {
          id: '213054',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61239': {
      id: '61239',
      active: false,
      code: 'Was medical treatment for concussion or internal injuries required?',
      label: 'Was medical treatment for concussion or internal injuries required?',
      multipleAnswers: false,
      answers: [
        {
          id: '213055',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61240': {
      id: '61240',
      active: false,
      code: 'Are there any staff now off duty as a result of this incident?',
      label: 'Are there any staff now off duty as a result of this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '213056',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61241': {
      id: '61241',
      active: false,
      code: 'Are any staff on sick leave as a result of this incident?',
      label: 'Are any staff on sick leave as a result of this incident?',
      multipleAnswers: false,
      answers: [
        {
          id: '213057',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61242': {
      id: '61242',
      active: false,
      code: 'Did the assault occur in public view?',
      label: 'Did the assault occur in public view?',
      multipleAnswers: false,
      answers: [
        {
          id: '213058',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61243': {
      id: '61243',
      active: false,
      code: 'Is there any audio or visual footage of the assault?',
      label: 'Is there any audio or visual footage of the assault?',
      multipleAnswers: false,
      answers: [
        {
          id: '213059',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61244': {
      id: '61244',
      active: false,
      code: 'What is the source of the footage?',
      label: 'What is the source of the footage?',
      multipleAnswers: true,
      answers: [
        {
          id: '213060',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '61245': {
      id: '61245',
      active: false,
      code: 'Was there an apparent reason for the assault?',
      label: 'Was there an apparent reason for the assault?',
      multipleAnswers: false,
      answers: [
        {
          id: '213061',
          code: 'n',
          active: false,
          label: 'N',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
  prisonerRoles: [],
} as const

export default OLD_ASSAULT2

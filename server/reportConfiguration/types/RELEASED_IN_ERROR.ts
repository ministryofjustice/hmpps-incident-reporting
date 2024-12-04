// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-12-03T16:21:47.504Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const RELEASED_IN_ERROR: IncidentTypeConfiguration = {
  incidentType: 'RELEASED_IN_ERROR',
  active: true,
  startingQuestionId: '45179',
  questions: {
    '45179': {
      id: '45179',
      active: true,
      code: 'How was this person released?',
      label: 'How was this person released?',
      multipleAnswers: true,
      answers: [
        {
          id: '182684',
          code: 'Bail',
          active: false,
          label: 'Bail',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182685',
          code: 'Final discharge/end of sentence',
          active: false,
          label: 'Final discharge/end of sentence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182686',
          code: 'Police production',
          active: false,
          label: 'Police production',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182687',
          code: 'Court production/PEMS',
          active: false,
          label: 'Court production/pems',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182688',
          code: 'Escort - HMPS',
          active: false,
          label: 'Escort - HMPS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182689',
          code: 'Other: Please explain',
          active: false,
          label: 'Other: please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183020',
          code: 'Bail',
          active: true,
          label: 'Bail',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45180',
        },
        {
          id: '183021',
          code: 'Final discharge/end of sentence',
          active: true,
          label: 'Final discharge/end of sentence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45180',
        },
        {
          id: '183022',
          code: 'Police production',
          active: true,
          label: 'Police production',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45180',
        },
        {
          id: '183023',
          code: 'Court production/PEMS',
          active: false,
          label: 'Court production/pems',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45180',
        },
        {
          id: '183024',
          code: 'Escort – HMPS',
          active: true,
          label: 'Escort – HMPS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45180',
        },
        {
          id: '183025',
          code: 'Other : Please explain',
          active: true,
          label: 'Other : please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45180',
        },
        {
          id: '184685',
          code: 'Court production/PEMS',
          active: true,
          label: 'Court production/pems',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45180',
        },
      ],
    },
    '45180': {
      id: '45180',
      active: true,
      code: 'Where did the release occur from?',
      label: 'Where did the release occur from?',
      multipleAnswers: true,
      answers: [
        {
          id: '182690',
          code: 'Establishment: Enter name',
          active: false,
          label: 'Establishment: enter name',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182691',
          code: 'Court: Enter name',
          active: false,
          label: 'Court: enter name',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182692',
          code: 'Other: Please enter details',
          active: false,
          label: 'Other: please enter details',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183026',
          code: 'Establishment : Enter name',
          active: true,
          label: 'Establishment : enter name',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45181',
        },
        {
          id: '183027',
          code: 'Court : Enter name',
          active: true,
          label: 'Court : enter name',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45181',
        },
        {
          id: '183028',
          code: 'Other : Please enter details',
          active: true,
          label: 'Other : please enter details',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45181',
        },
      ],
    },
    '45181': {
      id: '45181',
      active: true,
      code: 'What was the nature of the Incident?',
      label: 'What was the nature of the incident?',
      multipleAnswers: true,
      answers: [
        {
          id: '182693',
          code: 'Wrong person released',
          active: false,
          label: 'Wrong person released',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182694',
          code: 'Sentence miscalculated',
          active: false,
          label: 'Sentence miscalculated',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182695',
          code: 'ADA not included in calculations',
          active: false,
          label: 'Ada not included in calculations',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182696',
          code: 'Immigration warrant not applied/misfiled/missing',
          active: false,
          label: 'Immigration warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182697',
          code: 'Remand warrant not applied/misfiled/missing',
          active: false,
          label: 'Remand warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182698',
          code: 'Imprisonment warrant not applied/misfiled/missing',
          active: false,
          label: 'Imprisonment warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182699',
          code: 'Civil/non payment of fines warrant not applied/misfiled/missing',
          active: false,
          label: 'Civil/non payment of fines warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182700',
          code: 'Bail conditions not fully met',
          active: false,
          label: 'Bail conditions not fully met',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182701',
          code: 'Release criteria not met',
          active: false,
          label: 'Release criteria not met',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182702',
          code: 'Recall procedures not applied',
          active: false,
          label: 'Recall procedures not applied',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182703',
          code: 'Other: Please explain',
          active: false,
          label: 'Other: please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183029',
          code: 'Wrong person released',
          active: true,
          label: 'Wrong person released',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          id: '183030',
          code: 'Sentence Miscalculated',
          active: true,
          label: 'Sentence miscalculated',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          id: '183031',
          code: 'ADA not included on calculations',
          active: true,
          label: 'Ada not included on calculations',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          id: '183032',
          code: 'Immigration warrant not applied/misfiled/missing',
          active: true,
          label: 'Immigration warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          id: '183033',
          code: 'Remand warrant not applied/misfiled/missing',
          active: true,
          label: 'Remand warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          id: '183034',
          code: 'Imprisonment warrant not applied/misfiled/missing',
          active: true,
          label: 'Imprisonment warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          id: '183035',
          code: 'Civil/non payment of fines warrant not applied/misfiled/missing',
          active: true,
          label: 'Civil/non payment of fines warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          id: '183036',
          code: 'Bail conditions not fully met',
          active: true,
          label: 'Bail conditions not fully met',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          id: '183037',
          code: 'Release criteria not met',
          active: true,
          label: 'Release criteria not met',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          id: '183038',
          code: 'Recall procedures not applied',
          active: true,
          label: 'Recall procedures not applied',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          id: '183039',
          code: 'Other : Please explain',
          active: true,
          label: 'Other : please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45182',
        },
      ],
    },
    '45182': {
      id: '45182',
      active: true,
      code: 'What action is being taken to return the person to custody by the Establishment?',
      label: 'What action is being taken to return the person to custody by the establishment?',
      multipleAnswers: true,
      answers: [
        {
          id: '182704',
          code: 'Recall procedures',
          active: false,
          label: 'Recall procedures',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182705',
          code: 'Home Probation Officer',
          active: false,
          label: 'Home probation officer',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182706',
          code: 'Prisoner contacted',
          active: false,
          label: 'Prisoner contacted',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182707',
          code: 'Court contacted',
          active: false,
          label: 'Court contacted',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182708',
          code: 'Police contacted',
          active: false,
          label: 'Police contacted',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182709',
          code: 'Other: Please explain',
          active: false,
          label: 'Other: please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182710',
          code: 'None - explain why none of the above procedures have been actioned',
          active: false,
          label: 'None - explain why none of the above procedures have been actioned',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183040',
          code: 'Recall procedures',
          active: true,
          label: 'Recall procedures',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45183',
        },
        {
          id: '183041',
          code: 'Home Probation Officer',
          active: true,
          label: 'Home probation officer',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45183',
        },
        {
          id: '183042',
          code: 'Prisoner contacted',
          active: true,
          label: 'Prisoner contacted',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45183',
        },
        {
          id: '183043',
          code: 'Court contacted',
          active: true,
          label: 'Court contacted',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45183',
        },
        {
          id: '183044',
          code: 'Police contacted',
          active: true,
          label: 'Police contacted',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45183',
        },
        {
          id: '183045',
          code: 'Other : Please explain',
          active: true,
          label: 'Other : please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45183',
        },
        {
          id: '183046',
          code: 'None - explain why none of the above procedures have been actioned',
          active: true,
          label: 'None - explain why none of the above procedures have been actioned',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45183',
        },
      ],
    },
    '45183': {
      id: '45183',
      active: true,
      code: 'How was the error identified?',
      label: 'How was the error identified?',
      multipleAnswers: true,
      answers: [
        {
          id: '182711',
          code: 'Contact from PEMS',
          active: false,
          label: 'Contact from pems',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182712',
          code: 'Contact from Courts',
          active: false,
          label: 'Contact from courts',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182713',
          code: 'Contact from UKBA',
          active: false,
          label: 'Contact from ukba',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182714',
          code: 'Contact from Police',
          active: false,
          label: 'Contact from police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182715',
          code: 'Post release check by Establishment',
          active: false,
          label: 'Post release check by establishment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182716',
          code: 'Contact from other agency: Please enter details',
          active: false,
          label: 'Contact from other agency: please enter details',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182717',
          code: 'Sentence calculations',
          active: false,
          label: 'Sentence calculations',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182718',
          code: 'Other: Please explain',
          active: false,
          label: 'Other: please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183047',
          code: 'Contact from PEMS',
          active: false,
          label: 'Contact from pems',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          id: '183048',
          code: 'Contact from courts',
          active: true,
          label: 'Contact from courts',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          id: '183049',
          code: 'Contact from UKBA',
          active: true,
          label: 'Contact from ukba',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          id: '183050',
          code: 'Contact from police',
          active: true,
          label: 'Contact from police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          id: '183051',
          code: 'Post release check by Establishment',
          active: true,
          label: 'Post release check by establishment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          id: '183052',
          code: 'Contact from other agency : Please enter details',
          active: true,
          label: 'Contact from other agency : please enter details',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          id: '183053',
          code: 'Sentence calculations (new receptions)',
          active: true,
          label: 'Sentence calculations (new receptions)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          id: '183054',
          code: 'Other: Please explain',
          active: true,
          label: 'Other: please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          id: '184686',
          code: 'Contact from PEMS',
          active: true,
          label: 'Contact from pems',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
      ],
    },
    '45184': {
      id: '45184',
      active: true,
      code: 'What date was the error identified?',
      label: 'What date was the error identified?',
      multipleAnswers: false,
      answers: [
        {
          id: '182719',
          code: 'Date:',
          active: false,
          label: 'Date:',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
          id: '183055',
          code: 'Date:',
          active: true,
          label: 'Date:',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45185',
        },
      ],
    },
    '45185': {
      id: '45185',
      active: true,
      code: 'What was the category of the person?',
      label: 'What was the category of the person?',
      multipleAnswers: false,
      answers: [
        {
          id: '182720',
          code: 'Enter details:',
          active: false,
          label: 'Enter details:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183056',
          code: 'Enter details:',
          active: true,
          label: 'Enter details:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45186',
        },
      ],
    },
    '45186': {
      id: '45186',
      active: true,
      code: 'What was the prisoner status?',
      label: 'What was the prisoner status?',
      multipleAnswers: false,
      answers: [
        {
          id: '182721',
          code: 'Sentenced prisoner',
          active: false,
          label: 'Sentenced prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182722',
          code: 'Remand prisoner',
          active: false,
          label: 'Remand prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182723',
          code: 'Immigration detainee',
          active: false,
          label: 'Immigration detainee',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182724',
          code: 'Recall prisoner',
          active: false,
          label: 'Recall prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182725',
          code: 'Civil prisoner',
          active: false,
          label: 'Civil prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183057',
          code: 'Sentenced prisoner',
          active: true,
          label: 'Sentenced prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45189',
        },
        {
          id: '183058',
          code: 'Remand prisoner',
          active: true,
          label: 'Remand prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45189',
        },
        {
          id: '183059',
          code: 'Immigration detainee',
          active: true,
          label: 'Immigration detainee',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45189',
        },
        {
          id: '183060',
          code: 'Recall prisoner',
          active: true,
          label: 'Recall prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45189',
        },
        {
          id: '183061',
          code: 'Civil prisoner',
          active: true,
          label: 'Civil prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45189',
        },
      ],
    },
    '45187': {
      id: '45187',
      active: false,
      code: 'Has the person been reported UAL to the Police?',
      label: 'Has the person been reported UAL to the police?',
      multipleAnswers: false,
      answers: [
        {
          id: '182726',
          code: 'Yes: Date',
          active: false,
          label: 'Yes: date',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
          id: '182727',
          code: 'Police Incident Number:',
          active: false,
          label: 'Police incident number:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182728',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '45188': {
      id: '45188',
      active: true,
      code: 'Has the release in error been reported to NOU?',
      label: 'Has the release in error been reported to NOU?',
      multipleAnswers: true,
      answers: [
        {
          id: '182729',
          code: 'Yes: Date',
          active: false,
          label: 'Yes: date',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
          id: '182730',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182731',
          code: 'Incident Ref No:',
          active: false,
          label: 'Incident ref no:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183065',
          code: 'Yes: Date',
          active: true,
          label: 'Yes: date',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45190',
        },
        {
          id: '183066',
          code: 'Incident Ref No:',
          active: true,
          label: 'Incident ref no:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45190',
        },
        {
          id: '183067',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45190',
        },
      ],
    },
    '45189': {
      id: '45189',
      active: true,
      code: 'Has the person been reported UAL to the Police?',
      label: 'Has the person been reported UAL to the police?',
      multipleAnswers: true,
      answers: [
        {
          id: '182732',
          code: 'Yes: Date',
          active: false,
          label: 'Yes: date',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
          id: '182733',
          code: 'Police Incident Number:',
          active: false,
          label: 'Police incident number:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182734',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183062',
          code: 'Yes: Date',
          active: true,
          label: 'Yes: date',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45188',
        },
        {
          id: '183063',
          code: 'Police Incident Number:',
          active: true,
          label: 'Police incident number:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45188',
        },
        {
          id: '183064',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45188',
        },
      ],
    },
    '45190': {
      id: '45190',
      active: true,
      code: 'Has the person been returned to custody?',
      label: 'Has the person been returned to custody?',
      multipleAnswers: true,
      answers: [
        {
          id: '182735',
          code: 'Yes',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182736',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182737',
          code: 'Other: Please enter details',
          active: false,
          label: 'Other: please enter details',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183068',
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45191',
        },
        {
          id: '183069',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45191',
        },
        {
          id: '183070',
          code: 'Other: Please enter details',
          active: true,
          label: 'Other: please enter details',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45191',
        },
        {
          id: '184684',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '45191': {
      id: '45191',
      active: true,
      code: 'Date returned to custody',
      label: 'Date returned to custody',
      multipleAnswers: false,
      answers: [
        {
          id: '182738',
          code: 'Date:',
          active: false,
          label: 'Date:',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
          id: '183071',
          code: 'Date:',
          active: true,
          label: 'Date:',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45192',
        },
      ],
    },
    '45192': {
      id: '45192',
      active: true,
      code: 'Was person charged with committing a further offence while at large?',
      label: 'Was person charged with committing a further offence while at large?',
      multipleAnswers: false,
      answers: [
        {
          id: '182739',
          code: 'Yes: Please enter details of offence',
          active: false,
          label: 'Yes: please enter details of offence',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182740',
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183072',
          code: 'Yes: Please enter details of offence',
          active: true,
          label: 'Yes: please enter details of offence',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45193',
        },
        {
          id: '183073',
          code: 'No',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45193',
        },
      ],
    },
    '45193': {
      id: '45193',
      active: true,
      code: 'To which establishment was person returned?',
      label: 'To which establishment was person returned?',
      multipleAnswers: false,
      answers: [
        {
          id: '182741',
          code: 'Enter details:',
          active: false,
          label: 'Enter details:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183074',
          code: 'Enter details:',
          active: true,
          label: 'Enter details:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45235',
        },
      ],
    },
    '45194': {
      id: '45194',
      active: false,
      code: 'How long was person UAL?',
      label: 'How long was person UAL?',
      multipleAnswers: false,
      answers: [
        {
          id: '182742',
          code: 'Enter value',
          active: false,
          label: 'Enter value',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '45195': {
      id: '45195',
      active: false,
      code: 'How long was person UAL?',
      label: 'How long was person UAL?',
      multipleAnswers: true,
      answers: [
        {
          id: '182743',
          code: 'Hours',
          active: false,
          label: 'Hours',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182744',
          code: 'Days',
          active: false,
          label: 'Days',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182745',
          code: 'Weeks',
          active: false,
          label: 'Weeks',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182746',
          code: 'Months',
          active: false,
          label: 'Months',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '182747',
          code: 'Other',
          active: false,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '45235': {
      id: '45235',
      active: true,
      code: 'How long was person UAL?',
      label: 'How long was person UAL?',
      multipleAnswers: true,
      answers: [
        {
          id: '183075',
          code: 'Hours',
          active: true,
          label: 'Hours',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183076',
          code: 'Days',
          active: true,
          label: 'Days',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183077',
          code: 'Weeks',
          active: true,
          label: 'Weeks',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183078',
          code: 'Months',
          active: true,
          label: 'Months',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '183079',
          code: 'Other',
          active: true,
          label: 'Other',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
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

export default RELEASED_IN_ERROR

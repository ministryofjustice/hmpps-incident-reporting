// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-20T16:52:43.030Z

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
          code: 'Bail',
          active: false,
          label: 'Bail',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Final discharge/end of sentence',
          active: false,
          label: 'Final discharge/end of sentence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Police production',
          active: false,
          label: 'Police production',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Court production/PEMS',
          active: false,
          label: 'Court production/PEMS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Escort - HMPS',
          active: false,
          label: 'Escort - HMPS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Other: Please explain',
          active: false,
          label: 'Other: Please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Bail',
          active: true,
          label: 'Bail',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45180',
        },
        {
          code: 'Final discharge/end of sentence',
          active: true,
          label: 'Final discharge/end of sentence',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45180',
        },
        {
          code: 'Police production',
          active: true,
          label: 'Police production',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45180',
        },
        {
          code: 'Court production/PEMS',
          active: false,
          label: 'Court production/PEMS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45180',
        },
        {
          code: 'Escort – HMPS',
          active: true,
          label: 'Escort – HMPS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45180',
        },
        {
          code: 'Other : Please explain',
          active: true,
          label: 'Other : Please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45180',
        },
        {
          code: 'Court production/PEMS',
          active: true,
          label: 'Court production/PEMS',
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
          code: 'Establishment: Enter name',
          active: false,
          label: 'Establishment: Enter name',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Court: Enter name',
          active: false,
          label: 'Court: Enter name',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Other: Please enter details',
          active: false,
          label: 'Other: Please enter details',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Establishment : Enter name',
          active: true,
          label: 'Establishment : Enter name',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45181',
        },
        {
          code: 'Court : Enter name',
          active: true,
          label: 'Court : Enter name',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45181',
        },
        {
          code: 'Other : Please enter details',
          active: true,
          label: 'Other : Please enter details',
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
      label: 'What was the nature of the Incident?',
      multipleAnswers: true,
      answers: [
        {
          code: 'Wrong person released',
          active: false,
          label: 'Wrong person released',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Sentence miscalculated',
          active: false,
          label: 'Sentence miscalculated',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'ADA not included in calculations',
          active: false,
          label: 'ADA not included in calculations',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Immigration warrant not applied/misfiled/missing',
          active: false,
          label: 'Immigration warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Remand warrant not applied/misfiled/missing',
          active: false,
          label: 'Remand warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Imprisonment warrant not applied/misfiled/missing',
          active: false,
          label: 'Imprisonment warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Civil/non payment of fines warrant not applied/misfiled/missing',
          active: false,
          label: 'Civil/non payment of fines warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Bail conditions not fully met',
          active: false,
          label: 'Bail conditions not fully met',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Release criteria not met',
          active: false,
          label: 'Release criteria not met',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Recall procedures not applied',
          active: false,
          label: 'Recall procedures not applied',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Other: Please explain',
          active: false,
          label: 'Other: Please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Wrong person released',
          active: true,
          label: 'Wrong person released',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          code: 'Sentence Miscalculated',
          active: true,
          label: 'Sentence Miscalculated',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          code: 'ADA not included on calculations',
          active: true,
          label: 'ADA not included on calculations',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          code: 'Immigration warrant not applied/misfiled/missing',
          active: true,
          label: 'Immigration warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          code: 'Remand warrant not applied/misfiled/missing',
          active: true,
          label: 'Remand warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          code: 'Imprisonment warrant not applied/misfiled/missing',
          active: true,
          label: 'Imprisonment warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          code: 'Civil/non payment of fines warrant not applied/misfiled/missing',
          active: true,
          label: 'Civil/non payment of fines warrant not applied/misfiled/missing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          code: 'Bail conditions not fully met',
          active: true,
          label: 'Bail conditions not fully met',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          code: 'Release criteria not met',
          active: true,
          label: 'Release criteria not met',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          code: 'Recall procedures not applied',
          active: true,
          label: 'Recall procedures not applied',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45182',
        },
        {
          code: 'Other : Please explain',
          active: true,
          label: 'Other : Please explain',
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
      label: 'What action is being taken to return the person to custody by the Establishment?',
      multipleAnswers: true,
      answers: [
        {
          code: 'Recall procedures',
          active: false,
          label: 'Recall procedures',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Home Probation Officer',
          active: false,
          label: 'Home Probation Officer',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Prisoner contacted',
          active: false,
          label: 'Prisoner contacted',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Court contacted',
          active: false,
          label: 'Court contacted',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Police contacted',
          active: false,
          label: 'Police contacted',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Other: Please explain',
          active: false,
          label: 'Other: Please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'None - explain why none of the above procedures have been actioned',
          active: false,
          label: 'None - explain why none of the above procedures have been actioned',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Recall procedures',
          active: true,
          label: 'Recall procedures',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45183',
        },
        {
          code: 'Home Probation Officer',
          active: true,
          label: 'Home Probation Officer',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45183',
        },
        {
          code: 'Prisoner contacted',
          active: true,
          label: 'Prisoner contacted',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45183',
        },
        {
          code: 'Court contacted',
          active: true,
          label: 'Court contacted',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45183',
        },
        {
          code: 'Police contacted',
          active: true,
          label: 'Police contacted',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45183',
        },
        {
          code: 'Other : Please explain',
          active: true,
          label: 'Other : Please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45183',
        },
        {
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
          code: 'Contact from PEMS',
          active: false,
          label: 'Contact from PEMS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Contact from Courts',
          active: false,
          label: 'Contact from Courts',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Contact from UKBA',
          active: false,
          label: 'Contact from UKBA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Contact from Police',
          active: false,
          label: 'Contact from Police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Post release check by Establishment',
          active: false,
          label: 'Post release check by Establishment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Contact from other agency: Please enter details',
          active: false,
          label: 'Contact from other agency: Please enter details',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Sentence calculations',
          active: false,
          label: 'Sentence calculations',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Other: Please explain',
          active: false,
          label: 'Other: Please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Contact from PEMS',
          active: false,
          label: 'Contact from PEMS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          code: 'Contact from courts',
          active: true,
          label: 'Contact from courts',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          code: 'Contact from UKBA',
          active: true,
          label: 'Contact from UKBA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          code: 'Contact from police',
          active: true,
          label: 'Contact from police',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          code: 'Post release check by Establishment',
          active: true,
          label: 'Post release check by Establishment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          code: 'Contact from other agency : Please enter details',
          active: true,
          label: 'Contact from other agency : Please enter details',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          code: 'Sentence calculations (new receptions)',
          active: true,
          label: 'Sentence calculations (new receptions)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          code: 'Other: Please explain',
          active: true,
          label: 'Other: Please explain',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45184',
        },
        {
          code: 'Contact from PEMS',
          active: true,
          label: 'Contact from PEMS',
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
          code: 'Date:',
          active: false,
          label: 'Date:',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
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
          code: 'Enter details:',
          active: false,
          label: 'Enter details:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
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
          code: 'Sentenced prisoner',
          active: false,
          label: 'Sentenced prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Remand prisoner',
          active: false,
          label: 'Remand prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Immigration detainee',
          active: false,
          label: 'Immigration detainee',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Recall prisoner',
          active: false,
          label: 'Recall prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Civil prisoner',
          active: false,
          label: 'Civil prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Sentenced prisoner',
          active: true,
          label: 'Sentenced prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45189',
        },
        {
          code: 'Remand prisoner',
          active: true,
          label: 'Remand prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45189',
        },
        {
          code: 'Immigration detainee',
          active: true,
          label: 'Immigration detainee',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45189',
        },
        {
          code: 'Recall prisoner',
          active: true,
          label: 'Recall prisoner',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45189',
        },
        {
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
      label: 'Has the person been reported UAL to the Police?',
      multipleAnswers: false,
      answers: [
        {
          code: 'Yes: Date',
          active: false,
          label: 'Yes: Date',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
          code: 'Police Incident Number:',
          active: false,
          label: 'Police Incident Number:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
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
          code: 'Yes: Date',
          active: false,
          label: 'Yes: Date',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Incident Ref No:',
          active: false,
          label: 'Incident Ref No:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Yes: Date',
          active: true,
          label: 'Yes: Date',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45190',
        },
        {
          code: 'Incident Ref No:',
          active: true,
          label: 'Incident Ref No:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45190',
        },
        {
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
      label: 'Has the person been reported UAL to the Police?',
      multipleAnswers: true,
      answers: [
        {
          code: 'Yes: Date',
          active: false,
          label: 'Yes: Date',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
          code: 'Police Incident Number:',
          active: false,
          label: 'Police Incident Number:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Yes: Date',
          active: true,
          label: 'Yes: Date',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45188',
        },
        {
          code: 'Police Incident Number:',
          active: true,
          label: 'Police Incident Number:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45188',
        },
        {
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
          code: 'Yes',
          active: false,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Other: Please enter details',
          active: false,
          label: 'Other: Please enter details',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Yes',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45191',
        },
        {
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45191',
        },
        {
          code: 'Other: Please enter details',
          active: true,
          label: 'Other: Please enter details',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45191',
        },
        {
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
          code: 'Date:',
          active: false,
          label: 'Date:',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: null,
        },
        {
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
          code: 'Yes: Please enter details of offence',
          active: false,
          label: 'Yes: Please enter details of offence',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'No',
          active: false,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Yes: Please enter details of offence',
          active: true,
          label: 'Yes: Please enter details of offence',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45193',
        },
        {
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
          code: 'Enter details:',
          active: false,
          label: 'Enter details:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Enter details:',
          active: true,
          label: 'Enter details:',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45194',
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
          code: 'Hours',
          active: false,
          label: 'Hours',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Days',
          active: false,
          label: 'Days',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Weeks',
          active: false,
          label: 'Weeks',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Months',
          active: false,
          label: 'Months',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
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
          code: 'Hours',
          active: true,
          label: 'Hours',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Days',
          active: true,
          label: 'Days',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Weeks',
          active: true,
          label: 'Weeks',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'Months',
          active: true,
          label: 'Months',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
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
} as const

export default RELEASED_IN_ERROR

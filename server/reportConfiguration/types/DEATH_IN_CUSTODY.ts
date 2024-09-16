// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:40.624Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const DEATH_IN_CUSTODY: IncidentTypeConfiguration = {
  incidentType: 'DEATH_IN_CUSTODY',
  active: true,
  startingQuestionId: '44646',
  questions: {
    '44159': {
      id: '44159',
      label: 'WHAT WERE THE CIRCUMSTANCES OF THE DEATH',
      multipleAnswers: false,
      answers: [
        {
          label: 'APPARENT SELF INFLICTED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44383',
        },
        {
          label: 'APPARENT NATURAL CAUSES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44384',
        },
        {
          label: 'ACCIDENTAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45144',
        },
        {
          label: 'SUSPICIOUS CIRCUMSTANCES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44468',
        },
      ],
    },
    '44292': {
      id: '44292',
      label: 'IS THE DEATH SUBJECT TO A HEALTH AND SAFETY INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44159',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44159',
        },
      ],
    },
    '44303': {
      id: '44303',
      label: 'WHAT VERDICT DID THE INQUEST REACH',
      multipleAnswers: false,
      answers: [
        {
          label: 'NATURAL CAUSES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'SUICIDE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'ACCIDENTAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'MISADVENTURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'OPEN VERDICT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44366': {
      id: '44366',
      label: 'WHERE WAS THE PRISONER LOCATED AT THE TIME OF DEATH',
      multipleAnswers: false,
      answers: [
        {
          label: 'SINGLE CELL: ORDINARY LOCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44680',
        },
        {
          label: 'SINGLE CELL: SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44680',
        },
        {
          label: 'SHARED CELL: ORDINARY LOCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44680',
        },
        {
          label: 'SPECIAL CELL: SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44680',
        },
        {
          label: 'SINGLE CELL:HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44680',
        },
        {
          label: 'WARD: HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44680',
        },
        {
          label: 'UNFURNISHED ROOM: H.C.C.',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44680',
        },
        {
          label: 'PROTECTIVE ROOM: H.C.C.',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44680',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44680',
        },
      ],
    },
    '44383': {
      id: '44383',
      label: 'WHAT METHOD WAS USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'HANGING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44929',
        },
        {
          label: 'CUTTING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45023',
        },
        {
          label: 'SUFFOCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45023',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45023',
        },
      ],
    },
    '44384': {
      id: '44384',
      label: 'WHAT WAS THE LIKELY CAUSE OF DEATH',
      multipleAnswers: false,
      answers: [
        {
          label: 'MYOCARDIAL INFARCTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44468',
        },
        {
          label: 'LONG TERM ALCOHOL MISUSE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44468',
        },
        {
          label: 'LONG TERM DRUG MISUSE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44468',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44468',
        },
      ],
    },
    '44418': {
      id: '44418',
      label: 'WAS THE PRISONER RECEIVING MEDICATION AT THE TIME OF DEATH',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44691',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44691',
        },
      ],
    },
    '44420': {
      id: '44420',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44743',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44743',
        },
      ],
    },
    '44468': {
      id: '44468',
      label: 'HAS THE NEXT OF KIN BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45063',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45063',
        },
      ],
    },
    '44537': {
      id: '44537',
      label: 'WHERE WAS THE PRISONER AT THE TIME OF DEATH',
      multipleAnswers: false,
      answers: [
        {
          label: 'IN THE PRISON',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44366',
        },
        {
          label: 'CUSTODY OF STAFF OUT OF PRISON',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45166',
        },
        {
          label: 'ON TEMPORARY RELEASE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44721',
        },
        {
          label: 'UNLAWFULLY AT LARGE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45043',
        },
      ],
    },
    '44640': {
      id: '44640',
      label: "HAS A CORONER'S INQUEST BEEN HELD",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44303',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44646': {
      id: '44646',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45038',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45120',
        },
      ],
    },
    '44680': {
      id: '44680',
      label: 'WAS THE PRISONER ALONE AT THE TIME OF DEATH',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44418',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44418',
        },
      ],
    },
    '44691': {
      id: '44691',
      label: 'WHO FOUND THE PRISONER',
      multipleAnswers: false,
      answers: [
        {
          label: 'PRISON STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45108',
        },
        {
          label: 'CELL MATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45108',
        },
        {
          label: 'OTHER PRISONER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45108',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45108',
        },
      ],
    },
    '44720': {
      id: '44720',
      label: 'WHO PRONOUNCED DEATH',
      multipleAnswers: false,
      answers: [
        {
          label: 'PRISON MEDICAL OFFICER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44962',
        },
        {
          label: 'HOSPITAL DOCTOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44962',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44962',
        },
      ],
    },
    '44721': {
      id: '44721',
      label: 'WAS THE PRISONER ON T/R IN OUTSIDE HOSPITAL',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44720',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45043',
        },
      ],
    },
    '44743': {
      id: '44743',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44537',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44537',
        },
      ],
    },
    '44770': {
      id: '44770',
      label: 'WHAT WAS THE LIGATURE ATTACHED TO',
      multipleAnswers: false,
      answers: [
        {
          label: 'WINDOW BARS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45023',
        },
        {
          label: 'CELL DOOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45023',
        },
        {
          label: 'LIGHT FITTINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45023',
        },
        {
          label: 'BED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45023',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45023',
        },
      ],
    },
    '44862': {
      id: '44862',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44420',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44420',
        },
      ],
    },
    '44876': {
      id: '44876',
      label: 'WAS RESUSCITATION ATTEMPTED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44901',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44901',
        },
      ],
    },
    '44901': {
      id: '44901',
      label: 'WAS THE PRISONER TAKEN TO AN OUTSIDE HOSPITAL',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44720',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44720',
        },
      ],
    },
    '44929': {
      id: '44929',
      label: 'WHAT WAS THE LIGATURE MADE FROM',
      multipleAnswers: false,
      answers: [
        {
          label: 'BEDDING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44770',
        },
        {
          label: 'SHOELACES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44770',
        },
        {
          label: 'CLOTHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44770',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44770',
        },
      ],
    },
    '44962': {
      id: '44962',
      label: 'WHAT TIME WAS DEATH PRONOUNCED',
      multipleAnswers: true,
      answers: [
        {
          label: 'DATE',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44292',
        },
        {
          label: 'TIME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44292',
        },
      ],
    },
    '45023': {
      id: '45023',
      label: 'WAS A F2052SH/ACCT OPEN AT THE TIME OF DEATH',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44468',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44468',
        },
      ],
    },
    '45038': {
      id: '45038',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45120',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45120',
        },
      ],
    },
    '45043': {
      id: '45043',
      label: 'IS THE PLACE OF DEATH KNOWN',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44159',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44159',
        },
      ],
    },
    '45063': {
      id: '45063',
      label: 'HAS CORONER BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44640',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44640',
        },
      ],
    },
    '45108': {
      id: '45108',
      label: 'AT WHAT TIME WAS THE PRISONER FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'DATE',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44876',
        },
        {
          label: 'TIME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44876',
        },
      ],
    },
    '45120': {
      id: '45120',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44862',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44862',
        },
      ],
    },
    '45144': {
      id: '45144',
      label: 'WAS THE ACCIDENTAL DEATH CAUSED BY',
      multipleAnswers: false,
      answers: [
        {
          label: 'DRUG OVERDOSE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44468',
        },
        {
          label: 'FALL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44468',
        },
        {
          label: 'TRANSPORT ACCIDENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44468',
        },
        {
          label: 'ACCIDENT INVOLVING MACHINERY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44468',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44468',
        },
      ],
    },
    '45166': {
      id: '45166',
      label: 'WHERE DID THE DEATH TAKE PLACE',
      multipleAnswers: false,
      answers: [
        {
          label: 'OUTSIDE HOSPITAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44720',
        },
        {
          label: 'OUTSIDE WORKING PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44876',
        },
        {
          label: 'OUTSIDE P.E. ACTIVITY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44876',
        },
        {
          label: 'AT COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44876',
        },
        {
          label: 'OTHER ESCORT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44876',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44876',
        },
      ],
    },
  },
} as const

export default DEATH_IN_CUSTODY

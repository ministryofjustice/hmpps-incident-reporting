// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-10-15T17:17:40.875Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const FULL_CLOSE_DOWN_SEARCH: IncidentTypeConfiguration = {
  incidentType: 'FULL_CLOSE_DOWN_SEARCH',
  active: true,
  startingQuestionId: '45067',
  questions: {
    '44146': {
      id: '44146',
      active: true,
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          id: '178989',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44677',
        },
        {
          id: '178988',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44677',
        },
      ],
    },
    '44385': {
      id: '44385',
      active: true,
      code: 'WERE ANY ILLICIT ITEMS FOUND',
      label: 'WERE ANY ILLICIT ITEMS FOUND',
      multipleAnswers: false,
      answers: [
        {
          id: '179804',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44969',
        },
        {
          id: '179805',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44803',
        },
      ],
    },
    '44432': {
      id: '44432',
      active: true,
      code: 'WHAT WAS THE PURPOSE OF THE SEARCH',
      label: 'WHAT WAS THE PURPOSE OF THE SEARCH',
      multipleAnswers: true,
      answers: [
        {
          id: '179926',
          code: 'FIREARM',
          active: true,
          label: 'FIREARM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          id: '179921',
          code: 'AMMUNITION',
          active: true,
          label: 'AMMUNITION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          id: '179922',
          code: 'C.I SPRAY',
          active: true,
          label: 'C.I SPRAY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          id: '179929',
          code: 'OTHER WEAPON',
          active: true,
          label: 'OTHER WEAPON',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          id: '179925',
          code: 'EXPLOSIVES',
          active: true,
          label: 'EXPLOSIVES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          id: '179923',
          code: 'DRUGS',
          active: true,
          label: 'DRUGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          id: '179924',
          code: 'ESCAPE EQUIPMENT',
          active: true,
          label: 'ESCAPE EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          id: '179927',
          code: 'GATHER EVIDENCE',
          active: true,
          label: 'GATHER EVIDENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44385',
        },
        {
          id: '179928',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44385',
        },
      ],
    },
    '44570': {
      id: '44570',
      active: true,
      code: 'WERE SUPPORT STAFF FROM OTHER PRISONS DEPLOYED',
      label: 'WERE SUPPORT STAFF FROM OTHER PRISONS DEPLOYED',
      multipleAnswers: false,
      answers: [
        {
          id: '180488',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '180487',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44677': {
      id: '44677',
      active: true,
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          id: '180841',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45062',
        },
        {
          id: '180840',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45062',
        },
      ],
    },
    '44723': {
      id: '44723',
      active: true,
      code: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          id: '181020',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45018',
        },
        {
          id: '181019',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45018',
        },
      ],
    },
    '44803': {
      id: '44803',
      active: true,
      code: 'WERE SPECIALIST DOGS USED',
      label: 'WERE SPECIALIST DOGS USED',
      multipleAnswers: false,
      answers: [
        {
          id: '181265',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44570',
        },
        {
          id: '181264',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44570',
        },
      ],
    },
    '44969': {
      id: '44969',
      active: true,
      code: 'DESCRIBE THE ILLICIT ITEMS',
      label: 'DESCRIBE THE ILLICIT ITEMS',
      multipleAnswers: true,
      answers: [
        {
          id: '181851',
          code: 'WEAPONS',
          active: true,
          label: 'WEAPONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44803',
        },
        {
          id: '181847',
          code: 'HOOCH/ALCOHOL',
          active: true,
          label: 'HOOCH/ALCOHOL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44803',
        },
        {
          id: '181846',
          code: 'CASH',
          active: true,
          label: 'CASH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44803',
        },
        {
          id: '181849',
          code: 'MOBILE PHONE',
          active: true,
          label: 'MOBILE PHONE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44803',
        },
        {
          id: '181848',
          code: 'INCENDIARY DEVICE',
          active: true,
          label: 'INCENDIARY DEVICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44803',
        },
        {
          id: '181850',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44803',
        },
      ],
    },
    '45018': {
      id: '45018',
      active: true,
      code: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          id: '182011',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44146',
        },
        {
          id: '182010',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44146',
        },
      ],
    },
    '45062': {
      id: '45062',
      active: true,
      code: 'WHY WAS SEARCH CARRIED OUT',
      label: 'WHY WAS SEARCH CARRIED OUT',
      multipleAnswers: false,
      answers: [
        {
          id: '182234',
          code: 'INFORMATION/INTELLIGENCE',
          active: true,
          label: 'INFORMATION/INTELLIGENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44432',
        },
        {
          id: '182237',
          code: 'SPECIFIC FIND',
          active: true,
          label: 'SPECIFIC FIND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44432',
        },
        {
          id: '182233',
          code: 'HEADQUARTERS INSTRUCTIONS',
          active: true,
          label: 'HEADQUARTERS INSTRUCTIONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44432',
        },
        {
          id: '182236',
          code: 'ROUTINE REQUIREMENT',
          active: true,
          label: 'ROUTINE REQUIREMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44432',
        },
        {
          id: '182235',
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44432',
        },
      ],
    },
    '45067': {
      id: '45067',
      active: true,
      code: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          id: '182249',
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44723',
        },
        {
          id: '182250',
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45018',
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

export default FULL_CLOSE_DOWN_SEARCH

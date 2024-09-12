// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:41.915Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const SELF_HARM: IncidentTypeConfiguration = {
  incidentType: 'SELF_HARM',
  active: true,
  startingQuestionId: '45051',
  questions: {
    '44155': {
      id: '44155',
      label: 'TREATMENT REQUIRED FOLLOWING CUT SCRATCH',
      multipleAnswers: false,
      answers: [
        {
          label: 'NO TREATMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
        {
          label: 'STERI STRIPS OR SUTURES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
        {
          label: 'CLEANED AND DRESSED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44733',
        },
      ],
    },
    '44207': {
      id: '44207',
      label: 'DID SELF HARM METHOD INVOLVE SELF STRANGULATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44583',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
      ],
    },
    '44214': {
      id: '44214',
      label: 'WAS RESUSCITATION REQUIRED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44944',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44944',
        },
      ],
    },
    '44244': {
      id: '44244',
      label: 'DID SELF HARM METHOD INVOLVE HANGING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44653',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
      ],
    },
    '44332': {
      id: '44332',
      label: 'WHO ADMINISTERED TREATMENT',
      multipleAnswers: true,
      answers: [
        {
          label: 'NON HEALTHCARE STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
        {
          label: 'NURSE/HCO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
        {
          label: 'MEDICAL OFFICER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
        {
          label: 'PARAMEDICS/AMBULANCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
      ],
    },
    '44339': {
      id: '44339',
      label: 'OCCUPANCY',
      multipleAnswers: false,
      answers: [
        {
          label: 'SINGLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
        {
          label: 'DOUBLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
        {
          label: 'DOUBLE BUT ALONE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
        {
          label: 'MULTIPLE (3 OR  MORE)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
      ],
    },
    '44400': {
      id: '44400',
      label: 'WAS A F2052SH/ACCT OPEN',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44435',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44435',
        },
      ],
    },
    '44435': {
      id: '44435',
      label: 'WHEN WAS THE LAST F2052SH/ACCT CLOSED',
      multipleAnswers: false,
      answers: [
        {
          label: 'WITHIN ONE MONTH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44965',
        },
        {
          label: 'MORE THAN ONE MONTH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44965',
        },
        {
          label: 'NOT APPLICABLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44965',
        },
      ],
    },
    '44511': {
      id: '44511',
      label: 'WAS TREATMENT ADMINISTERED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44332',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
      ],
    },
    '44552': {
      id: '44552',
      label: 'WAS ANY OTHER SELF HARM METHOD INVOLVED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45105',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
      ],
    },
    '44573': {
      id: '44573',
      label: 'SELF POISONING/OVERDOSE/SUBSTANCES/SWALLOWING',
      multipleAnswers: true,
      answers: [
        {
          label: 'OWN MEDICATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          label: 'OTHER PERSONS MEDICATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          label: 'ILLEGAL DRUGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          label: 'CLEANING MATERIALS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          label: 'RAZOR BLADES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          label: 'BATTERIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45167',
        },
      ],
    },
    '44583': {
      id: '44583',
      label: 'LIGATURE TYPE',
      multipleAnswers: false,
      answers: [
        {
          label: 'BEDDING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          label: 'SHOELACES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          label: 'TOWEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          label: 'CLOTHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          label: 'BELT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44753',
        },
      ],
    },
    '44584': {
      id: '44584',
      label: 'TYPE OF HOSPITAL',
      multipleAnswers: false,
      answers: [
        {
          label: 'A AND E',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
        {
          label: 'IN PATIENT (OVERNIGHT ONLY)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
        {
          label: 'IN PATIENT (OVER 24HR)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
        {
          label: 'LIFE SUPPORT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
      ],
    },
    '44643': {
      id: '44643',
      label: 'TYPE OF BURNING',
      multipleAnswers: false,
      answers: [
        {
          label: 'SUPERFICIAL E.G. CIGARETTE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44552',
        },
        {
          label: 'NON SUPERFICIAL CELL/SELF FIRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44552',
        },
      ],
    },
    '44653': {
      id: '44653',
      label: 'WHAT WAS THE LIGATURE POINT',
      multipleAnswers: false,
      answers: [
        {
          label: 'WINDOW',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          label: 'BED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          label: 'DOOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          label: 'PIPES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          label: 'TOILET AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44718',
        },
      ],
    },
    '44718': {
      id: '44718',
      label: 'HANGING SELF STRANGULATION METHOD',
      multipleAnswers: false,
      answers: [
        {
          label: 'FEET OFF FLOOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45020',
        },
        {
          label: 'KNEELING OR OTHER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45020',
        },
        {
          label: 'NEITHER OF ABOVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45020',
        },
      ],
    },
    '44733': {
      id: '44733',
      label: 'DID SELF HARM INVOLVE SELF POISONING/ OVERDOSE/SWALLOWING OBJECTS',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44573',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
      ],
    },
    '44753': {
      id: '44753',
      label: 'DID SELF HARM METHOD INVOLVE CUTTING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44991',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
      ],
    },
    '44791': {
      id: '44791',
      label: 'WHAT WAS THE CELL TYPE',
      multipleAnswers: false,
      answers: [
        {
          label: 'ORDINARY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          label: 'GATED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          label: 'SAFE ANTI-LIGATURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          label: 'TIME OUT ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          label: 'CARE SUITE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          label: 'UNFURNISHED/STRONG BOX',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          label: 'WARD/DORM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44339',
        },
      ],
    },
    '44890': {
      id: '44890',
      label: 'TYPE OF IMPLEMENT USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'RAZOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44155',
        },
        {
          label: 'BROKEN GLASS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44155',
        },
        {
          label: 'PLASTIC MATERIAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44155',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44155',
        },
      ],
    },
    '44944': {
      id: '44944',
      label: 'WERE THEY ADMITTED TO HEALTHCARE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44954',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44954',
        },
        {
          label: 'ALREADY IN HEALTHCARE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44954',
        },
      ],
    },
    '44954': {
      id: '44954',
      label: 'DID THEY GO TO OUTSIDE HOSPITAL',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44584',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
      ],
    },
    '44965': {
      id: '44965',
      label: 'IS A F2052SH/ACCT OPEN NOW',
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
    '44991': {
      id: '44991',
      label: 'LOCATION OF CUTS',
      multipleAnswers: true,
      answers: [
        {
          label: 'WRIST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          label: 'ARMS/LEGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          label: 'TORSO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          label: 'THROAT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44890',
        },
      ],
    },
    '45020': {
      id: '45020',
      label: 'LIGATURE TYPE',
      multipleAnswers: false,
      answers: [
        {
          label: 'BEDDING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          label: 'SHOELACES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          label: 'TOWEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          label: 'CLOTHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          label: 'BELT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44207',
        },
      ],
    },
    '45051': {
      id: '45051',
      label: 'WHERE DID THE INCIDENT TAKE PLACE',
      multipleAnswers: true,
      answers: [
        {
          label: 'ORDINARY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          label: 'VPU/OTHER PROTECTED',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          label: 'HEALTH CARE CENTRE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          label: "INDCT'N/RECP'N/1ST NIGHTCENTRE",
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          label: 'SEGREGATION UNIT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          label: 'DETOX UNIT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          label: 'PRISON ESCORT VEHICLE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          label: 'COURT CELL',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
      ],
    },
    '45105': {
      id: '45105',
      label: 'WHAT OTHER METHOD OF SELF HARM WAS INVOLVED',
      multipleAnswers: true,
      answers: [
        {
          label: 'HEAD BANGING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          label: 'SUFFOCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          label: 'WOUND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          label: 'NOOSE LIGATURE MAKING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44511',
        },
      ],
    },
    '45167': {
      id: '45167',
      label: 'DID SELF HARM METHOD INVOLVE BURNING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44643',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44552',
        },
      ],
    },
  },
} as const

export default SELF_HARM

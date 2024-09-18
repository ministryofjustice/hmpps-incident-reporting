// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-16T15:42:00.843Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const SELF_HARM: IncidentTypeConfiguration = {
  incidentType: 'SELF_HARM',
  active: true,
  startingQuestionId: '45051',
  questions: {
    '44155': {
      id: '44155',
      code: 'TREATMENT REQUIRED FOLLOWING CUT SCRATCH',
      label: 'TREATMENT REQUIRED FOLLOWING CUT SCRATCH',
      multipleAnswers: false,
      answers: [
        {
          code: 'NO TREATMENT',
          label: 'NO TREATMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
        {
          code: 'STERI STRIPS OR SUTURES',
          label: 'STERI STRIPS OR SUTURES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
        {
          code: 'CLEANED AND DRESSED',
          label: 'CLEANED AND DRESSED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44733',
        },
      ],
    },
    '44207': {
      id: '44207',
      code: 'DID SELF HARM METHOD INVOLVE SELF STRANGULATION',
      label: 'DID SELF HARM METHOD INVOLVE SELF STRANGULATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44583',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
      ],
    },
    '44214': {
      id: '44214',
      code: 'WAS RESUSCITATION REQUIRED',
      label: 'WAS RESUSCITATION REQUIRED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44944',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44944',
        },
      ],
    },
    '44244': {
      id: '44244',
      code: 'DID SELF HARM METHOD INVOLVE HANGING',
      label: 'DID SELF HARM METHOD INVOLVE HANGING',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44653',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
      ],
    },
    '44332': {
      id: '44332',
      code: 'WHO ADMINISTERED TREATMENT',
      label: 'WHO ADMINISTERED TREATMENT',
      multipleAnswers: true,
      answers: [
        {
          code: 'NON HEALTHCARE STAFF',
          label: 'NON HEALTHCARE STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
        {
          code: 'NURSE/HCO',
          label: 'NURSE/HCO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
        {
          code: 'MEDICAL OFFICER',
          label: 'MEDICAL OFFICER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
        {
          code: 'PARAMEDICS/AMBULANCE',
          label: 'PARAMEDICS/AMBULANCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
      ],
    },
    '44339': {
      id: '44339',
      code: 'OCCUPANCY',
      label: 'OCCUPANCY',
      multipleAnswers: false,
      answers: [
        {
          code: 'SINGLE',
          label: 'SINGLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
        {
          code: 'DOUBLE',
          label: 'DOUBLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
        {
          code: 'DOUBLE BUT ALONE',
          label: 'DOUBLE BUT ALONE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
        {
          code: 'MULTIPLE (3 OR  MORE)',
          label: 'MULTIPLE (3 OR  MORE)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
      ],
    },
    '44400': {
      id: '44400',
      code: 'WAS A F2052SH/ACCT OPEN',
      label: 'WAS A F2052SH/ACCT OPEN',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44435',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44435',
        },
      ],
    },
    '44435': {
      id: '44435',
      code: 'WHEN WAS THE LAST F2052SH/ACCT CLOSED',
      label: 'WHEN WAS THE LAST F2052SH/ACCT CLOSED',
      multipleAnswers: false,
      answers: [
        {
          code: 'WITHIN ONE MONTH',
          label: 'WITHIN ONE MONTH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44965',
        },
        {
          code: 'MORE THAN ONE MONTH',
          label: 'MORE THAN ONE MONTH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44965',
        },
        {
          code: 'NOT APPLICABLE',
          label: 'NOT APPLICABLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44965',
        },
      ],
    },
    '44511': {
      id: '44511',
      code: 'WAS TREATMENT ADMINISTERED',
      label: 'WAS TREATMENT ADMINISTERED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44332',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
      ],
    },
    '44552': {
      id: '44552',
      code: 'WAS ANY OTHER SELF HARM METHOD INVOLVED',
      label: 'WAS ANY OTHER SELF HARM METHOD INVOLVED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45105',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
      ],
    },
    '44573': {
      id: '44573',
      code: 'SELF POISONING/OVERDOSE/SUBSTANCES/SWALLOWING',
      label: 'SELF POISONING/OVERDOSE/SUBSTANCES/SWALLOWING',
      multipleAnswers: true,
      answers: [
        {
          code: 'OWN MEDICATION',
          label: 'OWN MEDICATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          code: 'OTHER PERSONS MEDICATION',
          label: 'OTHER PERSONS MEDICATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          code: 'ILLEGAL DRUGS',
          label: 'ILLEGAL DRUGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          code: 'CLEANING MATERIALS',
          label: 'CLEANING MATERIALS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          code: 'RAZOR BLADES',
          label: 'RAZOR BLADES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          code: 'BATTERIES',
          label: 'BATTERIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45167',
        },
      ],
    },
    '44583': {
      id: '44583',
      code: 'LIGATURE TYPE',
      label: 'LIGATURE TYPE',
      multipleAnswers: false,
      answers: [
        {
          code: 'BEDDING',
          label: 'BEDDING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          code: 'SHOELACES',
          label: 'SHOELACES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          code: 'TOWEL',
          label: 'TOWEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          code: 'CLOTHING',
          label: 'CLOTHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          code: 'BELT',
          label: 'BELT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44753',
        },
      ],
    },
    '44584': {
      id: '44584',
      code: 'TYPE OF HOSPITAL',
      label: 'TYPE OF HOSPITAL',
      multipleAnswers: false,
      answers: [
        {
          code: 'A AND E',
          label: 'A AND E',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
        {
          code: 'IN PATIENT (OVERNIGHT ONLY)',
          label: 'IN PATIENT (OVERNIGHT ONLY)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
        {
          code: 'IN PATIENT (OVER 24HR)',
          label: 'IN PATIENT (OVER 24HR)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
        {
          code: 'LIFE SUPPORT',
          label: 'LIFE SUPPORT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
      ],
    },
    '44643': {
      id: '44643',
      code: 'TYPE OF BURNING',
      label: 'TYPE OF BURNING',
      multipleAnswers: false,
      answers: [
        {
          code: 'SUPERFICIAL E.G. CIGARETTE',
          label: 'SUPERFICIAL E.G. CIGARETTE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44552',
        },
        {
          code: 'NON SUPERFICIAL CELL/SELF FIRE',
          label: 'NON SUPERFICIAL CELL/SELF FIRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44552',
        },
      ],
    },
    '44653': {
      id: '44653',
      code: 'WHAT WAS THE LIGATURE POINT',
      label: 'WHAT WAS THE LIGATURE POINT',
      multipleAnswers: false,
      answers: [
        {
          code: 'WINDOW',
          label: 'WINDOW',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          code: 'BED',
          label: 'BED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          code: 'DOOR',
          label: 'DOOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          code: 'PIPES',
          label: 'PIPES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          code: 'TOILET AREA',
          label: 'TOILET AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44718',
        },
      ],
    },
    '44718': {
      id: '44718',
      code: 'HANGING SELF STRANGULATION METHOD',
      label: 'HANGING SELF STRANGULATION METHOD',
      multipleAnswers: false,
      answers: [
        {
          code: 'FEET OFF FLOOR',
          label: 'FEET OFF FLOOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45020',
        },
        {
          code: 'KNEELING OR OTHER',
          label: 'KNEELING OR OTHER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45020',
        },
        {
          code: 'NEITHER OF ABOVE',
          label: 'NEITHER OF ABOVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45020',
        },
      ],
    },
    '44733': {
      id: '44733',
      code: 'DID SELF HARM INVOLVE SELF POISONING/ OVERDOSE/SWALLOWING OBJECTS',
      label: 'DID SELF HARM INVOLVE SELF POISONING/ OVERDOSE/SWALLOWING OBJECTS',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44573',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
      ],
    },
    '44753': {
      id: '44753',
      code: 'DID SELF HARM METHOD INVOLVE CUTTING',
      label: 'DID SELF HARM METHOD INVOLVE CUTTING',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44991',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
      ],
    },
    '44791': {
      id: '44791',
      code: 'WHAT WAS THE CELL TYPE',
      label: 'WHAT WAS THE CELL TYPE',
      multipleAnswers: false,
      answers: [
        {
          code: 'ORDINARY',
          label: 'ORDINARY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'GATED',
          label: 'GATED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'SAFE ANTI-LIGATURE',
          label: 'SAFE ANTI-LIGATURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'TIME OUT ROOM',
          label: 'TIME OUT ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'CARE SUITE',
          label: 'CARE SUITE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'UNFURNISHED/STRONG BOX',
          label: 'UNFURNISHED/STRONG BOX',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'WARD/DORM',
          label: 'WARD/DORM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44339',
        },
      ],
    },
    '44890': {
      id: '44890',
      code: 'TYPE OF IMPLEMENT USED',
      label: 'TYPE OF IMPLEMENT USED',
      multipleAnswers: false,
      answers: [
        {
          code: 'RAZOR',
          label: 'RAZOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44155',
        },
        {
          code: 'BROKEN GLASS',
          label: 'BROKEN GLASS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44155',
        },
        {
          code: 'PLASTIC MATERIAL',
          label: 'PLASTIC MATERIAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44155',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44155',
        },
      ],
    },
    '44944': {
      id: '44944',
      code: 'WERE THEY ADMITTED TO HEALTHCARE',
      label: 'WERE THEY ADMITTED TO HEALTHCARE',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44954',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44954',
        },
        {
          code: 'ALREADY IN HEALTHCARE',
          label: 'ALREADY IN HEALTHCARE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44954',
        },
      ],
    },
    '44954': {
      id: '44954',
      code: 'DID THEY GO TO OUTSIDE HOSPITAL',
      label: 'DID THEY GO TO OUTSIDE HOSPITAL',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44584',
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
      ],
    },
    '44965': {
      id: '44965',
      code: 'IS A F2052SH/ACCT OPEN NOW',
      label: 'IS A F2052SH/ACCT OPEN NOW',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'NO',
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44991': {
      id: '44991',
      code: 'LOCATION OF CUTS',
      label: 'LOCATION OF CUTS',
      multipleAnswers: true,
      answers: [
        {
          code: 'WRIST',
          label: 'WRIST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          code: 'ARMS/LEGS',
          label: 'ARMS/LEGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          code: 'TORSO',
          label: 'TORSO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          code: 'THROAT',
          label: 'THROAT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44890',
        },
      ],
    },
    '45020': {
      id: '45020',
      code: 'LIGATURE TYPE',
      label: 'LIGATURE TYPE',
      multipleAnswers: false,
      answers: [
        {
          code: 'BEDDING',
          label: 'BEDDING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          code: 'SHOELACES',
          label: 'SHOELACES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          code: 'TOWEL',
          label: 'TOWEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          code: 'CLOTHING',
          label: 'CLOTHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          code: 'BELT',
          label: 'BELT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44207',
        },
      ],
    },
    '45051': {
      id: '45051',
      code: 'WHERE DID THE INCIDENT TAKE PLACE',
      label: 'WHERE DID THE INCIDENT TAKE PLACE',
      multipleAnswers: true,
      answers: [
        {
          code: 'ORDINARY',
          label: 'ORDINARY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'VPU/OTHER PROTECTED',
          label: 'VPU/OTHER PROTECTED',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'HEALTH CARE CENTRE',
          label: 'HEALTH CARE CENTRE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: "INDCT'N/RECP'N/1ST NIGHTCENTRE",
          label: "INDCT'N/RECP'N/1ST NIGHTCENTRE",
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'SEGREGATION UNIT',
          label: 'SEGREGATION UNIT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'DETOX UNIT',
          label: 'DETOX UNIT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'PRISON ESCORT VEHICLE',
          label: 'PRISON ESCORT VEHICLE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'COURT CELL',
          label: 'COURT CELL',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
      ],
    },
    '45105': {
      id: '45105',
      code: 'WHAT OTHER METHOD OF SELF HARM WAS INVOLVED',
      label: 'WHAT OTHER METHOD OF SELF HARM WAS INVOLVED',
      multipleAnswers: true,
      answers: [
        {
          code: 'HEAD BANGING',
          label: 'HEAD BANGING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          code: 'SUFFOCATION',
          label: 'SUFFOCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          code: 'WOUND',
          label: 'WOUND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          code: 'NOOSE LIGATURE MAKING',
          label: 'NOOSE LIGATURE MAKING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          code: 'OTHER',
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44511',
        },
      ],
    },
    '45167': {
      id: '45167',
      code: 'DID SELF HARM METHOD INVOLVE BURNING',
      label: 'DID SELF HARM METHOD INVOLVE BURNING',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44643',
        },
        {
          code: 'NO',
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
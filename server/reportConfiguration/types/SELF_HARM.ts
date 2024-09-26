// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-25T09:25:55.183Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const SELF_HARM: IncidentTypeConfiguration = {
  incidentType: 'SELF_HARM',
  active: true,
  startingQuestionId: '45051',
  questions: {
    '44155': {
      id: '44155',
      active: true,
      code: 'TREATMENT REQUIRED FOLLOWING CUT SCRATCH',
      label: 'TREATMENT REQUIRED FOLLOWING CUT SCRATCH',
      multipleAnswers: false,
      answers: [
        {
          code: 'NO TREATMENT',
          active: true,
          label: 'NO TREATMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
        {
          code: 'STERI STRIPS OR SUTURES',
          active: true,
          label: 'STERI STRIPS OR SUTURES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
        {
          code: 'CLEANED AND DRESSED',
          active: true,
          label: 'CLEANED AND DRESSED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
        {
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44733',
        },
      ],
    },
    '44207': {
      id: '44207',
      active: true,
      code: 'DID SELF HARM METHOD INVOLVE SELF STRANGULATION',
      label: 'DID SELF HARM METHOD INVOLVE SELF STRANGULATION',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44583',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
      ],
    },
    '44214': {
      id: '44214',
      active: true,
      code: 'WAS RESUSCITATION REQUIRED',
      label: 'WAS RESUSCITATION REQUIRED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44944',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44944',
        },
      ],
    },
    '44244': {
      id: '44244',
      active: true,
      code: 'DID SELF HARM METHOD INVOLVE HANGING',
      label: 'DID SELF HARM METHOD INVOLVE HANGING',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44653',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
      ],
    },
    '44332': {
      id: '44332',
      active: true,
      code: 'WHO ADMINISTERED TREATMENT',
      label: 'WHO ADMINISTERED TREATMENT',
      multipleAnswers: true,
      answers: [
        {
          code: 'NON HEALTHCARE STAFF',
          active: true,
          label: 'NON HEALTHCARE STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
        {
          code: 'NURSE/HCO',
          active: true,
          label: 'NURSE/HCO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
        {
          code: 'MEDICAL OFFICER',
          active: true,
          label: 'MEDICAL OFFICER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
        {
          code: 'PARAMEDICS/AMBULANCE',
          active: true,
          label: 'PARAMEDICS/AMBULANCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
      ],
    },
    '44339': {
      id: '44339',
      active: true,
      code: 'OCCUPANCY',
      label: 'OCCUPANCY',
      multipleAnswers: false,
      answers: [
        {
          code: 'SINGLE',
          active: true,
          label: 'SINGLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
        {
          code: 'DOUBLE',
          active: true,
          label: 'DOUBLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
        {
          code: 'DOUBLE BUT ALONE',
          active: true,
          label: 'DOUBLE BUT ALONE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
        {
          code: 'MULTIPLE (3 OR  MORE)',
          active: true,
          label: 'MULTIPLE (3 OR  MORE)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
      ],
    },
    '44400': {
      id: '44400',
      active: true,
      code: 'WAS A F2052SH/ACCT OPEN',
      label: 'WAS A F2052SH/ACCT OPEN',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44435',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44435',
        },
      ],
    },
    '44435': {
      id: '44435',
      active: true,
      code: 'WHEN WAS THE LAST F2052SH/ACCT CLOSED',
      label: 'WHEN WAS THE LAST F2052SH/ACCT CLOSED',
      multipleAnswers: false,
      answers: [
        {
          code: 'WITHIN ONE MONTH',
          active: true,
          label: 'WITHIN ONE MONTH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44965',
        },
        {
          code: 'MORE THAN ONE MONTH',
          active: true,
          label: 'MORE THAN ONE MONTH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44965',
        },
        {
          code: 'NOT APPLICABLE',
          active: true,
          label: 'NOT APPLICABLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44965',
        },
      ],
    },
    '44511': {
      id: '44511',
      active: true,
      code: 'WAS TREATMENT ADMINISTERED',
      label: 'WAS TREATMENT ADMINISTERED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44332',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
      ],
    },
    '44552': {
      id: '44552',
      active: true,
      code: 'WAS ANY OTHER SELF HARM METHOD INVOLVED',
      label: 'WAS ANY OTHER SELF HARM METHOD INVOLVED',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45105',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
      ],
    },
    '44573': {
      id: '44573',
      active: true,
      code: 'SELF POISONING/OVERDOSE/SUBSTANCES/SWALLOWING',
      label: 'SELF POISONING/OVERDOSE/SUBSTANCES/SWALLOWING',
      multipleAnswers: true,
      answers: [
        {
          code: 'OWN MEDICATION',
          active: true,
          label: 'OWN MEDICATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          code: 'OTHER PERSONS MEDICATION',
          active: true,
          label: 'OTHER PERSONS MEDICATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          code: 'ILLEGAL DRUGS',
          active: true,
          label: 'ILLEGAL DRUGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          code: 'CLEANING MATERIALS',
          active: true,
          label: 'CLEANING MATERIALS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          code: 'RAZOR BLADES',
          active: true,
          label: 'RAZOR BLADES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          code: 'BATTERIES',
          active: true,
          label: 'BATTERIES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45167',
        },
      ],
    },
    '44583': {
      id: '44583',
      active: true,
      code: 'LIGATURE TYPE',
      label: 'LIGATURE TYPE',
      multipleAnswers: false,
      answers: [
        {
          code: 'BEDDING',
          active: true,
          label: 'BEDDING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          code: 'SHOELACES',
          active: true,
          label: 'SHOELACES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          code: 'TOWEL',
          active: true,
          label: 'TOWEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          code: 'CLOTHING',
          active: true,
          label: 'CLOTHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          code: 'BELT',
          active: true,
          label: 'BELT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44753',
        },
      ],
    },
    '44584': {
      id: '44584',
      active: true,
      code: 'TYPE OF HOSPITAL',
      label: 'TYPE OF HOSPITAL',
      multipleAnswers: false,
      answers: [
        {
          code: 'A AND E',
          active: true,
          label: 'A AND E',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
        {
          code: 'IN PATIENT (OVERNIGHT ONLY)',
          active: true,
          label: 'IN PATIENT (OVERNIGHT ONLY)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
        {
          code: 'IN PATIENT (OVER 24HR)',
          active: true,
          label: 'IN PATIENT (OVER 24HR)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
        {
          code: 'LIFE SUPPORT',
          active: true,
          label: 'LIFE SUPPORT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
      ],
    },
    '44643': {
      id: '44643',
      active: true,
      code: 'TYPE OF BURNING',
      label: 'TYPE OF BURNING',
      multipleAnswers: false,
      answers: [
        {
          code: 'SUPERFICIAL E.G. CIGARETTE',
          active: true,
          label: 'SUPERFICIAL E.G. CIGARETTE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44552',
        },
        {
          code: 'NON SUPERFICIAL CELL/SELF FIRE',
          active: true,
          label: 'NON SUPERFICIAL CELL/SELF FIRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44552',
        },
      ],
    },
    '44653': {
      id: '44653',
      active: true,
      code: 'WHAT WAS THE LIGATURE POINT',
      label: 'WHAT WAS THE LIGATURE POINT',
      multipleAnswers: false,
      answers: [
        {
          code: 'WINDOW',
          active: true,
          label: 'WINDOW',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          code: 'BED',
          active: true,
          label: 'BED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          code: 'DOOR',
          active: true,
          label: 'DOOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          code: 'PIPES',
          active: true,
          label: 'PIPES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          code: 'TOILET AREA',
          active: true,
          label: 'TOILET AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44718',
        },
      ],
    },
    '44718': {
      id: '44718',
      active: true,
      code: 'HANGING SELF STRANGULATION METHOD',
      label: 'HANGING SELF STRANGULATION METHOD',
      multipleAnswers: false,
      answers: [
        {
          code: 'FEET OFF FLOOR',
          active: true,
          label: 'FEET OFF FLOOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45020',
        },
        {
          code: 'KNEELING OR OTHER',
          active: true,
          label: 'KNEELING OR OTHER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45020',
        },
        {
          code: 'NEITHER OF ABOVE',
          active: true,
          label: 'NEITHER OF ABOVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45020',
        },
      ],
    },
    '44733': {
      id: '44733',
      active: true,
      code: 'DID SELF HARM INVOLVE SELF POISONING/ OVERDOSE/SWALLOWING OBJECTS',
      label: 'DID SELF HARM INVOLVE SELF POISONING/ OVERDOSE/SWALLOWING OBJECTS',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44573',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
      ],
    },
    '44753': {
      id: '44753',
      active: true,
      code: 'DID SELF HARM METHOD INVOLVE CUTTING',
      label: 'DID SELF HARM METHOD INVOLVE CUTTING',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44991',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
      ],
    },
    '44791': {
      id: '44791',
      active: true,
      code: 'WHAT WAS THE CELL TYPE',
      label: 'WHAT WAS THE CELL TYPE',
      multipleAnswers: false,
      answers: [
        {
          code: 'ORDINARY',
          active: true,
          label: 'ORDINARY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'GATED',
          active: true,
          label: 'GATED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'SAFE ANTI-LIGATURE',
          active: true,
          label: 'SAFE ANTI-LIGATURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'TIME OUT ROOM',
          active: true,
          label: 'TIME OUT ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'CARE SUITE',
          active: true,
          label: 'CARE SUITE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'UNFURNISHED/STRONG BOX',
          active: true,
          label: 'UNFURNISHED/STRONG BOX',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'WARD/DORM',
          active: true,
          label: 'WARD/DORM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44339',
        },
      ],
    },
    '44890': {
      id: '44890',
      active: true,
      code: 'TYPE OF IMPLEMENT USED',
      label: 'TYPE OF IMPLEMENT USED',
      multipleAnswers: false,
      answers: [
        {
          code: 'RAZOR',
          active: true,
          label: 'RAZOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44155',
        },
        {
          code: 'BROKEN GLASS',
          active: true,
          label: 'BROKEN GLASS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44155',
        },
        {
          code: 'PLASTIC MATERIAL',
          active: true,
          label: 'PLASTIC MATERIAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44155',
        },
        {
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44155',
        },
      ],
    },
    '44944': {
      id: '44944',
      active: true,
      code: 'WERE THEY ADMITTED TO HEALTHCARE',
      label: 'WERE THEY ADMITTED TO HEALTHCARE',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44954',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44954',
        },
        {
          code: 'ALREADY IN HEALTHCARE',
          active: true,
          label: 'ALREADY IN HEALTHCARE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44954',
        },
      ],
    },
    '44954': {
      id: '44954',
      active: true,
      code: 'DID THEY GO TO OUTSIDE HOSPITAL',
      label: 'DID THEY GO TO OUTSIDE HOSPITAL',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44584',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
      ],
    },
    '44965': {
      id: '44965',
      active: true,
      code: 'IS A F2052SH/ACCT OPEN NOW',
      label: 'IS A F2052SH/ACCT OPEN NOW',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44991': {
      id: '44991',
      active: true,
      code: 'LOCATION OF CUTS',
      label: 'LOCATION OF CUTS',
      multipleAnswers: true,
      answers: [
        {
          code: 'WRIST',
          active: true,
          label: 'WRIST',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          code: 'ARMS/LEGS',
          active: true,
          label: 'ARMS/LEGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          code: 'TORSO',
          active: true,
          label: 'TORSO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          code: 'THROAT',
          active: true,
          label: 'THROAT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44890',
        },
      ],
    },
    '45020': {
      id: '45020',
      active: true,
      code: 'LIGATURE TYPE',
      label: 'LIGATURE TYPE',
      multipleAnswers: false,
      answers: [
        {
          code: 'BEDDING',
          active: true,
          label: 'BEDDING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          code: 'SHOELACES',
          active: true,
          label: 'SHOELACES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          code: 'TOWEL',
          active: true,
          label: 'TOWEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          code: 'CLOTHING',
          active: true,
          label: 'CLOTHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          code: 'BELT',
          active: true,
          label: 'BELT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44207',
        },
      ],
    },
    '45051': {
      id: '45051',
      active: true,
      code: 'WHERE DID THE INCIDENT TAKE PLACE',
      label: 'WHERE DID THE INCIDENT TAKE PLACE',
      multipleAnswers: true,
      answers: [
        {
          code: 'ORDINARY',
          active: true,
          label: 'ORDINARY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'VPU/OTHER PROTECTED',
          active: true,
          label: 'VPU/OTHER PROTECTED',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'HEALTH CARE CENTRE',
          active: true,
          label: 'HEALTH CARE CENTRE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: "INDCT'N/RECP'N/1ST NIGHTCENTRE",
          active: true,
          label: "INDCT'N/RECP'N/1ST NIGHTCENTRE",
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'SEGREGATION UNIT',
          active: true,
          label: 'SEGREGATION UNIT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'DETOX UNIT',
          active: true,
          label: 'DETOX UNIT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'PRISON ESCORT VEHICLE',
          active: true,
          label: 'PRISON ESCORT VEHICLE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'COURT CELL',
          active: true,
          label: 'COURT CELL',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
      ],
    },
    '45105': {
      id: '45105',
      active: true,
      code: 'WHAT OTHER METHOD OF SELF HARM WAS INVOLVED',
      label: 'WHAT OTHER METHOD OF SELF HARM WAS INVOLVED',
      multipleAnswers: true,
      answers: [
        {
          code: 'HEAD BANGING',
          active: true,
          label: 'HEAD BANGING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          code: 'SUFFOCATION',
          active: true,
          label: 'SUFFOCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          code: 'WOUND',
          active: true,
          label: 'WOUND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          code: 'NOOSE LIGATURE MAKING',
          active: true,
          label: 'NOOSE LIGATURE MAKING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          code: 'OTHER',
          active: true,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44511',
        },
      ],
    },
    '45167': {
      id: '45167',
      active: true,
      code: 'DID SELF HARM METHOD INVOLVE BURNING',
      label: 'DID SELF HARM METHOD INVOLVE BURNING',
      multipleAnswers: false,
      answers: [
        {
          code: 'YES',
          active: true,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44643',
        },
        {
          code: 'NO',
          active: true,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44552',
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
      prisonerRole: 'PRESENT_AT_SCENE',
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

export default SELF_HARM

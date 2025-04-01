// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2025-04-01T22:59:33.188Z

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

export const SELF_HARM_1: IncidentTypeConfiguration = {
  incidentType: 'SELF_HARM_1',
  active: true,
  startingQuestionId: '45051',
  questions: {
    '44155': {
      id: '44155',
      active: true,
      code: 'TREATMENT REQUIRED FOLLOWING CUT SCRATCH',
      label: 'Treatment required following cut scratch',
      multipleAnswers: false,
      answers: [
        {
          id: '179012',
          code: 'NO TREATMENT',
          active: true,
          label: 'No treatment',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
        {
          id: '179014',
          code: 'STERI STRIPS OR SUTURES',
          active: true,
          label: 'Steri strips or sutures',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
        {
          id: '179011',
          code: 'CLEANED AND DRESSED',
          active: true,
          label: 'Cleaned and dressed',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44733',
        },
        {
          id: '179013',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'Did self harm method involve self strangulation?',
      multipleAnswers: false,
      answers: [
        {
          id: '179187',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44583',
        },
        {
          id: '179188',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Was resuscitation required?',
      multipleAnswers: false,
      answers: [
        {
          id: '179201',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44944',
        },
        {
          id: '179200',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Did self harm method involve hanging?',
      multipleAnswers: false,
      answers: [
        {
          id: '179302',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44653',
        },
        {
          id: '179303',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Who administered treatment?',
      multipleAnswers: true,
      answers: [
        {
          id: '179620',
          code: 'NON HEALTHCARE STAFF',
          active: true,
          label: 'Non healthcare staff',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
        {
          id: '179621',
          code: 'NURSE/HCO',
          active: true,
          label: 'Nurse/HCO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
        {
          id: '179619',
          code: 'MEDICAL OFFICER',
          active: true,
          label: 'Medical officer',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44214',
        },
        {
          id: '179622',
          code: 'PARAMEDICS/AMBULANCE',
          active: true,
          label: 'Paramedics/ambulance',
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
      label: 'Occupancy',
      multipleAnswers: false,
      answers: [
        {
          id: '179641',
          code: 'SINGLE',
          active: true,
          label: 'Single',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
        {
          id: '179638',
          code: 'DOUBLE',
          active: true,
          label: 'Double',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
        {
          id: '179639',
          code: 'DOUBLE BUT ALONE',
          active: true,
          label: 'Double but alone',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44244',
        },
        {
          id: '179640',
          code: 'MULTIPLE (3 OR  MORE)',
          active: true,
          label: 'Multiple (3 or more)',
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
      label: 'Was a F2052SH/ACCT open?',
      multipleAnswers: false,
      answers: [
        {
          id: '179843',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44435',
        },
        {
          id: '179842',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'When was the last F2052SH/ACCT closed?',
      multipleAnswers: false,
      answers: [
        {
          id: '179935',
          code: 'WITHIN ONE MONTH',
          active: true,
          label: 'Within one month',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44965',
        },
        {
          id: '179933',
          code: 'MORE THAN ONE MONTH',
          active: true,
          label: 'More than one month',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44965',
        },
        {
          id: '179934',
          code: 'NOT APPLICABLE',
          active: true,
          label: 'Not applicable',
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
      label: 'Was treatment administered?',
      multipleAnswers: false,
      answers: [
        {
          id: '180256',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44332',
        },
        {
          id: '180257',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Was any other self harm method involved?',
      multipleAnswers: false,
      answers: [
        {
          id: '180436',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45105',
        },
        {
          id: '180437',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Self poisoning/overdose/substances/swallowing',
      multipleAnswers: true,
      answers: [
        {
          id: '180498',
          code: 'OWN MEDICATION',
          active: true,
          label: 'Own medication',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          id: '180497',
          code: 'OTHER PERSONS MEDICATION',
          active: true,
          label: 'Other persons medication',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          id: '180495',
          code: 'ILLEGAL DRUGS',
          active: true,
          label: 'Illegal drugs',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          id: '180494',
          code: 'CLEANING MATERIALS',
          active: true,
          label: 'Cleaning materials',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          id: '180499',
          code: 'RAZOR BLADES',
          active: true,
          label: 'Razor blades',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          id: '180493',
          code: 'BATTERIES',
          active: true,
          label: 'Batteries',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45167',
        },
        {
          id: '180496',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'Ligature type',
      multipleAnswers: false,
      answers: [
        {
          id: '180526',
          code: 'BEDDING',
          active: true,
          label: 'Bedding',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          id: '180530',
          code: 'SHOELACES',
          active: true,
          label: 'Shoelaces',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          id: '180531',
          code: 'TOWEL',
          active: true,
          label: 'Towel',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          id: '180528',
          code: 'CLOTHING',
          active: true,
          label: 'Clothing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          id: '180527',
          code: 'BELT',
          active: true,
          label: 'Belt',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44753',
        },
        {
          id: '180529',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'Type of hospital',
      multipleAnswers: false,
      answers: [
        {
          id: '180532',
          code: 'A AND E',
          active: true,
          label: 'A&E',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
        {
          id: '180534',
          code: 'IN PATIENT (OVERNIGHT ONLY)',
          active: true,
          label: 'In patient (overnight only)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
        {
          id: '180533',
          code: 'IN PATIENT (OVER 24HR)',
          active: true,
          label: 'In patient (over 24hr)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44400',
        },
        {
          id: '180535',
          code: 'LIFE SUPPORT',
          active: true,
          label: 'Life support',
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
      label: 'Type of burning',
      multipleAnswers: false,
      answers: [
        {
          id: '180734',
          code: 'SUPERFICIAL E.G. CIGARETTE',
          active: true,
          label: 'Superficial e.g. cigarette',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44552',
        },
        {
          id: '180733',
          code: 'NON SUPERFICIAL CELL/SELF FIRE',
          active: true,
          label: 'Non superficial cell/self fire',
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
      label: 'What was the ligature point?',
      multipleAnswers: false,
      answers: [
        {
          id: '180760',
          code: 'WINDOW',
          active: true,
          label: 'Window',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          id: '180755',
          code: 'BED',
          active: true,
          label: 'Bed',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          id: '180756',
          code: 'DOOR',
          active: true,
          label: 'Door',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          id: '180758',
          code: 'PIPES',
          active: true,
          label: 'Pipes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          id: '180759',
          code: 'TOILET AREA',
          active: true,
          label: 'Toilet area',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44718',
        },
        {
          id: '180757',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'Hanging self strangulation method',
      multipleAnswers: false,
      answers: [
        {
          id: '180997',
          code: 'FEET OFF FLOOR',
          active: true,
          label: 'Feet off floor',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45020',
        },
        {
          id: '180998',
          code: 'KNEELING OR OTHER',
          active: true,
          label: 'Kneeling or other',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45020',
        },
        {
          id: '180999',
          code: 'NEITHER OF ABOVE',
          active: true,
          label: 'Neither of above',
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
      label: 'Did self harm involve self poisoning/ overdose/swallowing objects?',
      multipleAnswers: false,
      answers: [
        {
          id: '181062',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44573',
        },
        {
          id: '181063',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Did self harm method involve cutting?',
      multipleAnswers: false,
      answers: [
        {
          id: '181110',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44991',
        },
        {
          id: '181111',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'What was the cell type?',
      multipleAnswers: false,
      answers: [
        {
          id: '181230',
          code: 'ORDINARY',
          active: true,
          label: 'Ordinary',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          id: '181229',
          code: 'GATED',
          active: true,
          label: 'Gated',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          id: '181232',
          code: 'SAFE ANTI-LIGATURE',
          active: true,
          label: 'Safe anti-ligature',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          id: '181233',
          code: 'TIME OUT ROOM',
          active: true,
          label: 'Time out room',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          id: '181228',
          code: 'CARE SUITE',
          active: true,
          label: 'Care suite',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          id: '181234',
          code: 'UNFURNISHED/STRONG BOX',
          active: true,
          label: 'Unfurnished/strong box',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          id: '181235',
          code: 'WARD/DORM',
          active: true,
          label: 'Ward/dorm',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44339',
        },
        {
          id: '181231',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'Type of implement used',
      multipleAnswers: false,
      answers: [
        {
          id: '181555',
          code: 'RAZOR',
          active: true,
          label: 'Razor',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44155',
        },
        {
          id: '181552',
          code: 'BROKEN GLASS',
          active: true,
          label: 'Broken glass',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44155',
        },
        {
          id: '181554',
          code: 'PLASTIC MATERIAL',
          active: true,
          label: 'Plastic material',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44155',
        },
        {
          id: '181553',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'Were they admitted to healthcare?',
      multipleAnswers: false,
      answers: [
        {
          id: '181774',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44954',
        },
        {
          id: '181773',
          code: 'NO',
          active: true,
          label: 'No',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44954',
        },
        {
          id: '181772',
          code: 'ALREADY IN HEALTHCARE',
          active: true,
          label: 'Already in healthcare',
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
      label: 'Did they go to outside hospital?',
      multipleAnswers: false,
      answers: [
        {
          id: '181810',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44584',
        },
        {
          id: '181811',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Is a F2052SH/ACCT open now?',
      multipleAnswers: false,
      answers: [
        {
          id: '181836',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '181835',
          code: 'NO',
          active: true,
          label: 'No',
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
      label: 'Location of cuts',
      multipleAnswers: true,
      answers: [
        {
          id: '181933',
          code: 'WRIST',
          active: true,
          label: 'Wrist',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          id: '181929',
          code: 'ARMS/LEGS',
          active: true,
          label: 'Arms/legs',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          id: '181932',
          code: 'TORSO',
          active: true,
          label: 'Torso',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          id: '181931',
          code: 'THROAT',
          active: true,
          label: 'Throat',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44890',
        },
        {
          id: '181930',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'Ligature type',
      multipleAnswers: false,
      answers: [
        {
          id: '182015',
          code: 'BEDDING',
          active: true,
          label: 'Bedding',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          id: '182019',
          code: 'SHOELACES',
          active: true,
          label: 'Shoelaces',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          id: '182020',
          code: 'TOWEL',
          active: true,
          label: 'Towel',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          id: '182017',
          code: 'CLOTHING',
          active: true,
          label: 'Clothing',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          id: '182016',
          code: 'BELT',
          active: true,
          label: 'Belt',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44207',
        },
        {
          id: '182018',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'Where did the incident take place?',
      multipleAnswers: true,
      answers: [
        {
          id: '182179',
          code: 'ORDINARY',
          active: true,
          label: 'Ordinary',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          id: '182183',
          code: 'VPU/OTHER PROTECTED',
          active: true,
          label: 'VPU/other protected',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          id: '182177',
          code: 'HEALTH CARE CENTRE',
          active: true,
          label: 'Health care centre',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          id: '182178',
          code: "INDCT'N/RECP'N/1ST NIGHTCENTRE",
          active: true,
          label: "Indct'n/recp'n/1st nightcentre",
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          id: '182182',
          code: 'SEGREGATION UNIT',
          active: true,
          label: 'Segregation unit',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          id: '182176',
          code: 'DETOX UNIT',
          active: true,
          label: 'Detox unit',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          id: '182181',
          code: 'PRISON ESCORT VEHICLE',
          active: true,
          label: 'Prison escort vehicle',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          id: '182175',
          code: 'COURT CELL',
          active: true,
          label: 'Court cell',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44791',
        },
        {
          id: '182180',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'What other method of self harm was involved?',
      multipleAnswers: true,
      answers: [
        {
          id: '182366',
          code: 'HEAD BANGING',
          active: true,
          label: 'Head banging',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          id: '182368',
          code: 'SUFFOCATION',
          active: true,
          label: 'Suffocation',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          id: '182369',
          code: 'WOUND',
          active: true,
          label: 'Wound',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          id: '182367',
          code: 'NOOSE LIGATURE MAKING',
          active: true,
          label: 'Noose ligature making',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44511',
        },
        {
          id: '3901',
          code: 'OTHER',
          active: true,
          label: 'Other',
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
      label: 'Did self harm method involve burning?',
      multipleAnswers: false,
      answers: [
        {
          id: '182616',
          code: 'YES',
          active: true,
          label: 'Yes',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44643',
        },
        {
          id: '182617',
          code: 'NO',
          active: true,
          label: 'No',
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

export default SELF_HARM_1

// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:54.323Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_FIREARM_ETC: IncidentTypeConfiguration = {
  incidentType: 'OLD_FIREARM_ETC',
  active: false,
  startingQuestionId: '44776',
  questions: {
    '44123': {
      id: '44123',
      label: 'HOW WAS THE ITEM FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'TARGET SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44637',
        },
        {
          label: 'ROUTINE SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44980',
        },
        {
          label: 'CHANCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44980',
        },
      ],
    },
    '44160': {
      id: '44160',
      label: 'WHAT WAS THE COUNTRY OF MANUFACTURE OF THE SPRAY',
      multipleAnswers: false,
      answers: [
        {
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44526',
        },
      ],
    },
    '44172': {
      id: '44172',
      label: 'WAS A CHEMICAL INCAPACITANT SPRAY FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44548',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44526',
        },
      ],
    },
    '44189': {
      id: '44189',
      label: 'WAS THE FIREARM AN AUTOMATIC',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44846',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44846',
        },
      ],
    },
    '44193': {
      id: '44193',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN DURING THE INCIDENT?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44451',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44208': {
      id: '44208',
      label: 'IS THERE ANY SUSPICION OF TRAFFICKING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45049',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45049',
        },
      ],
    },
    '44209': {
      id: '44209',
      label: 'WAS THE SYSTEM RE-ACTIVATED LOCALLY OR BY THE SERVICE SUPPLIER',
      multipleAnswers: false,
      answers: [
        {
          label: 'LOCAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'SERVICE SUPPLIER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44323': {
      id: '44323',
      label: 'DESCRIBE WHAT WAS COMPROMISED AND BY WHOM',
      multipleAnswers: false,
      answers: [
        {
          label: 'DESCRIPTION',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44779',
        },
      ],
    },
    '44330': {
      id: '44330',
      label: 'HAS THE SERVICE SUPPLIER BEEN NOTIFIED OF A REPLACEMENT KEYWORD?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44755',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44755',
        },
      ],
    },
    '44390': {
      id: '44390',
      label: 'WHAT TYPE OF AMMUNITION WAS FOUND',
      multipleAnswers: true,
      answers: [
        {
          label: 'PISTOL/REVOLVER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44698',
        },
        {
          label: 'RIFLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44698',
        },
        {
          label: 'SHOTGUN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44698',
        },
        {
          label: 'HILTI GUN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44698',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44698',
        },
      ],
    },
    '44398': {
      id: '44398',
      label: 'WHAT TIME WAS THE SYSTEM SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER TIME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44964',
        },
      ],
    },
    '44430': {
      id: '44430',
      label: 'HOW MANY ROUNDS ETC WERE FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'NUMBER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44172',
        },
      ],
    },
    '44446': {
      id: '44446',
      label: 'HAS ANY PERSON BEEN ARRESTED BY THE POLICE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44524',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44208',
        },
      ],
    },
    '44451': {
      id: '44451',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN LOCALLY OR BY THE SERVICE SUPPLIER',
      multipleAnswers: false,
      answers: [
        {
          label: 'LOCAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44755',
        },
        {
          label: 'SERVICE SUPPLIER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44988',
        },
      ],
    },
    '44455': {
      id: '44455',
      label: 'WHAT WAS THE SOURCE OF THE INFORMATION/INTELLIGENCE',
      multipleAnswers: false,
      answers: [
        {
          label: 'PRISONER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44980',
        },
        {
          label: 'STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44980',
        },
        {
          label: 'POLICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44980',
        },
        {
          label: 'VISITOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44980',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44980',
        },
      ],
    },
    '44470': {
      id: '44470',
      label: 'WAS THE ITEM CONCEALED/DISCARDED',
      multipleAnswers: false,
      answers: [
        {
          label: 'CONCEALED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45102',
        },
        {
          label: 'DISCARDED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44123',
        },
      ],
    },
    '44473': {
      id: '44473',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44676',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44676',
        },
      ],
    },
    '44504': {
      id: '44504',
      label: 'WHAT WAS THE CALIBRE OF THE FIREARM',
      multipleAnswers: false,
      answers: [
        {
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44189',
        },
      ],
    },
    '44513': {
      id: '44513',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45000',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45000',
        },
      ],
    },
    '44524': {
      id: '44524',
      label: 'DESCRIBE THE PERSON ARRESTED',
      multipleAnswers: true,
      answers: [
        {
          label: 'PRISONER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44874',
        },
        {
          label: 'STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44874',
        },
        {
          label: 'SOCIAL VISITOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44874',
        },
        {
          label: 'OFFICIAL VISITOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44874',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44874',
        },
      ],
    },
    '44526': {
      id: '44526',
      label: 'WHERE WAS THE ITEM FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'ADMINISTRATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'ASSOCIATION AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'CHAPEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'DINING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'DORMITORY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'EXERCISE YARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'GATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'GYM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'RECEPTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'RECESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'SPECIAL UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'SHOWERS/CHANGING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'WING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'WITHIN PERIMETER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'ELSEWHERE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'FUNERAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'HOSPITAL OUTSIDE (PATIENT)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'HOSPITAL OUTSIDE (VISITING)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'OUTSIDE WORKING PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'SPORTSFIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'VEHICLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'WEDDING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'MAGISTRATES COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
        {
          label: 'CROWN COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44470',
        },
      ],
    },
    '44548': {
      id: '44548',
      label: 'DESCRIBE THE TYPE OF SPRAY',
      multipleAnswers: true,
      answers: [
        {
          label: 'C.N (CHLORACETOPHEONE)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44622',
        },
        {
          label: 'C.S (ORTHO..NITRILE)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44622',
        },
        {
          label: 'O.C (MACE/PEPPER)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44622',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44622',
        },
        {
          label: 'NOT KNOWN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44622',
        },
      ],
    },
    '44622': {
      id: '44622',
      label: 'WHAT WAS THE BRAND NAME OF THE SPRAY',
      multipleAnswers: false,
      answers: [
        {
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44160',
        },
      ],
    },
    '44624': {
      id: '44624',
      label: 'CAN ITEMS BE ATTRIBUTED TO A PARTICULAR PRISONER',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44692',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44446',
        },
      ],
    },
    '44637': {
      id: '44637',
      label: 'WAS THE SEARCH AS A RESULT OF INFORMATION/INTELLIGENCE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44455',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44980',
        },
      ],
    },
    '44676': {
      id: '44676',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '45026',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45026',
        },
      ],
    },
    '44692': {
      id: '44692',
      label: 'HAS THE PRISONER BEEN ENTERED ON THE INMATE INVOLVEMENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44446',
        },
        {
          label: 'NO',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44446',
        },
      ],
    },
    '44698': {
      id: '44698',
      label: 'WHAT WAS THE CALIBRE OF THE AMMUNITION',
      multipleAnswers: false,
      answers: [
        {
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44430',
        },
      ],
    },
    '44703': {
      id: '44703',
      label: 'WAS AMMUNITION FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44870',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44172',
        },
      ],
    },
    '44755': {
      id: '44755',
      label: 'INDICATE THE NATURE OF THE SHUT DOWN',
      multipleAnswers: true,
      answers: [
        {
          label: 'TELEPHONY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44398',
        },
        {
          label: 'IT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44398',
        },
      ],
    },
    '44776': {
      id: '44776',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44513',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45000',
        },
      ],
    },
    '44779': {
      id: '44779',
      label: 'WHEN WAS THE SYSTEM RE-ACTIVATED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER COMMENT AND DATE',
          commentRequired: true,
          dateRequired: true,
          nextQuestionId: '44209',
        },
      ],
    },
    '44820': {
      id: '44820',
      label: 'WAS THE SYSTEM COMPROMISED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44323',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44779',
        },
      ],
    },
    '44827': {
      id: '44827',
      label: 'WHAT PARTS OF A FIREARM WERE FOUND',
      multipleAnswers: true,
      answers: [
        {
          label: 'BARREL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44703',
        },
        {
          label: 'BUTT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44703',
        },
        {
          label: 'MAGAZINE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44703',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44703',
        },
      ],
    },
    '44832': {
      id: '44832',
      label: 'WAS THE KEYWORD REQUESTED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44330',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44755',
        },
      ],
    },
    '44846': {
      id: '44846',
      label: 'WHAT WAS THE NAME OF THE MANUFACTURER',
      multipleAnswers: false,
      answers: [
        {
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45001',
        },
      ],
    },
    '44870': {
      id: '44870',
      label: 'DESCRIBE THE AMMUNITION',
      multipleAnswers: true,
      answers: [
        {
          label: 'LIVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44390',
        },
        {
          label: 'BLANK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44390',
        },
        {
          label: 'DISABLED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44390',
        },
        {
          label: 'CARTRIDGE CASE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44390',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44390',
        },
      ],
    },
    '44874': {
      id: '44874',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44208',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44208',
        },
      ],
    },
    '44907': {
      id: '44907',
      label: 'WHO AUTHORISED THE SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44820',
        },
        {
          label: 'DEPUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44820',
        },
        {
          label: 'DUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44820',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44820',
        },
      ],
    },
    '44922': {
      id: '44922',
      label: 'WHICH DETECTION AIDS WERE USED',
      multipleAnswers: true,
      answers: [
        {
          label: 'METAL DETECTING PORTAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44624',
        },
        {
          label: 'HAND HELD METAL DETECTOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44624',
        },
        {
          label: 'X-RAY MACHINE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44624',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44624',
        },
      ],
    },
    '44928': {
      id: '44928',
      label: 'WERE DETECTION AIDS USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44922',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44624',
        },
      ],
    },
    '44964': {
      id: '44964',
      label: 'WAS THIS A FULL OR PARTIAL SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'FULL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44907',
        },
        {
          label: 'PARTIAL',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44907',
        },
      ],
    },
    '44980': {
      id: '44980',
      label: 'WERE SPECIALIST DOGS USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44928',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44928',
        },
      ],
    },
    '44988': {
      id: '44988',
      label: 'QUOTE THE VANTIVE CASE NUMBER',
      multipleAnswers: false,
      answers: [
        {
          label: 'NUMBER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44832',
        },
      ],
    },
    '45000': {
      id: '45000',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45005',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45005',
        },
      ],
    },
    '45001': {
      id: '45001',
      label: 'WAS THE FIREARM COMPLETE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44703',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44827',
        },
      ],
    },
    '45005': {
      id: '45005',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44473',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44473',
        },
      ],
    },
    '45026': {
      id: '45026',
      label: 'WAS A FIREARM FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45029',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44703',
        },
      ],
    },
    '45029': {
      id: '45029',
      label: 'WHAT TYPE OF FIREARM WAS FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'PISTOL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45119',
        },
        {
          label: 'REVOLVER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45119',
        },
        {
          label: 'RIFLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45119',
        },
        {
          label: 'SHOTGUN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45119',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45119',
        },
      ],
    },
    '45049': {
      id: '45049',
      label: 'WHO NOW HAS CUSTODY OF THE ITEMS',
      multipleAnswers: false,
      answers: [
        {
          label: 'PRISON',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44193',
        },
        {
          label: 'POLICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44193',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44193',
        },
      ],
    },
    '45056': {
      id: '45056',
      label: 'DESCRIBE THE PERSON',
      multipleAnswers: false,
      answers: [
        {
          label: 'PRISONER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44123',
        },
        {
          label: 'STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44123',
        },
        {
          label: 'SOCIAL VISITOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44123',
        },
        {
          label: 'OFFICIAL VISITOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44123',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44123',
        },
      ],
    },
    '45102': {
      id: '45102',
      label: 'WHERE WAS THE ITEM CONCEALED',
      multipleAnswers: false,
      answers: [
        {
          label: 'ON A PERSON',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45056',
        },
        {
          label: 'BURIED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44123',
        },
        {
          label: 'IN I/P PROPERTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44123',
        },
        {
          label: 'IN STORED PROPERTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44123',
        },
        {
          label: 'IN CELL FURNITURE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44123',
        },
        {
          label: 'IN BUILDING FABRIC',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44123',
        },
        {
          label: 'STORES ITEMS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44123',
        },
        {
          label: 'DELIVERED FOODS/PARCELS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44123',
        },
        {
          label: 'VEHICLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44123',
        },
        {
          label: 'ELSEWHERE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44123',
        },
      ],
    },
    '45119': {
      id: '45119',
      label: 'DESCRIBE THE FIREARM',
      multipleAnswers: false,
      answers: [
        {
          label: 'REAL (FUNCTIONAL)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44504',
        },
        {
          label: 'REAL (NON-FUNCTIONAL)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44504',
        },
        {
          label: 'REPLICA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44504',
        },
        {
          label: 'HOME MADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44504',
        },
        {
          label: 'TOY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44504',
        },
      ],
    },
  },
} as const

export default OLD_FIREARM_ETC

// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:45.511Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_DRUGS: IncidentTypeConfiguration = {
  incidentType: 'OLD_DRUGS',
  active: false,
  startingQuestionId: '44835',
  questions: {
    '44179': {
      id: '44179',
      label: 'WAS A VISITOR SUSPECTED OF INVOLVEMENT AND ARRESTED BY THE POLICE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44899',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44396',
        },
      ],
    },
    '44204': {
      id: '44204',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44682',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44682',
        },
      ],
    },
    '44205': {
      id: '44205',
      label: 'DESCRIBE THE DRUG FOUND',
      multipleAnswers: true,
      answers: [
        {
          label: 'HEROIN',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          label: 'COCAINE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          label: 'LSD',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          label: 'AMPHETAMINES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          label: 'BARBITURATES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          label: 'CANNABIS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          label: 'CANNABIS PLANT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          label: 'CRACK',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          label: 'TRANQUILISERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
      ],
    },
    '44219': {
      id: '44219',
      label: 'WAS HOSPITALISATION REQUIRED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45057',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44316',
        },
      ],
    },
    '44224': {
      id: '44224',
      label: 'DESCRIBE DRUG EQUIPMENT FOUND',
      multipleAnswers: true,
      answers: [
        {
          label: 'AUTHENTIC SYRINGE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
        {
          label: 'IMPROVISED SYRINGE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
        {
          label: 'AUTHENTIC NEEDLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
        {
          label: 'IMPROVISED NEEDLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
        {
          label: 'PIPE(S)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
        {
          label: 'ROACH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
        {
          label: 'OTHER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
      ],
    },
    '44243': {
      id: '44243',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44502',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44557',
        },
      ],
    },
    '44316': {
      id: '44316',
      label: 'IS THE LOCATION OF THE INCIDENT KNOWN',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44700',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
      ],
    },
    '44396': {
      id: '44396',
      label: 'WAS A DRUG FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44649',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44821',
        },
      ],
    },
    '44408': {
      id: '44408',
      label: 'DESCRIBE HOW THE DRUG OR EQUIPMENT WAS FOUND',
      multipleAnswers: true,
      answers: [
        {
          label: 'SPECIAL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          label: 'STRIP SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          label: 'CELL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          label: 'DOG SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          label: 'OTHER SEARCH (INMATE)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          label: 'OTHER SEARCH (VISITOR)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          label: 'OTHER SEARCH (PREMISES)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          label: 'INFORMATION RECEIVED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          label: 'SUBSTANCE OBSERVED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          label: 'UNUSUAL BEHAVIOUR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45097',
        },
      ],
    },
    '44458': {
      id: '44458',
      label: 'DESCRIBE THE TYPE OF TEMPORARY RELEASE',
      multipleAnswers: false,
      answers: [
        {
          label: 'COMPASSIONATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'FACILITY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'RESETTLEMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'COMMUNITY VISIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44502': {
      id: '44502',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44557',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44557',
        },
      ],
    },
    '44508': {
      id: '44508',
      label: 'ENTER DESCRIPTION OF PERSON HOSPITALISED',
      multipleAnswers: true,
      answers: [
        {
          label: 'OFFICER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44316',
        },
        {
          label: 'PRISONER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44316',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44316',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44316',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44316',
        },
      ],
    },
    '44557': {
      id: '44557',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44664',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44664',
        },
      ],
    },
    '44635': {
      id: '44635',
      label: 'HOW WAS THE SUBSTANCE ANALYSED',
      multipleAnswers: false,
      answers: [
        {
          label: 'LOCAL WITH BDH KIT OR SIMILAR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44982',
        },
        {
          label: 'FORENSIC LABORATORY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44982',
        },
      ],
    },
    '44649': {
      id: '44649',
      label: 'WAS THE SUBSTANCE FOUND ANALYSED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44635',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44982',
        },
      ],
    },
    '44664': {
      id: '44664',
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44204',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44204',
        },
      ],
    },
    '44682': {
      id: '44682',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44792',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44792',
        },
      ],
    },
    '44700': {
      id: '44700',
      label: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'ADMINISTRATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'ASSOCIATION AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'CHAPEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'DINING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'DORMITORY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'EXERCISE YARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'GATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'GYM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'RECEPTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'RECESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'SPECIAL UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'SHOWERS/CHANGING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'WING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'WITHIN PERIMETER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'ELSEWHERE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'FUNERAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'HOSPITAL OUTSIDE (PATIENT)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'HOSPITAL OUTSIDE (VISITING)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'OUTSIDE WORKING PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'SPORTS FIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'VEHICLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'WEDDINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'MAGISTRATES COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          label: 'CROWN COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
      ],
    },
    '44765': {
      id: '44765',
      label: 'IS THIS INCIDENT ASSOCIATED WITH AN ASSAULT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44219',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44219',
        },
      ],
    },
    '44792': {
      id: '44792',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44765',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44765',
        },
      ],
    },
    '44795': {
      id: '44795',
      label: 'DESCRIBE THE DRUG/EQUIPMENT METHOD OF ENTRY INTO THE ESTABLISHMENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'PRISONER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45008',
        },
        {
          label: 'VISITOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45168',
        },
        {
          label: 'THROWN IN',
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
    '44807': {
      id: '44807',
      label: 'TO WHICH POLICE STATION WAS THE VISITOR TAKEN TO',
      multipleAnswers: false,
      answers: [
        {
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44396',
        },
      ],
    },
    '44818': {
      id: '44818',
      label: 'TO WHICH POLICE STATION ARE SEIZED DRUGS SENT FOR DESTRUCTION',
      multipleAnswers: false,
      answers: [
        {
          label: 'NAME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44408',
        },
      ],
    },
    '44821': {
      id: '44821',
      label: 'WAS DRUG EQUIPMENT FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44224',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
      ],
    },
    '44835': {
      id: '44835',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44243',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44557',
        },
      ],
    },
    '44899': {
      id: '44899',
      label: 'DESCRIBE CIRCUMSTANCES OF VISITORS ARREST',
      multipleAnswers: false,
      answers: [
        {
          label: 'BEFORE ENTERING PRISON',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44807',
        },
        {
          label: 'AFTER ENTERING PRISON',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44807',
        },
      ],
    },
    '44982': {
      id: '44982',
      label: 'WAS THE SUBSTANCE A DRUG',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44205',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44821',
        },
      ],
    },
    '45008': {
      id: '45008',
      label: 'WERE THE DRUGS OBTAINED ON TEMPORARY RELEASE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44458',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '45057': {
      id: '45057',
      label: 'DESCRIBE THE REASON FOR HOSPITALISATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44508',
        },
      ],
    },
    '45097': {
      id: '45097',
      label: 'IS THE METHOD OF ENTRY OF DRUG/EQUIPMENT INTO THE ESTABLISHMENT KNOWN',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44795',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '45168': {
      id: '45168',
      label: 'DESCRIBE THE VISITOR',
      multipleAnswers: false,
      answers: [
        {
          label: 'RELATIVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45008',
        },
        {
          label: 'FRIEND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45008',
        },
        {
          label: 'OFFICIAL VISITOR',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45008',
        },
      ],
    },
  },
} as const

export default OLD_DRUGS

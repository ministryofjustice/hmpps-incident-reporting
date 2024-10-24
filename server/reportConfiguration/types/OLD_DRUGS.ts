// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-10-15T17:17:27.023Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const OLD_DRUGS: IncidentTypeConfiguration = {
  incidentType: 'OLD_DRUGS',
  active: false,
  startingQuestionId: '44835',
  questions: {
    '44179': {
      id: '44179',
      active: false,
      code: 'WAS A VISITOR SUSPECTED OF INVOLVEMENT AND ARRESTED BY THE POLICE',
      label: 'WAS A VISITOR SUSPECTED OF INVOLVEMENT AND ARRESTED BY THE POLICE',
      multipleAnswers: false,
      answers: [
        {
          id: '179087',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44899',
        },
        {
          id: '179088',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44396',
        },
      ],
    },
    '44204': {
      id: '44204',
      active: false,
      code: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          id: '179174',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44682',
        },
        {
          id: '179173',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44682',
        },
      ],
    },
    '44205': {
      id: '44205',
      active: false,
      code: 'DESCRIBE THE DRUG FOUND',
      label: 'DESCRIBE THE DRUG FOUND',
      multipleAnswers: true,
      answers: [
        {
          id: '179181',
          code: 'HEROIN',
          active: false,
          label: 'HEROIN',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          id: '179179',
          code: 'COCAINE',
          active: false,
          label: 'COCAINE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          id: '179182',
          code: 'LSD',
          active: false,
          label: 'LSD',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          id: '179175',
          code: 'AMPHETAMINES',
          active: false,
          label: 'AMPHETAMINES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          id: '179176',
          code: 'BARBITURATES',
          active: false,
          label: 'BARBITURATES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          id: '179177',
          code: 'CANNABIS',
          active: false,
          label: 'CANNABIS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          id: '179178',
          code: 'CANNABIS PLANT',
          active: false,
          label: 'CANNABIS PLANT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          id: '179180',
          code: 'CRACK',
          active: false,
          label: 'CRACK',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          id: '179184',
          code: 'TRANQUILISERS',
          active: false,
          label: 'TRANQUILISERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
        {
          id: '179183',
          code: 'OTHER',
          active: false,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44821',
        },
      ],
    },
    '44219': {
      id: '44219',
      active: false,
      code: 'WAS HOSPITALISATION REQUIRED',
      label: 'WAS HOSPITALISATION REQUIRED',
      multipleAnswers: false,
      answers: [
        {
          id: '179211',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45057',
        },
        {
          id: '179212',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44316',
        },
      ],
    },
    '44224': {
      id: '44224',
      active: false,
      code: 'DESCRIBE DRUG EQUIPMENT FOUND',
      label: 'DESCRIBE DRUG EQUIPMENT FOUND',
      multipleAnswers: true,
      answers: [
        {
          id: '179222',
          code: 'AUTHENTIC SYRINGE',
          active: false,
          label: 'AUTHENTIC SYRINGE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
        {
          id: '179224',
          code: 'IMPROVISED SYRINGE',
          active: false,
          label: 'IMPROVISED SYRINGE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
        {
          id: '179221',
          code: 'AUTHENTIC NEEDLE',
          active: false,
          label: 'AUTHENTIC NEEDLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
        {
          id: '179223',
          code: 'IMPROVISED NEEDLE',
          active: false,
          label: 'IMPROVISED NEEDLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
        {
          id: '179226',
          code: 'PIPE(S)',
          active: false,
          label: 'PIPE(S)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
        {
          id: '179227',
          code: 'ROACH',
          active: false,
          label: 'ROACH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
        {
          id: '179225',
          code: 'OTHER',
          active: false,
          label: 'OTHER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
      ],
    },
    '44243': {
      id: '44243',
      active: false,
      code: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          id: '179300',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44502',
        },
        {
          id: '179301',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44557',
        },
      ],
    },
    '44316': {
      id: '44316',
      active: false,
      code: 'IS THE LOCATION OF THE INCIDENT KNOWN',
      label: 'IS THE LOCATION OF THE INCIDENT KNOWN',
      multipleAnswers: false,
      answers: [
        {
          id: '179549',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44700',
        },
        {
          id: '179550',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
      ],
    },
    '44396': {
      id: '44396',
      active: false,
      code: 'WAS A DRUG FOUND',
      label: 'WAS A DRUG FOUND',
      multipleAnswers: false,
      answers: [
        {
          id: '179835',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44649',
        },
        {
          id: '179836',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44821',
        },
      ],
    },
    '44408': {
      id: '44408',
      active: false,
      code: 'DESCRIBE HOW THE DRUG OR EQUIPMENT WAS FOUND',
      label: 'DESCRIBE HOW THE DRUG OR EQUIPMENT WAS FOUND',
      multipleAnswers: true,
      answers: [
        {
          id: '179873',
          code: 'SPECIAL SEARCH',
          active: false,
          label: 'SPECIAL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          id: '179874',
          code: 'STRIP SEARCH',
          active: false,
          label: 'STRIP SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          id: '179866',
          code: 'CELL SEARCH',
          active: false,
          label: 'CELL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          id: '179867',
          code: 'DOG SEARCH',
          active: false,
          label: 'DOG SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          id: '179870',
          code: 'OTHER SEARCH (INMATE)',
          active: false,
          label: 'OTHER SEARCH (INMATE)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          id: '179872',
          code: 'OTHER SEARCH (VISITOR)',
          active: true,
          label: 'OTHER SEARCH (VISITOR)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          id: '179871',
          code: 'OTHER SEARCH (PREMISES)',
          active: false,
          label: 'OTHER SEARCH (PREMISES)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          id: '179868',
          code: 'INFORMATION RECEIVED',
          active: false,
          label: 'INFORMATION RECEIVED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          id: '179875',
          code: 'SUBSTANCE OBSERVED',
          active: false,
          label: 'SUBSTANCE OBSERVED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          id: '179876',
          code: 'UNUSUAL BEHAVIOUR',
          active: false,
          label: 'UNUSUAL BEHAVIOUR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45097',
        },
        {
          id: '179869',
          code: 'OTHER',
          active: false,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45097',
        },
      ],
    },
    '44458': {
      id: '44458',
      active: false,
      code: 'DESCRIBE THE TYPE OF TEMPORARY RELEASE',
      label: 'DESCRIBE THE TYPE OF TEMPORARY RELEASE',
      multipleAnswers: false,
      answers: [
        {
          id: '180009',
          code: 'COMPASSIONATE',
          active: false,
          label: 'COMPASSIONATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '180010',
          code: 'FACILITY',
          active: false,
          label: 'FACILITY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '180011',
          code: 'RESETTLEMENT',
          active: false,
          label: 'RESETTLEMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '180008',
          code: 'COMMUNITY VISIT',
          active: false,
          label: 'COMMUNITY VISIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44502': {
      id: '44502',
      active: false,
      code: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          id: '180231',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44557',
        },
        {
          id: '180230',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44557',
        },
      ],
    },
    '44508': {
      id: '44508',
      active: false,
      code: 'ENTER DESCRIPTION OF PERSON HOSPITALISED',
      label: 'ENTER DESCRIPTION OF PERSON HOSPITALISED',
      multipleAnswers: true,
      answers: [
        {
          id: '180249',
          code: 'OFFICER',
          active: false,
          label: 'OFFICER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44316',
        },
        {
          id: '180251',
          code: 'PRISONER',
          active: false,
          label: 'PRISONER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44316',
        },
        {
          id: '180247',
          code: 'CIVILIAN GRADES',
          active: false,
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44316',
        },
        {
          id: '180250',
          code: 'POLICE',
          active: false,
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44316',
        },
        {
          id: '180248',
          code: 'EXTERNAL CIVILIANS',
          active: false,
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44316',
        },
      ],
    },
    '44557': {
      id: '44557',
      active: false,
      code: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          id: '180458',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44664',
        },
        {
          id: '180457',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44664',
        },
      ],
    },
    '44635': {
      id: '44635',
      active: false,
      code: 'HOW WAS THE SUBSTANCE ANALYSED',
      label: 'HOW WAS THE SUBSTANCE ANALYSED',
      multipleAnswers: false,
      answers: [
        {
          id: '180710',
          code: 'LOCAL WITH BDH KIT OR SIMILAR',
          active: false,
          label: 'LOCAL WITH BDH KIT OR SIMILAR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44982',
        },
        {
          id: '180709',
          code: 'FORENSIC LABORATORY',
          active: false,
          label: 'FORENSIC LABORATORY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44982',
        },
      ],
    },
    '44649': {
      id: '44649',
      active: false,
      code: 'WAS THE SUBSTANCE FOUND ANALYSED',
      label: 'WAS THE SUBSTANCE FOUND ANALYSED',
      multipleAnswers: false,
      answers: [
        {
          id: '180746',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44635',
        },
        {
          id: '180747',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44982',
        },
      ],
    },
    '44664': {
      id: '44664',
      active: false,
      code: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          id: '180804',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44204',
        },
        {
          id: '180803',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44204',
        },
      ],
    },
    '44682': {
      id: '44682',
      active: false,
      code: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          id: '180851',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44792',
        },
        {
          id: '180850',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44792',
        },
      ],
    },
    '44700': {
      id: '44700',
      active: false,
      code: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      label: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          id: '180922',
          code: 'ADMINISTRATION',
          active: false,
          label: 'ADMINISTRATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180923',
          code: 'ASSOCIATION AREA',
          active: false,
          label: 'ASSOCIATION AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180924',
          code: 'CELL',
          active: false,
          label: 'CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180925',
          code: 'CHAPEL',
          active: false,
          label: 'CHAPEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180927',
          code: 'DINING ROOM',
          active: false,
          label: 'DINING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180928',
          code: 'DORMITORY',
          active: false,
          label: 'DORMITORY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180929',
          code: 'EDUCATION',
          active: false,
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180931',
          code: 'EXERCISE YARD',
          active: false,
          label: 'EXERCISE YARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180933',
          code: 'GATE',
          active: false,
          label: 'GATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180934',
          code: 'GYM',
          active: false,
          label: 'GYM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180935',
          code: 'HEALTH CARE CENTRE',
          active: false,
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180938',
          code: 'KITCHEN',
          active: false,
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180940',
          code: 'OFFICE',
          active: false,
          label: 'OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180942',
          code: 'RECEPTION',
          active: false,
          label: 'RECEPTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180943',
          code: 'RECESS',
          active: false,
          label: 'RECESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180944',
          code: 'SEGREGATION UNIT',
          active: false,
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180946',
          code: 'SPECIAL UNIT',
          active: false,
          label: 'SPECIAL UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180945',
          code: 'SHOWERS/CHANGING ROOM',
          active: false,
          label: 'SHOWERS/CHANGING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180949',
          code: 'VISITS',
          active: false,
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180951',
          code: 'WING',
          active: false,
          label: 'WING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180953',
          code: 'WORKS DEPARTMENT',
          active: false,
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180954',
          code: 'WORKSHOP',
          active: false,
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180952',
          code: 'WITHIN PERIMETER',
          active: false,
          label: 'WITHIN PERIMETER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180930',
          code: 'ELSEWHERE',
          active: false,
          label: 'ELSEWHERE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180932',
          code: 'FUNERAL',
          active: false,
          label: 'FUNERAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180936',
          code: 'HOSPITAL OUTSIDE (PATIENT)',
          active: false,
          label: 'HOSPITAL OUTSIDE (PATIENT)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180937',
          code: 'HOSPITAL OUTSIDE (VISITING)',
          active: false,
          label: 'HOSPITAL OUTSIDE (VISITING)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180941',
          code: 'OUTSIDE WORKING PARTY',
          active: false,
          label: 'OUTSIDE WORKING PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180947',
          code: 'SPORTS FIELD',
          active: false,
          label: 'SPORTS FIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180948',
          code: 'VEHICLE',
          active: false,
          label: 'VEHICLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180950',
          code: 'WEDDINGS',
          active: false,
          label: 'WEDDINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180939',
          code: 'MAGISTRATES COURT',
          active: false,
          label: 'MAGISTRATES COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
        {
          id: '180926',
          code: 'CROWN COURT',
          active: false,
          label: 'CROWN COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44179',
        },
      ],
    },
    '44765': {
      id: '44765',
      active: false,
      code: 'IS THIS INCIDENT ASSOCIATED WITH AN ASSAULT',
      label: 'IS THIS INCIDENT ASSOCIATED WITH AN ASSAULT',
      multipleAnswers: false,
      answers: [
        {
          id: '181144',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44219',
        },
        {
          id: '181143',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44219',
        },
      ],
    },
    '44792': {
      id: '44792',
      active: false,
      code: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          id: '181237',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44765',
        },
        {
          id: '181236',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44765',
        },
      ],
    },
    '44795': {
      id: '44795',
      active: false,
      code: 'DESCRIBE THE DRUG/EQUIPMENT METHOD OF ENTRY INTO THE ESTABLISHMENT',
      label: 'DESCRIBE THE DRUG/EQUIPMENT METHOD OF ENTRY INTO THE ESTABLISHMENT',
      multipleAnswers: false,
      answers: [
        {
          id: '181246',
          code: 'PRISONER',
          active: false,
          label: 'PRISONER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45008',
        },
        {
          id: '181245',
          code: 'VISITOR',
          active: false,
          label: 'VISITOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45168',
        },
        {
          id: '181248',
          code: 'THROWN IN',
          active: false,
          label: 'THROWN IN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          id: '181247',
          code: 'OTHER',
          active: false,
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44807': {
      id: '44807',
      active: false,
      code: 'TO WHICH POLICE STATION WAS THE VISITOR TAKEN TO',
      label: 'TO WHICH POLICE STATION WAS THE VISITOR TAKEN TO',
      multipleAnswers: false,
      answers: [
        {
          id: '181274',
          code: 'SPECIFY',
          active: false,
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44396',
        },
      ],
    },
    '44818': {
      id: '44818',
      active: false,
      code: 'TO WHICH POLICE STATION ARE SEIZED DRUGS SENT FOR DESTRUCTION',
      label: 'TO WHICH POLICE STATION ARE SEIZED DRUGS SENT FOR DESTRUCTION',
      multipleAnswers: false,
      answers: [
        {
          id: '181299',
          code: 'NAME',
          active: false,
          label: 'NAME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44408',
        },
      ],
    },
    '44821': {
      id: '44821',
      active: false,
      code: 'WAS DRUG EQUIPMENT FOUND',
      label: 'WAS DRUG EQUIPMENT FOUND',
      multipleAnswers: false,
      answers: [
        {
          id: '181304',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44224',
        },
        {
          id: '181305',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44818',
        },
      ],
    },
    '44835': {
      id: '44835',
      active: false,
      code: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          id: '181335',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44243',
        },
        {
          id: '181336',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44557',
        },
      ],
    },
    '44899': {
      id: '44899',
      active: false,
      code: 'DESCRIBE CIRCUMSTANCES OF VISITORS ARREST',
      label: 'DESCRIBE CIRCUMSTANCES OF VISITORS ARREST',
      multipleAnswers: false,
      answers: [
        {
          id: '181579',
          code: 'BEFORE ENTERING PRISON',
          active: false,
          label: 'BEFORE ENTERING PRISON',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44807',
        },
        {
          id: '181578',
          code: 'AFTER ENTERING PRISON',
          active: false,
          label: 'AFTER ENTERING PRISON',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44807',
        },
      ],
    },
    '44982': {
      id: '44982',
      active: false,
      code: 'WAS THE SUBSTANCE A DRUG',
      label: 'WAS THE SUBSTANCE A DRUG',
      multipleAnswers: false,
      answers: [
        {
          id: '181908',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44205',
        },
        {
          id: '181909',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44821',
        },
      ],
    },
    '45008': {
      id: '45008',
      active: false,
      code: 'WERE THE DRUGS OBTAINED ON TEMPORARY RELEASE',
      label: 'WERE THE DRUGS OBTAINED ON TEMPORARY RELEASE',
      multipleAnswers: false,
      answers: [
        {
          id: '181976',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44458',
        },
        {
          id: '181977',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '45057': {
      id: '45057',
      active: false,
      code: 'DESCRIBE THE REASON FOR HOSPITALISATION',
      label: 'DESCRIBE THE REASON FOR HOSPITALISATION',
      multipleAnswers: false,
      answers: [
        {
          id: '182213',
          code: 'SPECIFY',
          active: false,
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44508',
        },
      ],
    },
    '45097': {
      id: '45097',
      active: false,
      code: 'IS THE METHOD OF ENTRY OF DRUG/EQUIPMENT INTO THE ESTABLISHMENT KNOWN',
      label: 'IS THE METHOD OF ENTRY OF DRUG/EQUIPMENT INTO THE ESTABLISHMENT KNOWN',
      multipleAnswers: false,
      answers: [
        {
          id: '182335',
          code: 'YES',
          active: false,
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44795',
        },
        {
          id: '182336',
          code: 'NO',
          active: false,
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '45168': {
      id: '45168',
      active: false,
      code: 'DESCRIBE THE VISITOR',
      label: 'DESCRIBE THE VISITOR',
      multipleAnswers: false,
      answers: [
        {
          id: '182620',
          code: 'RELATIVE',
          active: false,
          label: 'RELATIVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45008',
        },
        {
          id: '182618',
          code: 'FRIEND',
          active: false,
          label: 'FRIEND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45008',
        },
        {
          id: '182619',
          code: 'OFFICIAL VISITOR',
          active: false,
          label: 'OFFICIAL VISITOR',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45008',
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
      prisonerRole: 'IN_POSSESSION',
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

export default OLD_DRUGS

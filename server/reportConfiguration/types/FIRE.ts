// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:53.763Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const FIRE: IncidentTypeConfiguration = {
  incidentType: 'FIRE',
  active: true,
  startingQuestionId: '44668',
  questions: {
    '44131': {
      id: '44131',
      label: 'HAS THE SERVICE SUPPLIER BEEN NOTIFIED OF A REPLACEMENT KEYWORD?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45084',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45084',
        },
      ],
    },
    '44154': {
      id: '44154',
      label: 'QUOTE THE VANTIVE CASE NUMBER',
      multipleAnswers: false,
      answers: [
        {
          label: 'NUMBER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44202',
        },
      ],
    },
    '44158': {
      id: '44158',
      label: 'HOW LONG DID IT TAKE THE FIRE BRIGADE TO ARRIVE',
      multipleAnswers: false,
      answers: [
        {
          label: '5 MINUTES AND LESS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45064',
        },
        {
          label: '5 - 10 MINUTES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45064',
        },
        {
          label: '10 - 15 MINUTES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45064',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45064',
        },
      ],
    },
    '44176': {
      id: '44176',
      label: 'WHEN WAS THE SYSTEM RE-ACTIVATED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER COMMENT AND DATE',
          commentRequired: true,
          dateRequired: true,
          nextQuestionId: '44424',
        },
      ],
    },
    '44181': {
      id: '44181',
      label: 'DID ANYONE DIE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44520',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45055',
        },
      ],
    },
    '44194': {
      id: '44194',
      label: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'ADMINISTRATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'ASSOCIATION AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'CHAPEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'DINING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'DORMITORY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'EXERCISE YARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'GATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'GYM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'RECEPTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'RECESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'SPECIAL UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'SHOWERS/CHANGING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'WING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'WITHIN PERIMETER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'ELSEWHERE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'FUNERAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'HOSPITAL OUTSIDE (PATIENT)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'HOSPITAL OUTSIDE (VISITING)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'OUTSIDE WORKING PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'SPORTS FIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'VEHICLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'WEDDINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'MAGISTRATES COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
        {
          label: 'CROWN COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
      ],
    },
    '44202': {
      id: '44202',
      label: 'WAS THE KEYWORD REQUESTED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44131',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45084',
        },
      ],
    },
    '44232': {
      id: '44232',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44314',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44314',
        },
      ],
    },
    '44264': {
      id: '44264',
      label: 'WAS SHORT DURATION BREATHING APPARATUS USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45058',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45058',
        },
      ],
    },
    '44268': {
      id: '44268',
      label: 'WHO RAISED THE ALARM',
      multipleAnswers: false,
      answers: [
        {
          label: 'STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44342',
        },
        {
          label: 'PRISONER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44342',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44342',
        },
      ],
    },
    '44272': {
      id: '44272',
      label: 'DO YOU KNOW WHERE THE FIRE STARTED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44194',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44732',
        },
      ],
    },
    '44287': {
      id: '44287',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45069',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45069',
        },
      ],
    },
    '44314': {
      id: '44314',
      label: "IS THE INCIDENT SUBJECT TO A GOVERNOR'S ADJUDICATION",
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44287',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44287',
        },
      ],
    },
    '44342': {
      id: '44342',
      label: 'WERE FIRE EXTINGUISHERS USED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44454',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44945',
        },
      ],
    },
    '44354': {
      id: '44354',
      label: 'ESTIMATED COST OF DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER AMOUNT IN POUND STERLING',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44744',
        },
      ],
    },
    '44410': {
      id: '44410',
      label: 'DESCRIBE WHAT WAS COMPROMISED AND BY WHOM',
      multipleAnswers: false,
      answers: [
        {
          label: 'DESCRIPTION',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44176',
        },
      ],
    },
    '44424': {
      id: '44424',
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
    '44454': {
      id: '44454',
      label: 'WHO USED THE FIRE EXTINGUISHERS',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45116',
        },
        {
          label: 'PRISONERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45116',
        },
        {
          label: 'FIRE BRIGADE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45116',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45116',
        },
      ],
    },
    '44478': {
      id: '44478',
      label: 'DID ANYONE SUFFER BURN INJURIES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44865',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44762',
        },
      ],
    },
    '44486': {
      id: '44486',
      label: 'WAS ANYONE HOSPITALISED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44740',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44181',
        },
      ],
    },
    '44493': {
      id: '44493',
      label: 'WAS THE SYSTEM COMPROMISED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44410',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44176',
        },
      ],
    },
    '44520': {
      id: '44520',
      label: 'WHO DIED',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45055',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45055',
        },
        {
          label: 'OTHERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45055',
        },
      ],
    },
    '44556': {
      id: '44556',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN LOCALLY OR BY THE SERVICE SUPPLIER',
      multipleAnswers: false,
      answers: [
        {
          label: 'LOCAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45084',
        },
        {
          label: 'SERVICE SUPPLIER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44154',
        },
      ],
    },
    '44567': {
      id: '44567',
      label: 'WHAT WAS THE POSSIBLE CAUSE OF THE FIRE',
      multipleAnswers: false,
      answers: [
        {
          label: 'MALICIOUS IGNITION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44895',
        },
        {
          label: 'ELECTRICAL FAULT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44895',
        },
        {
          label: 'SMOKING MATERIAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44895',
        },
        {
          label: 'OVERHEATING',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44895',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44895',
        },
      ],
    },
    '44668': {
      id: '44668',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44949',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44232',
        },
      ],
    },
    '44695': {
      id: '44695',
      label: 'IS THE ITEM FIRST IGNITED KNOWN',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44813',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45017',
        },
      ],
    },
    '44732': {
      id: '44732',
      label: 'WAS THE FIRE BRIGADE CALLED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44158',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45064',
        },
      ],
    },
    '44740': {
      id: '44740',
      label: 'SPECIFY THOSE HOSPITALISED',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44181',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44181',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44181',
        },
      ],
    },
    '44741': {
      id: '44741',
      label: 'WAS ANY ACTION TAKEN TO PREVENT RECURRENCE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44829',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44829',
        },
      ],
    },
    '44744': {
      id: '44744',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN DURING THE INCIDENT?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44556',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44747': {
      id: '44747',
      label: 'SPECIFY THOSE WITH OTHER INJURIES',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44741',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44741',
        },
        {
          label: 'OTHERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44741',
        },
      ],
    },
    '44762': {
      id: '44762',
      label: 'DID ANYONE SUFFER LACERATION INJURIES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44837',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45131',
        },
      ],
    },
    '44813': {
      id: '44813',
      label: 'WHICH ITEM(S) WERE FIRST IGNITED',
      multipleAnswers: true,
      answers: [
        {
          label: 'WOOD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45017',
        },
        {
          label: 'PAPER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45017',
        },
        {
          label: 'OIL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45017',
        },
        {
          label: 'FLAMMABLE LIQUID',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45017',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45017',
        },
      ],
    },
    '44829': {
      id: '44829',
      label: 'WAS DAMAGE CAUSED TO PRISON PROPERTY',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44898',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44744',
        },
      ],
    },
    '44833': {
      id: '44833',
      label: 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45046',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44741',
        },
      ],
    },
    '44837': {
      id: '44837',
      label: 'WHO SUFFERED LACERATION INJURIES',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45131',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45131',
        },
        {
          label: 'OTHERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45131',
        },
      ],
    },
    '44865': {
      id: '44865',
      label: 'WHO SUFFERED BURN INJURIES',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44762',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44762',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44762',
        },
      ],
    },
    '44878': {
      id: '44878',
      label: 'WHICH FIXED INSTALLATIONS WERE OPERATED',
      multipleAnswers: false,
      answers: [
        {
          label: 'SPRINKLERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44996',
        },
        {
          label: 'KITCHEN SUPPRESSION SYSTEM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44996',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44996',
        },
      ],
    },
    '44895': {
      id: '44895',
      label: 'WAS A CELL SNATCH REQUIRED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44264',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44264',
        },
      ],
    },
    '44898': {
      id: '44898',
      label: 'DESCRIBE THE DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'MINOR',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44354',
        },
        {
          label: 'SERIOUS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44354',
        },
        {
          label: 'EXTENSIVE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44354',
        },
      ],
    },
    '44945': {
      id: '44945',
      label: 'WERE FIXED INSTALLATIONS OPERATED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44878',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44996',
        },
      ],
    },
    '44949': {
      id: '44949',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45146',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44232',
        },
      ],
    },
    '44957': {
      id: '44957',
      label: 'WHAT TIME WAS THE SYSTEM SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER TIME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45027',
        },
      ],
    },
    '44996': {
      id: '44996',
      label: 'WAS THE SMOKE EXTRACTION SYSTEM OPERATED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44695',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44695',
        },
      ],
    },
    '44999': {
      id: '44999',
      label: 'WHO WAS EVACUATED',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44833',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44833',
        },
        {
          label: 'OTHERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44833',
        },
      ],
    },
    '45017': {
      id: '45017',
      label: 'WERE OTHER ARTICLES INVOLVED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45053',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45133',
        },
      ],
    },
    '45027': {
      id: '45027',
      label: 'WAS THIS A FULL OR PARTIAL SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'FULL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45173',
        },
        {
          label: 'PARTIAL',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45173',
        },
      ],
    },
    '45046': {
      id: '45046',
      label: 'DID ANYONE SUFFER SMOKE INHALATION INJURIES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45085',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44478',
        },
      ],
    },
    '45053': {
      id: '45053',
      label: 'WHICH ARTICLES WERE INVOLVED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FURNISHINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45133',
        },
        {
          label: 'BEDDING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45133',
        },
        {
          label: 'CLOTHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45133',
        },
        {
          label: 'EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45133',
        },
        {
          label: 'RUBBISH/REFUSE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45133',
        },
        {
          label: 'VEHICLE/PLANT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45133',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45133',
        },
      ],
    },
    '45055': {
      id: '45055',
      label: 'ANY OTHER INJURIES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44747',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44741',
        },
      ],
    },
    '45058': {
      id: '45058',
      label: 'WAS EVACUATION NECESSARY',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44999',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44833',
        },
      ],
    },
    '45064': {
      id: '45064',
      label: 'HOW WAS THE ALARM RAISED',
      multipleAnswers: false,
      answers: [
        {
          label: 'FIRE ALARM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44268',
        },
        {
          label: 'TELEPHONE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44268',
        },
        {
          label: 'RADIO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44268',
        },
        {
          label: 'AUTOMATIC FIRE ALARM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44268',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44268',
        },
      ],
    },
    '45069': {
      id: '45069',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44272',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44272',
        },
      ],
    },
    '45084': {
      id: '45084',
      label: 'INDICATE THE NATURE OF THE SHUT DOWN',
      multipleAnswers: true,
      answers: [
        {
          label: 'TELEPHONY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44957',
        },
        {
          label: 'IT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44957',
        },
      ],
    },
    '45085': {
      id: '45085',
      label: 'WHO SUFFERED SMOKE INHALATION INJURIES',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44478',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44478',
        },
        {
          label: 'OTHERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44478',
        },
      ],
    },
    '45091': {
      id: '45091',
      label: 'WHO SUFFERED BROKEN BONE INJURIES',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44486',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44486',
        },
        {
          label: 'OTHERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44486',
        },
      ],
    },
    '45116': {
      id: '45116',
      label: 'WHAT EQUIPMENT WAS USED TO EXTINGUISH THE FIRE',
      multipleAnswers: true,
      answers: [
        {
          label: 'WATER EXTINGUISHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44945',
        },
        {
          label: 'FOAM EXTINGUISHERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44945',
        },
        {
          label: 'DRY POWDER EXTINGUISHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44945',
        },
        {
          label: 'AFFF EXTINGUISHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44945',
        },
        {
          label: 'HOSE REEL',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44945',
        },
        {
          label: 'FIRE BLANKET',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44945',
        },
        {
          label: 'CELL SPRAY NOZZLE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44945',
        },
        {
          label: 'CO2 EXTINGUISHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44945',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44945',
        },
      ],
    },
    '45131': {
      id: '45131',
      label: 'DID ANYONE SUFFER BROKEN BONE INJURIES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45091',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44486',
        },
      ],
    },
    '45133': {
      id: '45133',
      label: 'IS THE POSSIBLE CAUSE OF THE FIRE KNOWN',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44567',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44895',
        },
      ],
    },
    '45146': {
      id: '45146',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44232',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44232',
        },
      ],
    },
    '45173': {
      id: '45173',
      label: 'WHO AUTHORISED THE SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44493',
        },
        {
          label: 'DEPUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44493',
        },
        {
          label: 'DUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44493',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44493',
        },
      ],
    },
  },
} as const

export default FIRE

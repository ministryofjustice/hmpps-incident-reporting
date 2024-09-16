// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:37.654Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const BOMB_THREAT: IncidentTypeConfiguration = {
  incidentType: 'BOMB_THREAT',
  active: true,
  startingQuestionId: '44911',
  questions: {
    '44128': {
      id: '44128',
      label: 'WAS THE ITEM DISCOVERED',
      multipleAnswers: true,
      answers: [
        {
          label: 'BLAST BOMB',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44669',
        },
        {
          label: 'VEHICLE BOMB',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44669',
        },
        {
          label: 'POSTAL BOMB',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44669',
        },
        {
          label: 'INCENDIARY DEVICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44669',
        },
        {
          label: 'HOAX PACKAGE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44669',
        },
        {
          label: 'SUSPECT PACKAGE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44669',
        },
        {
          label: 'DETONATORS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44669',
        },
        {
          label: 'FUSES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44669',
        },
        {
          label: 'EXPLOSIVE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44669',
        },
      ],
    },
    '44135': {
      id: '44135',
      label: 'WHICH SERIOUS INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FRACTURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
        {
          label: 'SCALD OR BURN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
        {
          label: 'STABBING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
        {
          label: 'CRUSHING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
        {
          label: 'EXTENSIVE/MULTIPLE BRUISING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
        {
          label: 'BLACK EYE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
        {
          label: 'BROKEN NOSE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
        {
          label: 'BROKEN TEETH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
        {
          label: 'CUTS REQUIRING SUTURES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
        {
          label: 'BITES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
        {
          label: 'GUN SHOT WOUND',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
        {
          label: 'TEMPORARY/PERMANENT BLINDNESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
      ],
    },
    '44149': {
      id: '44149',
      label: 'INDICATE THE NATURE OF THE SHUT DOWN',
      multipleAnswers: true,
      answers: [
        {
          label: 'TELEPHONY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45109',
        },
        {
          label: 'IT',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45109',
        },
      ],
    },
    '44187': {
      id: '44187',
      label: 'WHAT TYPE OF EXPLOSION',
      multipleAnswers: false,
      answers: [
        {
          label: 'CONTROLLED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44277',
        },
        {
          label: 'UNCONTROLLED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44277',
        },
      ],
    },
    '44197': {
      id: '44197',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44587',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44305',
        },
      ],
    },
    '44236': {
      id: '44236',
      label: 'ESTIMATED COST OF DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER AMOUNT IN POUND STERLING',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45010',
        },
      ],
    },
    '44260': {
      id: '44260',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44579',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44579',
        },
      ],
    },
    '44261': {
      id: '44261',
      label: 'DESCRIBE WHAT WAS COMPROMISED AND BY WHOM',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER DESCRIPTION',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44276',
        },
      ],
    },
    '44276': {
      id: '44276',
      label: 'WHEN WAS THE SYSTEM RE-ACTIVATED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER COMMENT AND DATE',
          commentRequired: true,
          dateRequired: true,
          nextQuestionId: '45176',
        },
      ],
    },
    '44277': {
      id: '44277',
      label: 'WAS DAMAGE CAUSED TO PRISON PROPERTY',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44523',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45010',
        },
      ],
    },
    '44283': {
      id: '44283',
      label: 'WHO RECEIVED THE THREAT OR WARNING',
      multipleAnswers: false,
      answers: [
        {
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44560',
        },
      ],
    },
    '44305': {
      id: '44305',
      label: 'IS AN OUTSIDE ORGANISATION SUSPECTED OF INVOLVEMENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44260',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44260',
        },
      ],
    },
    '44361': {
      id: '44361',
      label: 'WAS THE AMBULANCE SERVICE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44380',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44380',
        },
      ],
    },
    '44362': {
      id: '44362',
      label: 'WAS THE SYSTEM COMPROMISED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44261',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44276',
        },
      ],
    },
    '44371': {
      id: '44371',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44978',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44978',
        },
      ],
    },
    '44380': {
      id: '44380',
      label: 'WAS THE FIRE SERVICE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44197',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44197',
        },
      ],
    },
    '44393': {
      id: '44393',
      label: 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44716',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44361',
        },
      ],
    },
    '44404': {
      id: '44404',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44547',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44547',
        },
      ],
    },
    '44472': {
      id: '44472',
      label: 'ENTER THE DESCRIPTION OF THE FATALITIES',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44393',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44393',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44393',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44393',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44393',
        },
      ],
    },
    '44510': {
      id: '44510',
      label: 'WAS THE BOMB DISPOSAL UNIT PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45113',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45113',
        },
      ],
    },
    '44516': {
      id: '44516',
      label: 'HAS THE SERVICE SUPPLIER BEEN NOTIFIED OF A REPLACEMENT KEYWORD?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44149',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44149',
        },
      ],
    },
    '44523': {
      id: '44523',
      label: 'DESCRIBE THE DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'MINOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44236',
        },
        {
          label: 'SERIOUS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44236',
        },
        {
          label: 'EXTENSIVE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44236',
        },
      ],
    },
    '44547': {
      id: '44547',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44974',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44974',
        },
      ],
    },
    '44560': {
      id: '44560',
      label: 'WHO MADE THE THREAT OR WARNING',
      multipleAnswers: false,
      answers: [
        {
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44948',
        },
      ],
    },
    '44579': {
      id: '44579',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN DURING THE INCIDENT?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45100',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44587': {
      id: '44587',
      label: 'HAVE ANY ARRESTS BEEN MADE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45007',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44305',
        },
      ],
    },
    '44642': {
      id: '44642',
      label: 'WERE THE POLICE PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44510',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44510',
        },
      ],
    },
    '44669': {
      id: '44669',
      label: 'WHERE WAS THE DEVICE FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'SPECIFY',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44719',
        },
      ],
    },
    '44671': {
      id: '44671',
      label: 'QUOTE THE VANTIVE CASE NUMBER',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER NUMBER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44778',
        },
      ],
    },
    '44716': {
      id: '44716',
      label: 'WAS A SERIOUS INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44135',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44745',
        },
      ],
    },
    '44719': {
      id: '44719',
      label: 'WAS THERE AN EXPLOSION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44187',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44393',
        },
      ],
    },
    '44742': {
      id: '44742',
      label: 'WHO WAS DETAINED IN OUTSIDE HOSPITAL',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44361',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44361',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44361',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44361',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44361',
        },
      ],
    },
    '44745': {
      id: '44745',
      label: 'WAS A MINOR INJURY SUSTAINED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45126',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44361',
        },
      ],
    },
    '44778': {
      id: '44778',
      label: 'WAS THE KEYWORD REQUESTED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44516',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44149',
        },
      ],
    },
    '44812': {
      id: '44812',
      label: 'WAS THIS A FULL OR PARTIAL SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'FULL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45140',
        },
        {
          label: 'PARTIAL (ENTER DETAILS)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45140',
        },
      ],
    },
    '44896': {
      id: '44896',
      label: 'ENTER DESCRIPTION OF PERSON(S) INJURED',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44956',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44956',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44956',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44956',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44956',
        },
      ],
    },
    '44911': {
      id: '44911',
      label: 'IS THE LOCATION OF THE INCIDENT KNOWN',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45178',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
      ],
    },
    '44948': {
      id: '44948',
      label: 'WHAT ACTION WAS TAKEN',
      multipleAnswers: false,
      answers: [
        {
          label: 'EVACUATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45040',
        },
        {
          label: 'PARTIAL SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44642',
        },
        {
          label: 'FULL CLOSE DOWN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44642',
        },
        {
          label: 'DOG SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44642',
        },
      ],
    },
    '44956': {
      id: '44956',
      label: 'DID INJURIES RESULT IN DETENTION IN OUTSIDE HOSPITAL AS AN IN-PATIENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44742',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44361',
        },
      ],
    },
    '44974': {
      id: '44974',
      label: 'WHAT SUGGESTED AN EXPLOSIVE DEVICE WAS PRESENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'THREAT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44283',
        },
        {
          label: 'WARNING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44283',
        },
        {
          label: 'EXPLOSION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44948',
        },
        {
          label: 'SUSPICIOUS PACKAGE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44948',
        },
        {
          label: 'INTELLIGENCE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44948',
        },
        {
          label: 'DOG SEARCH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44948',
        },
      ],
    },
    '44978': {
      id: '44978',
      label: 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44404',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44404',
        },
      ],
    },
    '45007': {
      id: '45007',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44305',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44305',
        },
      ],
    },
    '45010': {
      id: '45010',
      label: 'WERE THERE ANY FATALITIES DURING THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44472',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44393',
        },
      ],
    },
    '45040': {
      id: '45040',
      label: 'WAS THE EVACUATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'TO ANOTHER AREA OF THE PRISON',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44642',
        },
        {
          label: 'OUTSIDE THE PRISON',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44642',
        },
        {
          label: 'TO ANOTHER PRISON',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44642',
        },
      ],
    },
    '45100': {
      id: '45100',
      label: 'WAS THE TELEPHONE/IT SYSTEM SHUT DOWN LOCALLY OR BY THE SERVICE SUPPLIER',
      multipleAnswers: false,
      answers: [
        {
          label: 'LOCAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44149',
        },
        {
          label: 'SERVICE SUPPLIER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44671',
        },
      ],
    },
    '45109': {
      id: '45109',
      label: 'WHAT TIME WAS THE SYSTEM SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER TIME',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44812',
        },
      ],
    },
    '45113': {
      id: '45113',
      label: 'WAS ANY ITEM DISCOVERED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44128',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44719',
        },
      ],
    },
    '45126': {
      id: '45126',
      label: 'WHICH MINOR INJURIES WERE SUSTAINED',
      multipleAnswers: true,
      answers: [
        {
          label: 'GRAZES, SCRATCHES OR ABRASIONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44896',
        },
        {
          label: 'MINOR BRUISES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44896',
        },
        {
          label: 'SWELLINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44896',
        },
        {
          label: 'SUPERFICIAL CUTS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44896',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44896',
        },
      ],
    },
    '45140': {
      id: '45140',
      label: 'WHO AUTHORISED THE SHUT DOWN?',
      multipleAnswers: false,
      answers: [
        {
          label: 'GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44362',
        },
        {
          label: 'DEPUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44362',
        },
        {
          label: 'DUTY GOVERNOR',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44362',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44362',
        },
      ],
    },
    '45176': {
      id: '45176',
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
    '45178': {
      id: '45178',
      label: 'WHAT WAS THE LOCATION OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'ADMINISTRATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'ASSOCIATION AREA',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'CELL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'CHAPEL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'DINING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'DORMITORY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'EDUCATION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'EXERCISE YARD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'GATE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'GYM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'HEALTH CARE CENTRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'KITCHEN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'OFFICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'RECEPTION',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'RECESS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'SEGREGATION UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'SPECIAL UNIT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'SHOWERS/CHANGING ROOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'VISITS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'WING',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'WORKS DEPARTMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'WORKSHOP',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'WITHIN PERIMETER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'ELSEWHERE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'FUNERAL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'HOSPITAL OUTSIDE (PATIENT)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'HOSPITAL OUTSIDE (VISITING)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'OUTSIDE WORKING PARTY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'SPORTS FIELD',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'VEHICLE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'WEDDINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'MAGISTRATES COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
        {
          label: 'CROWN COURT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44371',
        },
      ],
    },
  },
} as const

export default BOMB_THREAT

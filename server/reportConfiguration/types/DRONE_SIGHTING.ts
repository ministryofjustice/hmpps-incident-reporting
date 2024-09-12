// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:44.902Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const DRONE_SIGHTING: IncidentTypeConfiguration = {
  incidentType: 'DRONE_SIGHTING',
  active: true,
  startingQuestionId: '69179',
  questions: {
    '69179': {
      id: '69179',
      label: 'WAS A DRONE SIGHTED IN MID-FLIGHT?',
      multipleAnswers: false,
      answers: [
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69180',
        },
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69180',
        },
      ],
    },
    '69180': {
      id: '69180',
      label: 'NUMBER OF DRONES SIGHTED',
      multipleAnswers: false,
      answers: [
        {
          label: 'Please Specify',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '69181',
        },
      ],
    },
    '69181': {
      id: '69181',
      label: 'WHERE WERE THE DRONE(S) SIGHTED',
      multipleAnswers: false,
      answers: [
        {
          label: 'Please Specify location of each Drone',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '69182',
        },
      ],
    },
    '69182': {
      id: '69182',
      label: 'FOR DRONE(S) SIGHTED BEYOND THE PERIMETER HOW CLOSE TO THE WALL',
      multipleAnswers: false,
      answers: [
        {
          label: 'Please Specify',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '69183',
        },
      ],
    },
    '69183': {
      id: '69183',
      label: 'WHAT WERE THE WEATHER CONDITIONS AT THE TIME OF THE SIGHTING',
      multipleAnswers: false,
      answers: [
        {
          label: 'Please Specify',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '69184',
        },
      ],
    },
    '69184': {
      id: '69184',
      label: 'WAS THE DRONE(S) RECOVERED',
      multipleAnswers: false,
      answers: [
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69190',
        },
        {
          label: 'YES - PLEASE ADDITIONALLY LOG A SEPRATE FIND INCIDENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69190',
        },
      ],
    },
    '69185': {
      id: '69185',
      label: 'WHAT WAS THE DRONE(S) TYPE/AIRFRAME SHAPE',
      multipleAnswers: false,
      answers: [
        {
          label: 'Junk',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '69186': {
      id: '69186',
      label: 'WHAT WAS THE DRONE(S) MAKE/MODEL',
      multipleAnswers: false,
      answers: [
        {
          label: 'Junk',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '69187': {
      id: '69187',
      label: 'WHAT WAS THE APPROXIMATE SIZE OF THE DRONE(S)',
      multipleAnswers: false,
      answers: [
        {
          label: 'Junk',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '69188': {
      id: '69188',
      label: 'WHAT MODIFICATIONS WERE MADE TO THE DRONE(S)',
      multipleAnswers: false,
      answers: [
        {
          label: 'junk',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '69189': {
      id: '69189',
      label: 'HOW WAS THE DRONE(S) RECOVERED',
      multipleAnswers: false,
      answers: [
        {
          label: 'junk',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '69190': {
      id: '69190',
      label: 'WHAT WAS THE DRONE(S) TYPE/AIRFRAME SHAPE',
      multipleAnswers: true,
      answers: [
        {
          label: 'FIXED WING / PLANE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69191',
        },
        {
          label: 'MULTI-COPTER 4 MOTORS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69191',
        },
        {
          label: 'MULTI-COPTER 6 MOTORS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69191',
        },
        {
          label: 'UNKNOWN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69191',
        },
        {
          label: 'OTHER (PLEASE SPECIFY)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '69191',
        },
      ],
    },
    '69191': {
      id: '69191',
      label: 'WHAT WAS THE DRONE(S) MAKE/MODEL',
      multipleAnswers: true,
      answers: [
        {
          label: 'Da-Jiang Innovations (DJI) - PHANTHOM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69192',
        },
        {
          label: 'Da-Jiang Innovations (DJI) - INSPIRE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69192',
        },
        {
          label: 'Da-Jiang Innovations (DJI) - MAVIC',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69192',
        },
        {
          label: 'Da-Jiang Innovations (DJI) - MINI',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69192',
        },
        {
          label: 'AUTEL EVO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69192',
        },
        {
          label: 'PARROTT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69192',
        },
        {
          label: 'SWELLPRO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69192',
        },
        {
          label: 'YUNEEC',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69192',
        },
        {
          label: 'UNKNOWN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69192',
        },
        {
          label: 'OTHER (PLEASE SPECIFY)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '69192',
        },
      ],
    },
    '69192': {
      id: '69192',
      label: 'WHAT WAS THE APPROXIMATE SIZE OF THE DRONE(S)',
      multipleAnswers: true,
      answers: [
        {
          label: '0 TO LESS THAN 0.5M',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69193',
        },
        {
          label: '0.5M TO LESS THAN 1.0M',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69193',
        },
        {
          label: '1.0M TO LESS THAN 2.0M',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69193',
        },
        {
          label: '2.0M TO LESS THAN 3.0M',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69193',
        },
        {
          label: '3.0M OR LONGER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69193',
        },
        {
          label: 'UNKNOWN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69193',
        },
      ],
    },
    '69193': {
      id: '69193',
      label: 'WHAT MODIFICATIONS WERE MADE TO THE DRONE(S)',
      multipleAnswers: true,
      answers: [
        {
          label: 'ADDED HOOK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69194',
        },
        {
          label: 'COVERED LIGHTS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69194',
        },
        {
          label: 'DROP MECHANISM FITTED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69194',
        },
        {
          label: 'NONE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69194',
        },
        {
          label: 'PAINTED BLACK',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69194',
        },
        {
          label: 'TETHER ATTACHED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69194',
        },
        {
          label: 'OTHER (PLEASE SPECIFY)',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '69194',
        },
      ],
    },
    '69194': {
      id: '69194',
      label: 'HOW WAS THE DRONE(S) RECOVERED',
      multipleAnswers: true,
      answers: [
        {
          label: 'CRASHED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69195',
        },
        {
          label: 'INTERCEPTED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69195',
        },
        {
          label: 'NOT RECOVERED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69195',
        },
      ],
    },
    '69195': {
      id: '69195',
      label: 'DID THE DRONE(S) CARRY ANY PACKAGES',
      multipleAnswers: false,
      answers: [
        {
          label: 'NO PACKAGE OBSERVED/RECOVERED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69196',
        },
        {
          label: 'YES - UNKNOWN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69196',
        },
        {
          label: 'YES 0 TO 100G (MORE OPTIONS BELOW)',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69196',
        },
        {
          label: 'YES 101G TO 200G',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69196',
        },
        {
          label: 'YES 201G TO 300G',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69196',
        },
        {
          label: 'YES 301G TO 400G',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69196',
        },
        {
          label: 'YES 401G TO 500G',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69196',
        },
        {
          label: 'YES 501G TO 1000G',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69196',
        },
        {
          label: 'YES MORE THAN 1001G',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69196',
        },
      ],
    },
    '69196': {
      id: '69196',
      label: 'WERE ANY PHOTOS OR CCTV TAKEN OF THE DRONE(S) OR PAYLOAD',
      multipleAnswers: false,
      answers: [
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69197',
        },
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69197',
        },
      ],
    },
    '69197': {
      id: '69197',
      label: 'WAS THE PILOT IDENTIFIED',
      multipleAnswers: false,
      answers: [
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69199',
        },
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69198',
        },
      ],
    },
    '69198': {
      id: '69198',
      label: 'WHAT WAS THE DISTANCE OF THE PILOT FROM THE PRISON PERIMETER',
      multipleAnswers: false,
      answers: [
        {
          label: '0 TO LESS THAN 10 METRES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69199',
        },
        {
          label: '10 TO LESS THAN 100 METRES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69199',
        },
        {
          label: '100 TO LESS THAN 200 METRES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69199',
        },
        {
          label: '200 METRES OR MORE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69199',
        },
        {
          label: 'UNKNOWN',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69199',
        },
      ],
    },
    '69199': {
      id: '69199',
      label: 'WERE THE POLICE CONTACTED',
      multipleAnswers: false,
      answers: [
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69200',
        },
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '69200',
        },
      ],
    },
    '69200': {
      id: '69200',
      label: 'TO THE EXTENT OF YOUR KNOWLEDGE WAS THE PILOT APPRHENDED?',
      multipleAnswers: false,
      answers: [
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
  },
} as const

export default DRONE_SIGHTING

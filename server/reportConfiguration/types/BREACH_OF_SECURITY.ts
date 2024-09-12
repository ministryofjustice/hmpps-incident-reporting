// Generated with ./scripts/updateNomisIncidentTypeConfigurations.ts at 2024-09-12T16:33:38.282Z

import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'

const BREACH_OF_SECURITY: IncidentTypeConfiguration = {
  incidentType: 'BREACH_OF_SECURITY',
  active: true,
  startingQuestionId: '44253',
  questions: {
    '44124': {
      id: '44124',
      label: 'WAS DAMAGE CAUSED TO PRISON PROPERTY',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44136',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44249',
        },
      ],
    },
    '44136': {
      id: '44136',
      label: 'WHAT WAS DAMAGED',
      multipleAnswers: true,
      answers: [
        {
          label: 'FURNITURE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45016',
        },
        {
          label: 'FITTINGS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45016',
        },
        {
          label: 'MACHINERY',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45016',
        },
        {
          label: 'EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45016',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '45016',
        },
      ],
    },
    '44249': {
      id: '44249',
      label: 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45137',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44906',
        },
      ],
    },
    '44253': {
      id: '44253',
      label: 'WERE THE POLICE INFORMED OF THE INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44286',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44364',
        },
      ],
    },
    '44286': {
      id: '44286',
      label: 'IS THE INCIDENT THE SUBJECT OF A POLICE INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44364',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44364',
        },
      ],
    },
    '44301': {
      id: '44301',
      label: 'DESCRIBE THE ILLICIT ITEM FOUND',
      multipleAnswers: true,
      answers: [
        {
          label: 'WEAPONS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'ALCOHOL',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'CIGARETTES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'TOBACCO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'CASH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'ESCAPE EQUIPMENT',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
        {
          label: 'TOOLS',
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
    '44333': {
      id: '44333',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44124',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44124',
        },
      ],
    },
    '44364': {
      id: '44364',
      label: 'IS THE INCIDENT THE SUBJECT OF AN INTERNAL INVESTIGATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44786',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44786',
        },
      ],
    },
    '44389': {
      id: '44389',
      label: 'HAS ANY PROSECUTION TAKEN PLACE OR IS ANY PENDING',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44883',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44883',
        },
      ],
    },
    '44500': {
      id: '44500',
      label: 'WAS THE DEMONSTRATION KNOWN ABOUT IN ADVANCE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44606',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44658',
        },
      ],
    },
    '44514': {
      id: '44514',
      label: 'DID UNAUTHORISED PERSONS ENTER THE PRISON',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44543',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44883',
        },
      ],
    },
    '44543': {
      id: '44543',
      label: 'WERE THESE PERSONS APPREHENDED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44855',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44883',
        },
      ],
    },
    '44561': {
      id: '44561',
      label: 'WAS A KNOWN ORGANISATION INVOLVED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44500',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44500',
        },
      ],
    },
    '44606': {
      id: '44606',
      label: 'HOW WAS IT KNOWN ABOUT',
      multipleAnswers: false,
      answers: [
        {
          label: 'INFORMATION FROM PRISONERS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44658',
        },
        {
          label: 'INFORMATION FROM POLICE',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44658',
        },
        {
          label: 'INFORMATION FROM HQ/AM',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44658',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44658',
        },
      ],
    },
    '44616': {
      id: '44616',
      label: 'ESTIMATED COST OF DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'ENTER AMOUNT IN POUND STERLING',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44249',
        },
      ],
    },
    '44658': {
      id: '44658',
      label: 'WHAT WAS THE REASON FOR THE DEMONSTRATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'PARTICULAR PRISONER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44686',
        },
        {
          label: 'LOCAL ISSUE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44686',
        },
        {
          label: 'GENERAL ISSUE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44686',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44686',
        },
      ],
    },
    '44686': {
      id: '44686',
      label: 'DID THE POLICE ATTEND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44728',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44124',
        },
      ],
    },
    '44709': {
      id: '44709',
      label: 'WAS THE DEMONSTRATION ORGANISED OR SPONTANEOUS',
      multipleAnswers: false,
      answers: [
        {
          label: 'ORGANISED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44561',
        },
        {
          label: 'SPONTANEOUS',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44561',
        },
      ],
    },
    '44728': {
      id: '44728',
      label: 'WERE ANY ARRESTS MADE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44333',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44333',
        },
      ],
    },
    '44786': {
      id: '44786',
      label: 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45095',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '45095',
        },
      ],
    },
    '44855': {
      id: '44855',
      label: 'WERE THESE PERSONS ARRESTED BY THE POLICE',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44389',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44883',
        },
      ],
    },
    '44864': {
      id: '44864',
      label: 'WAS THE SECURE PERIMETER BREACHED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44918',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44514',
        },
      ],
    },
    '44883': {
      id: '44883',
      label: 'WAS THE INCIDENT A DEMONSTRATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44709',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44124',
        },
      ],
    },
    '44906': {
      id: '44906',
      label: 'WERE ANY ILLICIT ITEMS FOUND',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44301',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: null,
        },
      ],
    },
    '44918': {
      id: '44918',
      label: 'DESCRIBE HOW THE SECURE PERIMETER WAS BREACHED',
      multipleAnswers: false,
      answers: [
        {
          label: 'THROWN OVER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44514',
        },
        {
          label: 'CLIMBED OVER',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44514',
        },
        {
          label: 'CUT THROUGH',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44514',
        },
        {
          label: 'VEHICLE RAMMED',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44514',
        },
        {
          label: 'EXPLOSIVES',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44514',
        },
        {
          label: 'OTHER',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44514',
        },
      ],
    },
    '44946': {
      id: '44946',
      label: 'WHAT WAS THE INCIDENT LOCATION',
      multipleAnswers: false,
      answers: [
        {
          label: 'INSIDE PRISON',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44864',
        },
        {
          label: 'OUTSIDE PRISON',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44864',
        },
      ],
    },
    '45016': {
      id: '45016',
      label: 'DESCRIBE THE DAMAGE',
      multipleAnswers: false,
      answers: [
        {
          label: 'MINOR',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44616',
        },
        {
          label: 'SERIOUS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44616',
        },
        {
          label: 'EXTENSIVE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44616',
        },
      ],
    },
    '45095': {
      id: '45095',
      label: 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED',
      multipleAnswers: false,
      answers: [
        {
          label: 'YES',
          commentRequired: false,
          dateRequired: true,
          nextQuestionId: '44946',
        },
        {
          label: 'NO',
          commentRequired: false,
          dateRequired: false,
          nextQuestionId: '44946',
        },
      ],
    },
    '45137': {
      id: '45137',
      label: 'ENTER DESCRIPTION OF PERSON(S) INJURED',
      multipleAnswers: true,
      answers: [
        {
          label: 'STAFF',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44906',
        },
        {
          label: 'PRISONERS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44906',
        },
        {
          label: 'CIVILIAN GRADES',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44906',
        },
        {
          label: 'POLICE',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44906',
        },
        {
          label: 'EXTERNAL CIVILIANS',
          commentRequired: true,
          dateRequired: false,
          nextQuestionId: '44906',
        },
      ],
    },
  },
} as const

export default BREACH_OF_SECURITY

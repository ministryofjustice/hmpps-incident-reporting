import type { Express } from 'express'
import request from 'supertest'

import config from '../../config'
import { PrisonApi } from '../../data/prisonApi'
import { appWithAllRoutes } from '../testutils/appSetup'
import { now } from '../../testutils/fakeClock'
import UserService from '../../services/userService'
import { statuses } from '../../reportConfiguration/constants'
import { IncidentReportingApi, type ReportWithDetails } from '../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../data/testData/incidentReporting'
import { makeSimpleQuestion } from '../../data/testData/incidentReportingJest'
import { mockSharedUser } from '../../data/testData/manageUsers'
import { leeds, moorland } from '../../data/testData/prisonApi'
import { mockThrownError } from '../../data/testData/thrownErrors'
import { reportingUser, approverUser, hqUser, unauthorisedUser } from '../../data/testData/users'

jest.mock('../../data/prisonApi')
jest.mock('../../data/incidentReportingApi')
jest.mock('../../services/userService')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let userService: jest.Mocked<UserService>
let prisonApi: jest.Mocked<PrisonApi>

beforeEach(() => {
  userService = UserService.prototype as jest.Mocked<UserService>
  app = appWithAllRoutes({ services: { userService } })
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>

  userService.getUsers.mockResolvedValueOnce({
    [mockSharedUser.username]: mockSharedUser,
  })

  const prisons = {
    LEI: leeds,
    MDI: moorland,
  }
  prisonApi.getPrisons.mockResolvedValue(prisons)
})

afterEach(() => {
  jest.resetAllMocks()
})

// TODO: links need checking. especially when they appear and when they hide

describe('View report page', () => {
  let mockedReport: ReportWithDetails
  let viewReportUrl: string

  beforeEach(() => {
    mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    mockedReport.questions = [
      makeSimpleQuestion(
        '67179',
        'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
        'CELL SEARCH',
        'INFORMATION RECEIVED',
      ),
      makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', 'YES'),
    ]
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    viewReportUrl = `/reports/${mockedReport.id}`
  })

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return request(app)
      .get(viewReportUrl)
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  describe('When all sections of an active type are filled', () => {
    it('should render basic information that cannot be changed', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Check your answers – incident report 6543')
          expect(res.text).toContain('John Smith')
          expect(res.text).toContain('Moorland (HMP &amp; YOI)')
          expect(res.text).toContain('Draft')

          expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledWith(mockedReport.id)

          expect(userService.getUsers.mock.calls).toHaveLength(1)
          const users = userService.getUsers.mock.calls[0][1]
          users.sort()
          expect(users).toEqual(['USER2', 'user1'])
        })
    })

    it('should render incident summary without description addendums', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Find of illicit items')
          expect(res.text).toContain('Date and time of incident')
          expect(res.text).toContain('5 December 2023 at 11:34')
          expect(res.text).toContain('Description')
          expect(res.text).toContain('A new incident created in the new service of type FIND_6')
          // there is a correction request from 12:34, but no description chunks
          const startOfDescriptionArea = res.text.indexOf('Description')
          const datePosition = res.text.lastIndexOf('5 December 2023 at 12:34')
          expect(startOfDescriptionArea).toBeGreaterThan(datePosition)
          expect(res.text).toContain(`${viewReportUrl}/change-type`)
          expect(res.text).toContain(`${viewReportUrl}/update-details`)
          expect(res.text).not.toContain(`${viewReportUrl}/update-date-and-time`)
          expect(res.text).not.toContain(`${viewReportUrl}/add-description`)
        })
    })

    it.each([
      { scenario: 'roles for reports made on DPS', createdInNomis: false },
      { scenario: 'roles and outcomes for reports made in NOMIS', createdInNomis: true },
    ])('should render prisoners involved with $scenario; names correct if available', ({ createdInNomis }) => {
      mockedReport.createdInNomis = createdInNomis
      mockedReport.lastModifiedInNomis = createdInNomis

      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Andrew Arnold,')
          expect(res.text).toContain('Role: Active involvement')
          if (createdInNomis) {
            expect(res.text).toContain('Outcome: Investigation (local)')
          } else {
            expect(res.text).not.toContain('Outcome:')
          }
          expect(res.text).toContain('Details: Comment about A1111AA')

          expect(res.text).toContain('Barry Benjamin,')
          expect(res.text).toContain('A2222BB')
          expect(res.text).toContain('Role: Suspected involved')
          if (createdInNomis) {
            expect(res.text).toContain('Outcome: No outcome')
          }
          expect(res.text).toContain('Details: No comment')

          expect(res.text).toContain(`${viewReportUrl}/prisoners`)
        })
    })

    // TODO: add multi-line comment test

    it('should render staff involved with roles', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Barry Harrison')
          expect(res.text).toContain('Present at scene')
          expect(res.text).toContain('Mary Johnson')
          expect(res.text).toContain('Actively involved')

          expect(res.text).toContain(`${viewReportUrl}/staff`)
        })
    })

    it('should render question responses', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).not.toContain('Questions cannot be changed for inactive incident types')

          expect(res.text).toContain('About the find of illicit items')

          expect(res.text).not.toContain(`${viewReportUrl}/questions"`)

          expect(res.text).toContain('1. Describe how the item was found')
          expect(res.text).toContain('Cell search')
          expect(res.text).toContain('Information received')
          expect(res.text).not.toContain('Unusual behaviour')
          expect(res.text).toContain(`${viewReportUrl}/questions/67179`)

          expect(res.text).toContain('2. Is the location of the incident known?')
          expect(res.text).toContain(`${viewReportUrl}/questions/67180`)

          expect(res.text).toContain('3. What was the location of the incident?')
          expect(res.text).toContain(`${viewReportUrl}/questions/67181`)
          expect(res.text).not.toContain('Describe the method of entry into the establishment')
          expect(res.text).not.toContain(`${viewReportUrl}/questions/67182`)
        })
    })

    it('should render correction requests', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Comments')
          expect(res.text).toContain('moj-timeline')
          expect(res.text).toContain('USER2')
          expect(res.text).toContain('Please amend question 2')
          expect(res.text).toContain('5 December 2023 at 12:34')
        })
    })
  })

  describe('When all sections of an inactive type are filled', () => {
    beforeEach(() => {
      mockedReport.type = 'DRONE_SIGHTING_1'
      mockedReport.status = 'CLOSED'
      mockedReport.description = 'An old drone sighting'
      mockedReport.questions = [
        makeSimpleQuestion('57179', 'Was a drone sighted in mid-flight', 'Yes'),
        makeSimpleQuestion('57180', 'What time was the drone(s) sighted.', '12am to 6am'),
        makeSimpleQuestion('57181', 'Number of drones observed', '1'),
        makeSimpleQuestion(
          '57184',
          'Where was the drone(s) sighted',
          'Beyond the external perimeter border',
          'Exercise yard',
        ),
      ]
    })

    it('should render basic information that cannot be changed', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('Check your answers – incident report 6543')
          expect(res.text).toContain('Incident report 6543')
          expect(res.text).toContain('John Smith')
          expect(res.text).toContain('Moorland (HMP &amp; YOI)')
          expect(res.text).toContain('Closed')

          expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledWith(mockedReport.id)

          expect(userService.getUsers.mock.calls).toHaveLength(1)
          const users = userService.getUsers.mock.calls[0][1]
          users.sort()
          expect(users).toEqual(['USER2', 'user1'])
        })
    })

    it('should render incident summary', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Drone sighting')
          expect(res.text).toContain('Date and time of incident')
          expect(res.text).toContain('5 December 2023 at 11:34')
          expect(res.text).toContain('Description')
          expect(res.text).toContain('An old drone sighting')

          expect(res.text).not.toContain(`${viewReportUrl}/change-type`)
          expect(res.text).not.toContain(`${viewReportUrl}/update-details`)
          expect(res.text).toContain(`${viewReportUrl}/update-date-and-time`)
          expect(res.text).toContain(`${viewReportUrl}/add-description`)
        })
    })

    it.each([
      { scenario: 'roles for reports made on DPS', createdInNomis: false },
      { scenario: 'roles and outcomes for reports made in NOMIS', createdInNomis: true },
    ])('should render prisoners involved with $scenario; names correct if available', ({ createdInNomis }) => {
      mockedReport.createdInNomis = createdInNomis
      mockedReport.lastModifiedInNomis = createdInNomis

      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Andrew Arnold')
          expect(res.text).toContain('Role: Active involvement')
          if (createdInNomis) {
            expect(res.text).toContain('Outcome: Investigation (local)')
          } else {
            expect(res.text).not.toContain('Outcome:')
          }
          expect(res.text).toContain('Details: Comment about A1111AA')
          expect(res.text).toContain('A2222BB')
          expect(res.text).toContain('Role: Suspected involved')
          if (createdInNomis) {
            expect(res.text).toContain('Outcome: No outcome')
          }
          expect(res.text).toContain('Details: No comment')

          expect(res.text).toContain(`${viewReportUrl}/prisoners`)
        })
    })

    it('should render staff involved with roles', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Barry Harrison')
          expect(res.text).toContain('Present at scene')
          expect(res.text).toContain('Mary Johnson')
          expect(res.text).toContain('Actively involved')

          expect(res.text).toContain(`${viewReportUrl}/staff`)
        })
    })

    it('should render question responses', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Questions cannot be changed for inactive incident types')

          expect(res.text).toContain('About the drone sighting')

          expect(res.text).not.toContain(`${viewReportUrl}/questions`)

          expect(res.text).toContain('1. Was a drone sighted in mid-flight?')
          expect(res.text).toContain('Yes')
          expect(res.text).toContain('2. What time was the drone(s) sighted.')
          expect(res.text).toContain('12am to 6am')
          expect(res.text).toContain('3. Number of drones observed')
          expect(res.text).toContain('1') // not gonna match right spot
          expect(res.text).toContain('4. Where was the drone(s) sighted?')
          expect(res.text).toContain('Beyond the external perimeter border')
          expect(res.text).toContain('Exercise yard')

          // this question wasn’t answered and is now uneditable, but it’s probably useful to show that it was not completed
          expect(res.text).toContain(
            'For drone(s) sighted beyond perimeter border, how close did the nearest drone get to the wall',
          )
          expect(res.text).not.toContain('What was the estimated speed of the drone(s)')
        })
    })

    it('should render correction requests', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Comments')
          expect(res.text).toContain('moj-timeline')
          expect(res.text).toContain('USER2')
          expect(res.text).toContain('Please amend question 2')
          expect(res.text).toContain('5 December 2023 at 12:34')
        })
    })
  })

  describe('When all sections are empty', () => {
    beforeEach(() => {
      mockedReport.questions = []
      mockedReport.staffInvolved = []
      mockedReport.prisonersInvolved = []
      mockedReport.correctionRequests = []
    })

    it('should render basic information that cannot be changed', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Check your answers – incident report 6543')
          expect(res.text).toContain('John Smith')
          expect(res.text).toContain('Moorland (HMP &amp; YOI)')
          expect(res.text).toContain('Draft')

          expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledWith(mockedReport.id)

          expect(userService.getUsers.mock.calls).toHaveLength(1)
          const users = userService.getUsers.mock.calls[0][1]
          users.sort()
          expect(users).toEqual(['user1'])
        })
    })

    it('should render incident summary', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Find of illicit items')
          expect(res.text).toContain('Date and time of incident')
          expect(res.text).toContain('5 December 2023 at 11:34')
          expect(res.text).toContain('Description')
          expect(res.text).toContain('A new incident created in the new service of type FIND_6')

          expect(res.text).toContain(`${viewReportUrl}/change-type`)
          expect(res.text).toContain(`${viewReportUrl}/update-details`)
        })
    })

    it('should render no prisoners found', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Prisoners involved')
          expect(res.text).toContain('No prisoners added')
          expect(res.text).toContain('Add a prisoner')

          expect(res.text).toContain(`${viewReportUrl}/prisoners`)
        })
    })

    it('should render no staff found', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Staff involved')
          expect(res.text).toContain('No staff added')
          expect(res.text).toContain('Add a member of staff')

          expect(res.text).toContain(`${viewReportUrl}/staff`)
        })
    })

    it('should render no question responses found', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('About the find of illicit items')

          expect(res.text).not.toContain(`${viewReportUrl}/questions"`)

          expect(res.text).toContain('1. Describe how the item was found')
          expect(res.text).toContain(`${viewReportUrl}/questions/67179`)

          expect(res.text).not.toContain('Is the location of the incident known')
          expect(res.text).not.toContain(`${viewReportUrl}/questions/67180`)
        })
    })

    it('should not render correction requests', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).not.toContain('Comments')
          expect(res.text).not.toContain('moj-timeline')
        })
    })
  })

  // TODO: will need to work for other statuses too once lifecycle confirmed
  describe('Reporting officer submits a report', () => {
    beforeEach(() => {
      mockedReport = convertReportWithDetailsDates(
        mockReport({
          reportReference: '6543',
          reportDateAndTime: now,
          type: 'ASSAULT_5',
          status: 'DRAFT',
          withDetails: true,
        }),
      )
      mockedReport.questions = [
        makeSimpleQuestion('61279', 'WHAT WAS THE MAIN MANAGEMENT OUTCOME OF THE INCIDENT', 'IEP REGRESSION'),
        makeSimpleQuestion('61280', 'IS ANY MEMBER OF STAFF FACING DISCIPLINARY CHARGES', 'NO'),
        makeSimpleQuestion('61281', 'IS THERE ANY MEDIA INTEREST IN THIS INCIDENT', 'NO'),
        makeSimpleQuestion('61282', 'HAS THE PRISON SERVICE PRESS OFFICE BEEN INFORMED', 'NO'),
        makeSimpleQuestion('61283', 'IS THE LOCATION OF THE INCDENT KNOWN', 'NO'),
        makeSimpleQuestion('61285', 'WAS THIS A SEXUAL ASSAULT', 'NO'),
        makeSimpleQuestion('61286', 'DID THE ASSAULT OCCUR DURING A FIGHT', 'NO'),
        makeSimpleQuestion('61287', 'WHAT TYPE OF ASSAULT WAS IT', 'PRISONER ON STAFF'),
        makeSimpleQuestion('61289', 'DESCRIBE THE TYPE OF STAFF', 'OPERATIONAL STAFF - OTHER'),
        makeSimpleQuestion('61290', 'WAS SPITTING USED IN THIS INCIDENT', 'NO'),
        makeSimpleQuestion('61294', 'WERE ANY WEAPONS USED', 'NO'),
        makeSimpleQuestion('61296', 'WERE ANY INJURIES RECEIVED DURING THIS INCIDENT', 'NO'),
        makeSimpleQuestion('61306', 'ARE THERE ANY STAFF NOW OFF DUTY AS A RESULT OF THIS INCIDENT', 'NO'),
        makeSimpleQuestion('61307', 'ARE ANY STAFF ON SICK LEAVE AS A RESULT OF THIS INCIDENT', 'NO'),
        makeSimpleQuestion('61308', 'DID THE ASSAULT OCCUR IN PUBLIC VIEW', 'YES'),
        makeSimpleQuestion('61309', 'IS THERE ANY AUDIO OR VISUAL FOOTAGE OF THE ASSAULT', 'NO'),
        makeSimpleQuestion('61311', 'WAS THERE AN APPARENT REASON FOR THE ASSAULT', 'NO'),
      ]
      incidentReportingApi.getReportWithDetailsById.mockReset()
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
      viewReportUrl = `/reports/${mockedReport.id}`

      incidentReportingApi.updateReport.mockRejectedValue(new Error('should not be called'))
      incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))
    })

    it.each(statuses.map(s => s.code).filter(s => s !== 'DRAFT'))(
      'should not allow submitting a non-draft report with status %s',
      status => {
        mockedReport.status = status

        return request
          .agent(app)
          .post(viewReportUrl)
          .send({ userAction: 'submit' })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('Only a draft report can be submitted')
          })
      },
    )

    describe('when it’s type requires involvements', () => {
      it('should allow submitting a fully complete draft report for review', () => {
        incidentReportingApi.updateReport.mockReset()
        incidentReportingApi.updateReport.mockResolvedValueOnce(mockedReport) // return value ignored
        incidentReportingApi.changeReportStatus.mockReset()
        incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // return value ignored

        return request
          .agent(app)
          .post(viewReportUrl)
          .send({ userAction: 'submit' })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('app-dashboard')
            expect(res.text).toContain(`You have submitted incident report ${mockedReport.reportReference}`)

            expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
              title: 'Assault: Arnold A1111AA, Benjamin A2222BB (Moorland (HMP & YOI))',
            })
            expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, {
              newStatus: 'AWAITING_REVIEW',
            })
          })
      })

      it.each([
        {
          scenario: 'skipping prisoner involvements',
          skipped: true,
          errorMessage: 'Please complete the prisoner involvement section',
        },
        { scenario: 'without prisoner involvements', skipped: false, errorMessage: 'You need to add a prisoner' },
      ])(
        'should not allow submitting a draft report $scenario when the type requires them',
        ({ skipped, errorMessage }) => {
          mockedReport.prisonersInvolved = []
          mockedReport.prisonerInvolvementDone = !skipped

          return request
            .agent(app)
            .post(viewReportUrl)
            .send({ userAction: 'submit' })
            .redirects(1)
            .expect(200)
            .expect(res => {
              expect(res.text).toContain('There is a problem')
              expect(res.text).toContain(errorMessage)

              expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
              expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
            })
        },
      )

      it.each([
        {
          scenario: 'skipping staff involvements',
          skipped: true,
          errorMessage: 'Please complete the staff involvement section',
        },
        { scenario: 'without staff involvements', skipped: false, errorMessage: 'You need to add a member of staff' },
      ])(
        'should not allow submitting a draft report $scenario when the type requires them',
        ({ skipped, errorMessage }) => {
          mockedReport.staffInvolved = []
          mockedReport.staffInvolvementDone = !skipped

          return request
            .agent(app)
            .post(viewReportUrl)
            .send({ userAction: 'submit' })
            .redirects(1)
            .expect(200)
            .expect(res => {
              expect(res.text).toContain('There is a problem')
              expect(res.text).toContain(errorMessage)

              expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
              expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
            })
        },
      )

      it('should not allow submitting a draft report with no answered questions', () => {
        mockedReport.questions = []

        return request
          .agent(app)
          .post(viewReportUrl)
          .send({ userAction: 'submit' })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('You must answer question 1')
            expect(res.text).not.toContain('You must answer question 17')

            expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      })

      it('should not allow submitting a draft report with incomplete questions', () => {
        mockedReport.questions.pop()

        return request
          .agent(app)
          .post(viewReportUrl)
          .send({ userAction: 'submit' })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('You must answer question 17')

            expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      })
    })

    describe('when it’s type does not require involvements', () => {
      beforeEach(() => {
        mockedReport.type = 'FIND_6'
        mockedReport.questions = [
          makeSimpleQuestion(
            '67179',
            'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
            'INFORMATION RECEIVED',
          ),
          makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', 'NO'),
          makeSimpleQuestion('67182', 'DESCRIBE THE METHOD OF ENTRY INTO THE ESTABLISHMENT', 'UNKNOWN'),
          makeSimpleQuestion('67184', 'IF FOUND IN POSSESSION, WHOSE WAS IT FOUND IN?', 'NOT APPLICABLE'),
          makeSimpleQuestion('67186', 'WHAT WAS THE METHOD OF CONCEALMENT', 'IN HAND'),
          makeSimpleQuestion(
            '67187',
            'PLEASE SELECT CATEGORY OF FIND',
            'OTHER REPORTABLE ITEMS (BY NATIONAL OR LOCAL POLICY)',
          ),
          makeSimpleQuestion(
            '67204',
            'OTHER REPORTABLE ITEMS FOUND (BY NATIONAL OR LOCAL POLICY)',
            'YES (NOOSE / LIGATURE)',
          ),
          makeSimpleQuestion('67226', 'WERE THE ITEMS OBTAINED ON TEMPORARY RELEASE?', 'NO'),
        ]
      })

      it('should allow submitting a draft report without any involvements', () => {
        mockedReport.prisonersInvolved = []
        mockedReport.prisonerInvolvementDone = true
        mockedReport.staffInvolved = []
        mockedReport.staffInvolvementDone = true

        incidentReportingApi.updateReport.mockReset()
        incidentReportingApi.updateReport.mockResolvedValueOnce(mockedReport) // return value ignored
        incidentReportingApi.changeReportStatus.mockReset()
        incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // return value ignored

        return request
          .agent(app)
          .post(viewReportUrl)
          .send({ userAction: 'submit' })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('app-dashboard')
            expect(res.text).toContain(`You have submitted incident report ${mockedReport.reportReference}`)

            expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
              title: 'Find of illicit items (Moorland (HMP & YOI))',
            })
            expect(incidentReportingApi.changeReportStatus).toHaveBeenCalledWith(mockedReport.id, {
              newStatus: 'AWAITING_REVIEW',
            })
          })
      })

      it('should still not allow submitting a draft report if prisoner involvements were skipped', () => {
        mockedReport.prisonersInvolved = []
        mockedReport.prisonerInvolvementDone = false

        return request
          .agent(app)
          .post(viewReportUrl)
          .send({ userAction: 'submit' })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('Please complete the prisoner involvement section')

            expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      })

      it('should still not allow submitting a draft report if staff involvements were skipped', () => {
        mockedReport.staffInvolved = []
        mockedReport.staffInvolvementDone = false

        return request
          .agent(app)
          .post(viewReportUrl)
          .send({ userAction: 'submit' })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('Please complete the staff involvement section')

            expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      })

      it('should still not allow submitting a draft report with incomplete questions', () => {
        mockedReport.questions.pop()

        return request
          .agent(app)
          .post(viewReportUrl)
          .send({ userAction: 'submit' })
          .redirects(1)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain('There is a problem')
            expect(res.text).toContain('You must answer question 8')

            expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
            expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
          })
      })
    })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    let previousActivePrisons: string[]

    beforeAll(() => {
      previousActivePrisons = config.activePrisons
    })

    beforeEach(() => {
      config.activePrisons = previousActivePrisons

      mockedReport = convertReportWithDetailsDates(
        mockReport({ reportReference: '6543', reportDateAndTime: now, status: 'DRAFT', withDetails: true }),
      )
      mockedReport.questions = [
        // NB: all questions are complete
        makeSimpleQuestion('67179', 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)', 'INFORMATION RECEIVED'),
        makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', 'NO'),
        makeSimpleQuestion('67182', 'DESCRIBE THE METHOD OF ENTRY INTO THE ESTABLISHMENT', 'UNKNOWN'),
        makeSimpleQuestion('67184', 'IF FOUND IN POSSESSION, WHOSE WAS IT FOUND IN?', 'NOT APPLICABLE'),
        makeSimpleQuestion('67186', 'WHAT WAS THE METHOD OF CONCEALMENT', 'IN HAND'),
        makeSimpleQuestion(
          '67187',
          'PLEASE SELECT CATEGORY OF FIND',
          'OTHER REPORTABLE ITEMS (BY NATIONAL OR LOCAL POLICY)',
        ),
        makeSimpleQuestion(
          '67204',
          'OTHER REPORTABLE ITEMS FOUND (BY NATIONAL OR LOCAL POLICY)',
          'YES (NOOSE / LIGATURE)',
        ),
        makeSimpleQuestion('67226', 'WERE THE ITEMS OBTAINED ON TEMPORARY RELEASE?', 'NO'),
      ]
      incidentReportingApi.getReportWithDetailsById.mockReset()
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
      viewReportUrl = `/reports/${mockedReport.id}`
    })

    describe.each([
      { userType: 'reporting officer', user: reportingUser, canView: true, canEdit: true, canSubmit: true },
      { userType: 'data warden', user: approverUser, canView: true, canEdit: false, canSubmit: false },
      { userType: 'HQ view-only user', user: hqUser, canView: true, canEdit: false, canSubmit: false },
      { userType: 'unauthorised user', user: unauthorisedUser, canView: false, canEdit: false, canSubmit: false },
    ])('for $userType', ({ user, canView, canEdit, canSubmit }) => {
      it(`should ${canView ? 'grant' : 'deny'} viewing a report`, () => {
        const testRequest = request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
          .get(viewReportUrl)
          .redirects(1)
        if (canView) {
          return testRequest.expect(200).expect(res => {
            const canEditTextMatcher = canEdit ? expect(res.text).toContain : expect(res.text).not.toContain
            ;[
              // heading prefix
              'Check your answers',
              // question page links
              'question responses',
              // change links
              'Change',
              `${viewReportUrl}/change-type`,
              `${viewReportUrl}/update-details`,
              `${viewReportUrl}/prisoners`,
              `${viewReportUrl}/staff`,
              `${viewReportUrl}/questions`, // this is a prefix, not complete link
            ].forEach(text => {
              canEditTextMatcher(text)
            })

            const canSubmitTextMatcher = canSubmit ? expect(res.text).toContain : expect(res.text).not.toContain
            ;[
              // submit button
              'Submit',
            ].forEach(text => {
              canSubmitTextMatcher(text)
            })
          })
        }
        return testRequest.expect(res => {
          expect(res.redirects[0]).toContain('/sign-out')
        })
      })

      it(`should ${canEdit ? 'warn' : 'not warn'} that report is only editable in NOMIS`, () => {
        config.activePrisons = ['LEI']

        return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
          .get(viewReportUrl)
          .expect(res => {
            const warningShows = res.text.includes('This report can only be amended in NOMIS')
            expect(warningShows).toBe(canEdit)
          })
      })

      it(`should ${canSubmit ? 'grant' : 'deny'} submitting a draft report for review`, () => {
        if (canSubmit) {
          incidentReportingApi.changeReportStatus.mockResolvedValueOnce(mockedReport) // return value ignored
        } else {
          incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))
        }

        return request
          .agent(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
          .post(viewReportUrl)
          .send({ userAction: 'submit' })
          .redirects(1)
          .expect(res => {
            if (canSubmit) {
              expect(incidentReportingApi.changeReportStatus).toHaveBeenCalled()
            } else {
              expect(incidentReportingApi.changeReportStatus).not.toHaveBeenCalled()
              if (canView) {
                expect(res.text).toContain('There is a problem')
                expect(res.text).toContain('You do not have permission to submit this report')
              }
            }
          })
      })
    })
  })
})

describe('View report page with description addendums', () => {
  let mockedReport: ReportWithDetails
  let viewReportUrl: string

  beforeEach(() => {
    mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true, withAddendums: true }),
    )
    mockedReport.questions = []
    mockedReport.prisonersInvolved = []
    mockedReport.staffInvolved = []
    mockedReport.correctionRequests = []
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    viewReportUrl = `/reports/${mockedReport.id}`
  })

  it('should render incident summary with description addendums', () => {
    return request(app)
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Description')
        // a description chunk appears in the description section
        const startOfDescriptionArea = res.text.indexOf('Description')
        const datePosition = res.text.indexOf('5 December 2023 at 12:34')
        expect(startOfDescriptionArea).toBeLessThan(datePosition)
        expect(res.text).toContain('A new incident created in the new service of type FIND_6')
        expect(res.text).toContain('John Smith')
        expect(res.text).toContain('Addendum #1')
        expect(res.text).toContain('Jane Doe')
        expect(res.text).toContain('Addendum #2')
      })
  })
})

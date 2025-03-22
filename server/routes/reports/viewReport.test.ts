import type { Express } from 'express'
import request from 'supertest'

import config from '../../config'
import { PrisonApi } from '../../data/prisonApi'
import { appWithAllRoutes } from '../testutils/appSetup'
import { now } from '../../testutils/fakeClock'
import UserService from '../../services/userService'
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
          expect(res.text).toContain('Check your answers – incident reference 6543')
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

    it('should render incident summary', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Finds')
          expect(res.text).toContain('Date and time of incident')
          expect(res.text).toContain('5 December 2023, 11:34')
          expect(res.text).toContain('Description')
          expect(res.text).toContain('A new incident created in the new service of type FINDS')
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
        })
    })

    it('should render question responses', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).not.toContain('Questions cannot be changed for inactive incident types')

          expect(res.text).toContain('About the incident')
          // TODO: will need to become type-specific once content is ready

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
          expect(res.text).toContain('USER2')
          expect(res.text).toContain('Description: Please amend question 2')
          expect(res.text).toContain('Submitted at: 5 December 2023, 12:34')
        })
    })
  })

  describe('When all sections of an inactive type are filled', () => {
    beforeEach(() => {
      mockedReport.type = 'OLD_DRONE_SIGHTING'
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
          expect(res.text).not.toContain('Check your answers – incident reference 6543')
          expect(res.text).toContain('Incident reference 6543')
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
          expect(res.text).toContain('5 December 2023, 11:34')
          expect(res.text).toContain('Description')
          expect(res.text).toContain('An old drone sighting')
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
        })
    })

    it('should render question responses', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Questions cannot be changed for inactive incident types')

          expect(res.text).toContain('About the incident')
          // TODO: will need to become type-specific once content is ready

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
          expect(res.text).toContain('USER2')
          expect(res.text).toContain('Description: Please amend question 2')
          expect(res.text).toContain('Submitted at: 5 December 2023, 12:34')
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
          expect(res.text).toContain('Check your answers – incident reference 6543')
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
          expect(res.text).toContain('Finds')
          expect(res.text).toContain('Date and time of incident')
          expect(res.text).toContain('5 December 2023, 11:34')
          expect(res.text).toContain('Description')
          expect(res.text).toContain('A new incident created in the new service of type FINDS')
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
        })
    })

    it('should render no question responses found', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('About the incident')
          // TODO: will need to become type-specific once content is ready

          expect(res.text).toContain('1. Describe how the item was found')
          expect(res.text).toContain(`${viewReportUrl}/questions/67179`)

          expect(res.text).not.toContain('Is the location of the incident known')
          expect(res.text).not.toContain(`${viewReportUrl}/questions/67180`)
        })
    })

    it('should render correction requests', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Correction requests')
          expect(res.text).toContain('No correction requests')
          expect(res.text).toContain('Add a correction')
        })
    })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    let previousActivePrisons: string[]

    beforeAll(() => {
      previousActivePrisons = config.activePrisons
    })

    let reportId: string

    beforeEach(() => {
      config.activePrisons = previousActivePrisons

      const report = convertReportWithDetailsDates(
        mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
      )
      report.questions = [
        makeSimpleQuestion(
          '67179',
          'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
          'CELL SEARCH',
          'INFORMATION RECEIVED',
        ),
        makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', 'YES'),
      ]
      reportId = report.id
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(report)
    })

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: reportingUser, action: granted, canEdit: true },
      { userType: 'data warden', user: approverUser, action: granted, canEdit: false },
      { userType: 'HQ view-only user', user: hqUser, action: granted, canEdit: false },
      { userType: 'unauthorised user', user: unauthorisedUser, action: denied, canEdit: false },
    ])('should be $action to $userType', ({ user, action, canEdit }) => {
      const testRequest = request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
        .get(`/reports/${reportId}`)
        .redirects(1)
      if (action === 'granted') {
        return testRequest.expect(200).expect(res => {
          if (canEdit) {
            expect(res.text).toContain('Check your answers')
            expect(res.text).toContain('question responses')
          } else {
            expect(res.text).not.toContain('Check your answers')
            expect(res.text).not.toContain('question responses')
          }
        })
      }
      return testRequest.expect(res => {
        expect(res.redirects[0]).toContain('/sign-out')
      })
    })

    it.each([
      { userType: 'reporting officer', user: reportingUser, warn: true },
      { userType: 'data warden', user: approverUser, warn: true },
      { userType: 'HQ view-only user', user: hqUser, warn: false },
      { userType: 'unauthorised user', user: unauthorisedUser, warn: false },
    ])('should warn $userType that report is only editable in NOMIS: $warn', ({ user, warn }) => {
      config.activePrisons = ['LEI']

      return request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
        .get(`/reports/${reportId}`)
        .expect(res => {
          const warningShows = res.text.includes('This report can only be amended in NOMIS')
          expect(warningShows).toBe(warn)
        })
    })
  })
})

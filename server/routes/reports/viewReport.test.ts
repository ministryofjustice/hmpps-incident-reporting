import type { Express } from 'express'
import request from 'supertest'

import { PrisonApi } from '../../data/prisonApi'
import { appWithAllRoutes } from '../testutils/appSetup'
import { now, dayLater } from '../../testutils/fakeClock'
import UserService from '../../services/userService'
import { type Status, statuses } from '../../reportConfiguration/constants'
import { setActiveAgencies } from '../../data/activeAgencies'
import { rolePecs } from '../../data/constants'
import { IncidentReportingApi, type ReportWithDetails } from '../../data/incidentReportingApi'
import { convertReportDates } from '../../data/incidentReportingApiUtils'
import * as reportValidity from '../../data/reportValidity'
import { mockErrorResponse, mockReport } from '../../data/testData/incidentReporting'
import { makeSimpleQuestion } from '../../data/testData/incidentReportingJest'
import { mockSharedUser, mockSharedUser2 } from '../../data/testData/manageUsers'
import { mockPecsRegions } from '../../data/testData/pecsRegions'
import { leeds, moorland } from '../../data/testData/prisonApi'
import { mockThrownError } from '../../data/testData/thrownErrors'
import { mockDataWarden, mockReportingOfficer, mockHqViewer, mockUnauthorisedUser } from '../../data/testData/users'
import { possiblePecsStatuses } from '../../middleware/correctPecsReportStatus'

jest.mock('../../data/incidentReportingApi')
jest.mock('../../data/prisonApi')
jest.mock('../../data/reportValidity')
jest.mock('../../services/userService')

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
const prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
const userService = UserService.prototype as jest.Mocked<UserService>

const { validateReport } = reportValidity as jest.Mocked<typeof import('../../data/reportValidity')>

beforeAll(() => {
  mockPecsRegions()
})

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ services: { userService } })

  userService.getUsers.mockResolvedValueOnce({
    [mockSharedUser.username]: mockSharedUser,
  })

  prisonApi.getPrison.mockImplementation(locationCode =>
    Promise.resolve(
      {
        LEI: leeds,
        MDI: moorland,
      }[locationCode],
    ),
  )

  validateReport.mockImplementationOnce(() => {
    throw new Error('should not be called')
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

function makeReportValid() {
  validateReport.mockReset()
  validateReport.mockImplementationOnce(function* generator() {
    /* empty */
  })
}

// TODO: links need checking. especially when they appear and when they hide

describe('View report page', () => {
  let mockedReport: ReportWithDetails
  let viewReportUrl: string

  beforeEach(() => {
    mockedReport = convertReportDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true, withAddendums: true }),
    )
    mockedReport.questions = [
      makeSimpleQuestion(
        '67179',
        'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)',
        ['CELL SEARCH', '218687'],
        ['INFORMATION RECEIVED', '218695'],
      ),
      makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', ['YES', '218711']),
    ]
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    incidentReportingApi.updateReport.mockRejectedValue(new Error('should not be called'))
    incidentReportingApi.changeReportStatus.mockRejectedValue(new Error('should not be called'))
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
    it('should render basic information that cannot be changed with no additional modifications to report', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Check your answers – incident report 6543')
          expect(res.text).toContain('Reported by:')
          expect(res.text).toContain('John Smith on 5 December 2023 at 12:34')
          expect(res.text).toContain('Last updated by:')
          expect(res.text).toContain('Moorland (HMP &amp; YOI)')
          expect(res.text).toContain('Draft')
          expect(res.text).not.toContain('Incident created as')
          expect(res.text).not.toContain('Incident updated to')

          expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledWith(mockedReport.id)

          expect(userService.getUsers.mock.calls).toHaveLength(1)
          const users = userService.getUsers.mock.calls[0][1]
          users.sort()
          expect(users).toEqual(['abc12a', 'user1'])
        })
    })

    it('should render basic information that cannot be changed with additional modifications to report', () => {
      mockedReport.modifiedBy = 'user2'
      mockedReport.modifiedAt = dayLater

      userService.getUsers.mockReset()
      userService.getUsers.mockResolvedValueOnce({
        [mockSharedUser.username]: mockSharedUser,
        [mockSharedUser2.username]: mockSharedUser2,
      })

      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Check your answers – incident report 6543')
          expect(res.text).toContain('Reported by:')
          expect(res.text).toContain('John Smith on 5 December 2023 at 12:34')
          expect(res.text).toContain('Last updated by:')
          expect(res.text).toContain('Mary Johnson on 6 December 2023 at 12:34')
          expect(res.text).toContain('Moorland (HMP &amp; YOI)')
          expect(res.text).toContain('Draft')

          expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledWith(mockedReport.id)

          expect(userService.getUsers.mock.calls).toHaveLength(1)
          const users = userService.getUsers.mock.calls[0][1]
          users.sort()
          expect(users).toEqual(['abc12a', 'user1', 'user2'])
        })
    })

    it('should render incident summary without description addendums', () => {
      mockedReport.descriptionAddendums = []

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
          expect(res.text).not.toContain('app-description-chunks')
          // there is a correction request from 12:34, but no description chunks
          const startOfDescriptionArea = res.text.indexOf('Description')
          const datePosition = res.text.lastIndexOf('5 December 2023 at 12:34')
          expect(startOfDescriptionArea).toBeGreaterThan(datePosition)
          expect(res.text).toContain(`${viewReportUrl}/change-type`)
        })
    })

    it('should render incident summary without description addendums', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Description')
          // a description chunk appears in the description section
          const startOfDescriptionArea = res.text.indexOf('Description')
          const endOfDescriptionArea = res.text.indexOf('</div>', startOfDescriptionArea)
          const datePosition = res.text.indexOf('5 December 2023 at 12:34', startOfDescriptionArea)
          expect(datePosition).toBeLessThan(endOfDescriptionArea)
          expect(res.text).toContain('A new incident created in the new service of type FIND_6')
          expect(res.text).toContain('John Smith')
          expect(res.text).toContain('Addendum #1')
          expect(res.text).toContain('Jane Doe')
          expect(res.text).toContain('Addendum #2')
          expect(res.text).toContain('app-description-chunks')
        })
    })

    const mustAppendDescriptionScenarios: {
      status: Status
      updateLinks: 'change description page' | 'append-only description page' | 'no description pages'
    }[] = [
      { status: 'DRAFT', updateLinks: 'change description page' },
      { status: 'AWAITING_REVIEW', updateLinks: 'change description page' },
      { status: 'ON_HOLD', updateLinks: 'no description pages' },
      { status: 'NEEDS_UPDATING', updateLinks: 'append-only description page' },
      { status: 'UPDATED', updateLinks: 'no description pages' },
      { status: 'CLOSED', updateLinks: 'no description pages' },
      { status: 'DUPLICATE', updateLinks: 'no description pages' },
      { status: 'NOT_REPORTABLE', updateLinks: 'no description pages' },
      { status: 'REOPENED', updateLinks: 'append-only description page' },
      { status: 'WAS_CLOSED', updateLinks: 'no description pages' },
    ]
    it.each(mustAppendDescriptionScenarios)(
      'should link to $updateLinks when status is $status',
      ({ status, updateLinks }) => {
        mockedReport.status = status

        return request(app)
          .get(viewReportUrl)
          .expect('Content-Type', /html/)
          .expect(200)
          .expect(res => {
            if (updateLinks === 'change description page') {
              expect(res.text).toContain(`${viewReportUrl}/update-details`)
              expect(res.text).not.toContain(`${viewReportUrl}/update-date-and-time`)
              expect(res.text).not.toContain(`${viewReportUrl}/add-description`)
            } else if (updateLinks === 'append-only description page') {
              expect(res.text).not.toContain(`${viewReportUrl}/update-details`)
              expect(res.text).toContain(`${viewReportUrl}/update-date-and-time`)
              expect(res.text).toContain(`${viewReportUrl}/add-description`)
            } else {
              expect(res.text).not.toContain(`${viewReportUrl}/update-details`)
              expect(res.text).not.toContain(`${viewReportUrl}/update-date-and-time`)
              expect(res.text).not.toContain(`${viewReportUrl}/add-description`)
            }
          })
      },
    )

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

    it('should render comments if there are correction requests', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Comments')
          expect(res.text).toContain('moj-timeline')
        })
    })

    it('should render type history if it exists', () => {
      mockedReport.incidentTypeHistory = [
        {
          type: 'ASSAULT_5',
          changedBy: 'user1',
          changedAt: now,
        },
        {
          type: 'DRONE_SIGHTING_3',
          changedBy: 'user2',
          changedAt: dayLater,
        },
      ]

      userService.getUsers.mockReset()
      userService.getUsers.mockResolvedValueOnce({
        [mockSharedUser.username]: mockSharedUser,
        [mockSharedUser2.username]: mockSharedUser2,
      })

      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Incident created as Assault by John Smith on 5 December 2023 at 12:34')
          expect(res.text).toContain('Incident updated to Drone sighting by John Smith on 5 December 2023 at 12:34')
          expect(res.text).toContain(
            'Incident updated to Find of illicit items by Mary Johnson on 6 December 2023 at 12:34',
          )
        })
    })
  })

  describe('When all sections of an inactive type are filled', () => {
    beforeEach(() => {
      mockedReport.type = 'DRONE_SIGHTING_1'
      mockedReport.status = 'REOPENED'
      mockedReport.description = 'An old drone sighting'
      mockedReport.questions = [
        makeSimpleQuestion('57179', 'Was a drone sighted in mid-flight', ['Yes', '208684']),
        makeSimpleQuestion('57180', 'What time was the drone(s) sighted.', ['12am to 6am', '208686']),
        makeSimpleQuestion('57181', 'Number of drones observed', ['1', '208690']),
        makeSimpleQuestion(
          '57184',
          'Where was the drone(s) sighted',
          ['Beyond the external perimeter border', '208696'],
          ['Exercise yard', '208697'],
        ),
      ]
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
          expect(res.text).toContain('Reopened')

          expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledWith(mockedReport.id)

          expect(userService.getUsers.mock.calls).toHaveLength(1)
          const users = userService.getUsers.mock.calls[0][1]
          users.sort()
          expect(users).toEqual(['abc12a', 'user1'])
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

          expect(res.text).not.toContain(`${viewReportUrl}/update-details`)
          expect(res.text).toContain(`${viewReportUrl}/change-type`)
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

    it('should render comments if there are correction requests', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Comments')
          expect(res.text).toContain('moj-timeline')
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

    it('should not render comments if there are no correction requests', () => {
      return request(app)
        .get(viewReportUrl)
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).not.toContain('Comments')
          expect(res.text).not.toContain('moj-timeline')
        })
    })
  })

  describe.each([
    {
      userType: 'reporting officers',
      user: { ...mockReportingOfficer, roles: [...mockReportingOfficer.roles, rolePecs] },
      prisonStatuses: ['DRAFT', 'NEEDS_UPDATING', 'REOPENED'],
      pecsStatuses: [],
    },
    {
      userType: 'data wardens',
      user: mockDataWarden,
      prisonStatuses: [],
      pecsStatuses: ['DRAFT', 'REOPENED'],
    },
    {
      userType: 'HQ viewers',
      user: { ...mockHqViewer, roles: [...mockHqViewer.roles, rolePecs] },
      prisonStatuses: [],
      pecsStatuses: [],
    },
  ])('“Check your answers” title', ({ userType, user, prisonStatuses, pecsStatuses }) => {
    beforeEach(() => {
      app = appWithAllRoutes({ services: { userService }, userSupplier: () => user })
      makeReportValid()
    })

    it.each(
      statuses.map(({ code: status }) => {
        return {
          status,
          visibility: prisonStatuses.includes(status) ? ('show' as const) : ('not show' as const),
        }
      }),
    )(`should $visibility on a prison report with status $status for ${userType}`, ({ status, visibility }) => {
      mockedReport.status = status

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          if (visibility === 'show') {
            expect(res.text).not.toContain('Incident report 6543')
            expect(res.text).toContain('Check your answers – incident report 6543')
          } else {
            expect(res.text).toContain('Incident report 6543')
            expect(res.text).not.toContain('Check your answers – incident report 6543')
          }
        })
    })

    it.each(
      possiblePecsStatuses.map(status => {
        return {
          status,
          visibility: pecsStatuses.includes(status) ? ('show' as const) : ('not show' as const),
        }
      }),
    )(`should $visibility on a PECS report with status $status for ${userType}`, ({ status, visibility }) => {
      mockedReport.location = 'NORTH'
      mockedReport.status = status

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          if (visibility === 'show') {
            expect(res.text).not.toContain('Incident report 6543')
            expect(res.text).toContain('Check your answers – incident report 6543')
          } else {
            expect(res.text).toContain('Incident report 6543')
            expect(res.text).not.toContain('Check your answers – incident report 6543')
          }
        })
    })
  })

  describe('Comments section', () => {
    function extractCommentsSection(html: string): string {
      const start = html.indexOf('app-correction-requests')
      const end = html.indexOf('govuk-summary-card', start)
      if (Number.isFinite(start) && Number.isFinite(end)) {
        return html.substring(start, end)
      }
      return ''
    }

    it('should render a NOMIS-style correction request without an associated user action', () => {
      mockedReport.correctionRequests = [
        {
          descriptionOfChange: 'NOMIS “requirements” may or may not be data wardens’ requests for amendments',
          userType: null,
          userAction: null,
          originalReportReference: null,
          correctionRequestedBy: 'user1',
          correctionRequestedAt: now,
        },
      ]

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          const comments = extractCommentsSection(res.text)
          expect(comments).toContain('>Comment<')
          expect(comments).toContain('John Smith')
          expect(comments).toContain('NOMIS “requirements” may or may not be data wardens’ requests for amendments')
        })
    })

    it('should render a correction request for REQUEST_REVIEW action', () => {
      mockedReport.correctionRequests = [
        {
          descriptionOfChange: 'Prisoner number added to description',
          userType: 'REPORTING_OFFICER',
          userAction: 'REQUEST_REVIEW',
          originalReportReference: null,
          correctionRequestedBy: 'user1',
          correctionRequestedAt: now,
        },
      ]

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          const comments = extractCommentsSection(res.text)
          expect(comments).toContain('Resubmitted')
          expect(comments).toContain('John Smith')
          expect(comments).toContain('Prisoner number added to description')
          expect(comments).not.toContain('Original report')
        })
    })

    it('should render a correction request for REQUEST_DUPLICATE action', () => {
      mockedReport.correctionRequests = [
        {
          descriptionOfChange: 'Looks the same',
          userType: 'REPORTING_OFFICER',
          userAction: 'REQUEST_DUPLICATE',
          originalReportReference: '1235',
          correctionRequestedBy: 'user1',
          correctionRequestedAt: now,
        },
      ]

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          const comments = extractCommentsSection(res.text)
          expect(comments).toContain('Request to remove duplicate report')
          expect(comments).toContain('John Smith')
          expect(comments).toContain('Looks the same')
          expect(comments).toContain('Original report')
          expect(comments).toContain('1235')
        })
    })

    it('should render a correction request for REQUEST_NOT_REPORTABLE action', () => {
      mockedReport.correctionRequests = [
        {
          descriptionOfChange: 'Nobody was hurt',
          userType: 'REPORTING_OFFICER',
          userAction: 'REQUEST_NOT_REPORTABLE',
          originalReportReference: null,
          correctionRequestedBy: 'user1',
          correctionRequestedAt: now,
        },
      ]

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          const comments = extractCommentsSection(res.text)
          expect(comments).toContain('Request to remove not reportable incident')
          expect(comments).toContain('John Smith')
          expect(comments).toContain('Nobody was hurt')
          expect(comments).not.toContain('Original report')
        })
    })

    it('should render a correction request for REQUEST_CORRECTION action', () => {
      mockedReport.correctionRequests = [
        {
          descriptionOfChange: 'Add prisoner number to description',
          userType: 'DATA_WARDEN',
          userAction: 'REQUEST_CORRECTION',
          originalReportReference: null,
          correctionRequestedBy: 'user1',
          correctionRequestedAt: now,
        },
      ]

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          const comments = extractCommentsSection(res.text)
          expect(comments).toContain('Sent back')
          expect(comments).toContain('John Smith')
          expect(comments).toContain('Add prisoner number to description')
          expect(comments).not.toContain('Original report')
        })
    })

    it('should render a correction request for HOLD action', () => {
      mockedReport.correctionRequests = [
        {
          descriptionOfChange: 'Need to check latest policy',
          userType: 'DATA_WARDEN',
          userAction: 'HOLD',
          originalReportReference: null,
          correctionRequestedBy: 'user1',
          correctionRequestedAt: now,
        },
      ]

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          const comments = extractCommentsSection(res.text)
          expect(comments).toContain('Put on hold')
          expect(comments).toContain('John Smith')
          expect(comments).toContain('Need to check latest policy')
          expect(comments).not.toContain('Original report')
        })
    })

    it('should render a correction request for MARK_DUPLICATE action', () => {
      mockedReport.correctionRequests = [
        {
          descriptionOfChange: 'Definitely the same',
          userType: 'DATA_WARDEN',
          userAction: 'MARK_DUPLICATE',
          originalReportReference: '1235',
          correctionRequestedBy: 'user1',
          correctionRequestedAt: now,
        },
      ]

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          const comments = extractCommentsSection(res.text)
          expect(comments).toContain('Report removed because of duplication')
          expect(comments).toContain('John Smith')
          expect(comments).toContain('Definitely the same')
          expect(comments).toContain('Original report')
          expect(comments).toContain('1235')
        })
    })

    it('should render a correction request for MARK_NOT_REPORTABLE action', () => {
      mockedReport.correctionRequests = [
        {
          descriptionOfChange: 'Not a reportable type',
          userType: 'DATA_WARDEN',
          userAction: 'MARK_NOT_REPORTABLE',
          originalReportReference: null,
          correctionRequestedBy: 'user1',
          correctionRequestedAt: now,
        },
      ]

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          const comments = extractCommentsSection(res.text)
          expect(comments).toContain('Report removed because incident not reportable')
          expect(comments).toContain('John Smith')
          expect(comments).toContain('Not a reportable type')
          expect(comments).not.toContain('Original report')
        })
    })

    it('should render a correction request for CLOSE action', () => {
      // NB: included for completeness though users cannot create this type of correction request
      mockedReport.correctionRequests = [
        {
          descriptionOfChange: 'No comments',
          userType: 'DATA_WARDEN',
          userAction: 'CLOSE',
          originalReportReference: null,
          correctionRequestedBy: 'user1',
          correctionRequestedAt: now,
        },
      ]

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          const comments = extractCommentsSection(res.text)
          expect(comments).toContain('Closed')
          expect(comments).toContain('John Smith')
          expect(comments).toContain('No comments')
          expect(comments).not.toContain('Original report')
        })
    })

    it('should not render placeholder comments inside correction requests', () => {
      mockedReport.correctionRequests = [
        {
          descriptionOfChange: '(Report is a duplicate of 1235)',
          userType: 'REPORTING_OFFICER',
          userAction: 'REQUEST_DUPLICATE',
          originalReportReference: '1235',
          correctionRequestedBy: 'user1',
          correctionRequestedAt: now,
        },
        {
          descriptionOfChange: '(Report is a duplicate of 1235)',
          userType: 'DATA_WARDEN',
          userAction: 'MARK_DUPLICATE',
          originalReportReference: '1235',
          correctionRequestedBy: 'user1',
          correctionRequestedAt: now,
        },
        {
          descriptionOfChange: '(Not reportable)',
          userType: 'DATA_WARDEN',
          userAction: 'MARK_NOT_REPORTABLE',
          originalReportReference: null,
          correctionRequestedBy: 'user1',
          correctionRequestedAt: now,
        },
      ]

      return request(app)
        .get(viewReportUrl)
        .expect(200)
        .expect(res => {
          const comments = extractCommentsSection(res.text)
          for (const unexpected of ['(Report is a duplicate of 1235)', '(Not reportable)']) {
            expect(comments).not.toContain(unexpected)
          }
        })
    })
  })

  describe('PECS report with unexpected statuses', () => {
    it.each(statuses.filter(({ code: status }) => !possiblePecsStatuses.includes(status)))(
      'should be corrected if status is $code',
      ({ code: status }) => {
        app = appWithAllRoutes({ userSupplier: () => mockDataWarden })
        mockedReport.location = 'NORTH'
        mockedReport.status = status
        incidentReportingApi.changeReportStatus.mockReset()

        return request(app)
          .get(viewReportUrl)
          .expect(302)
          .expect(res => {
            expect(res.redirect).toBe(true)
            expect(res.header.location).toEqual(`/reports/${mockedReport.id}`)
            expect(incidentReportingApi.changeReportStatus).toHaveBeenCalled()
          })
      },
    )
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    beforeEach(() => {
      mockedReport = convertReportDates(
        mockReport({ reportReference: '6543', reportDateAndTime: now, status: 'DRAFT', withDetails: true }),
      )
      mockedReport.questions = [
        // NB: all questions are complete
        makeSimpleQuestion('67179', 'DESCRIBE HOW THE ITEM WAS FOUND (SELECT ALL THAT APPLY)', [
          'INFORMATION RECEIVED',
          '218695',
        ]),
        makeSimpleQuestion('67180', 'IS THE LOCATION OF THE INCIDENT KNOWN?', ['NO', '218710']),
        makeSimpleQuestion('67182', 'DESCRIBE THE METHOD OF ENTRY INTO THE ESTABLISHMENT', ['UNKNOWN', '218741']),
        makeSimpleQuestion('67184', 'IF FOUND IN POSSESSION, WHOSE WAS IT FOUND IN?', ['NOT APPLICABLE', '218756']),
        makeSimpleQuestion('67186', 'WHAT WAS THE METHOD OF CONCEALMENT', ['IN HAND', '218774']),
        makeSimpleQuestion('67187', 'PLEASE SELECT CATEGORY OF FIND', [
          'OTHER REPORTABLE ITEMS (BY NATIONAL OR LOCAL POLICY)',
          '218790',
        ]),
        makeSimpleQuestion('67204', 'OTHER REPORTABLE ITEMS FOUND (BY NATIONAL OR LOCAL POLICY)', [
          'YES (NOOSE / LIGATURE)',
          '218951',
        ]),
        makeSimpleQuestion('67226', 'WERE THE ITEMS OBTAINED ON TEMPORARY RELEASE?', ['NO', '219123']),
      ]
      incidentReportingApi.getReportWithDetailsById.mockReset()
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
      viewReportUrl = `/reports/${mockedReport.id}`
    })

    describe.each([
      { userType: 'reporting officer', user: mockReportingOfficer, canView: true, canEdit: true },
      { userType: 'data warden', user: mockDataWarden, canView: true, canEdit: false },
      { userType: 'HQ view-only user', user: mockHqViewer, canView: true, canEdit: false },
      { userType: 'unauthorised user', user: mockUnauthorisedUser, canView: false, canEdit: false },
    ])('for $userType', ({ user, canView, canEdit }) => {
      it(`should ${canView ? 'grant' : 'deny'} viewing a prison report`, () => {
        const testRequest = request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
          .get(viewReportUrl)
          .redirects(1)
        if (canView) {
          return testRequest.expect(200).expect(res => {
            const canEditTextMatcher = canEdit ? expect(res.text).toContain : expect(res.text).not.toContain
            ;[
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
          })
        }
        return testRequest.expect(res => {
          expect(res.redirects[0]).toContain('/sign-out')
        })
      })

      it(`should ${canEdit ? 'warn' : 'not warn'} that prison report is only editable in NOMIS`, () => {
        const testApp = appWithAllRoutes({ services: { userService }, userSupplier: () => user })
        setActiveAgencies(['LEI'])

        return request(testApp)
          .get(viewReportUrl)
          .expect(res => {
            const warningShows = res.text.includes('This report can only be amended in NOMIS')
            expect(warningShows).toBe(canEdit)
          })
      })
    })
  })
})

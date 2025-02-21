import type { Express } from 'express'
import request from 'supertest'

import config from '../../config'
import { PrisonApi } from '../../data/prisonApi'
import { appWithAllRoutes } from '../testutils/appSetup'
import { now } from '../../testutils/fakeClock'
import UserService from '../../services/userService'
import { IncidentReportingApi } from '../../data/incidentReportingApi'
import { OffenderSearchApi, type OffenderSearchResult } from '../../data/offenderSearchApi'
import { mockErrorResponse, mockReport } from '../../data/testData/incidentReporting'
import { makeSimpleQuestion } from '../../data/testData/incidentReportingJest'
import { mockThrownError } from '../../data/testData/thrownErrors'
import { convertReportWithDetailsDates } from '../../data/incidentReportingApiUtils'
import type { User } from '../../data/manageUsersApiClient'
import { leeds, moorland } from '../../data/testData/prisonApi'
import { andrew } from '../../data/testData/offenderSearch'
import { reportingUser, approverUser, hqUser, unauthorisedUser } from '../../data/testData/users'

jest.mock('../../data/prisonApi')
jest.mock('../../data/incidentReportingApi')
jest.mock('../../data/offenderSearchApi')
jest.mock('../../services/userService')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let userService: jest.Mocked<UserService>
let prisonApi: jest.Mocked<PrisonApi>
let offenderSearchApi: jest.Mocked<OffenderSearchApi>

beforeEach(() => {
  userService = UserService.prototype as jest.Mocked<UserService>
  app = appWithAllRoutes({ services: { userService } })
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
  offenderSearchApi = OffenderSearchApi.prototype as jest.Mocked<OffenderSearchApi>

  const users: Record<string, User> = {
    user1: {
      username: 'user1',
      name: 'John Smith',
    },
    lev79n: {
      username: 'lev79n',
      name: 'Barry Harrison',
    },
  }
  userService.getUsers.mockResolvedValueOnce(users)

  const prisons = {
    LEI: leeds,
    MDI: moorland,
  }
  prisonApi.getPrisons.mockResolvedValue(prisons)

  const prisoners: Record<string, OffenderSearchResult> = { A1111AA: andrew }
  offenderSearchApi.getPrisoners.mockResolvedValue(prisoners)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET view report page with details', () => {
  let viewReportUrl: string

  beforeEach(() => {
    const mockedReport = convertReportWithDetailsDates(
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

  it('should render report page with all sections', () => {
    return request(app)
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Incident reference 6543')
        expect(res.text).toContain('Reported by John Smith in Moorland (HMP &amp; YOI)')
        expect(res.text).toContain('Finds')
        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
      })
  })

  it('should render incident details', () => {
    return request(app)
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Date and time of incident')
        expect(res.text).toContain('5 December 2023, 11:34')
        expect(res.text).toContain('Description')
        expect(res.text).toContain('A new incident created in the new service of type FINDS')
      })
  })

  it('should render incident type with correct formatting', () => {
    return request(app)
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Finds')
      })
  })

  it('should render prisoners involved with roles and outcomes. Names correct if available', () => {
    return request(app)
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Andrew Arnold')
        expect(res.text).toContain('Role: Active involvement')
        expect(res.text).toContain('Outcome: Investigation (local)')
        expect(res.text).toContain('Details: Comment about A1111AA')
        expect(res.text).toContain('A2222BB')
        expect(res.text).toContain('Role: Suspected involved')
        expect(res.text).toContain('Outcome: No outcome')
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
        expect(res.text).toContain('abc12a')
        expect(res.text).toContain('Actively involved')
      })
  })

  it('should render question responses', () => {
    return request(app)
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('1. Describe how the item was found')
        expect(res.text).toContain('Cell search')
        expect(res.text).toContain('Information received')
        expect(res.text).not.toContain('Unusual behaviour')
        expect(res.text).toContain(`${viewReportUrl}/questions/67179`)

        expect(res.text).toContain('2. Is the location of the incident known?')
        expect(res.text).toContain(`${viewReportUrl}/questions/67180`)

        expect(res.text).toContain('What was the location of the incident?')
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

describe('GET view report page without details', () => {
  let viewReportUrl: string

  beforeEach(() => {
    const mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    mockedReport.questions = []
    mockedReport.staffInvolved = []
    mockedReport.prisonersInvolved = []
    mockedReport.correctionRequests = []

    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
    viewReportUrl = `/reports/${mockedReport.id}`
  })

  it('should render report page with all sections', () => {
    return request(app)
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Incident reference 6543')
        expect(res.text).toContain('Reported by John Smith in Moorland (HMP &amp; YOI)')
        expect(res.text).toContain('Finds')
        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
      })
  })

  it('should render incident details', () => {
    return request(app)
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Date and time of incident')
        expect(res.text).toContain('5 December 2023, 11:34')
        expect(res.text).toContain('Description')
        expect(res.text).toContain('A new incident created in the new service of type FINDS')
      })
  })

  it('should render incident type with correct formatting', () => {
    return request(app)
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Finds')
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
        expect(res.text).toContain('Question responses')
        expect(res.text).toContain('No responses')
      })
  })

  it('should render correction requests', () => {
    return request(app)
      .get(viewReportUrl)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Correction requests')
        expect(res.text).toContain('No corrections found')
        expect(res.text).toContain('Add a correction')
      })
  })
})

describe('Report viewing permissions', () => {
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
    { userType: 'data warden', user: approverUser, action: granted, canEdit: true },
    { userType: 'HQ view-only user', user: hqUser, action: granted, canEdit: false },
    { userType: 'unauthorised user', user: unauthorisedUser, action: denied, canEdit: false },
  ])('should be $action to $userType', ({ user, action, canEdit }) => {
    const testRequest = request(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
      .get(`/reports/${reportId}`)
      .redirects(1)
    if (action === 'granted') {
      return testRequest.expect(200).expect(res => {
        if (canEdit) {
          expect(res.text).toContain('question responses')
        } else {
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

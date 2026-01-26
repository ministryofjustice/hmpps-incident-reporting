import type { Express } from 'express'
import request, { type Agent, type Response } from 'supertest'

import { appWithAllRoutes } from '../../testutils/appSetup'
import { mockHandleReportEdit } from '../../testutils/handleReportEdit'
import {
  IncidentReportingApi,
  RelatedObjects,
  type DescriptionAddendum,
  type AddDescriptionAddendumRequest,
  type UpdateDescriptionAddendumRequest,
} from '../../../data/incidentReportingApi'
import { convertReportDates } from '../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { mockSharedUser } from '../../../data/testData/manageUsers'
import { mockDataWarden, mockReportingOfficer, mockHqViewer, mockUnauthorisedUser } from '../../../data/testData/users'
import UserService from '../../../services/userService'
import type { Status } from '../../../reportConfiguration/constants'

jest.mock('../../../data/incidentReportingApi')
jest.mock('../../../services/userService')
jest.mock('../actions/handleReportEdit')

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
const incidentReportingRelatedObjects = RelatedObjects.prototype as jest.Mocked<
  RelatedObjects<DescriptionAddendum, AddDescriptionAddendumRequest, UpdateDescriptionAddendumRequest>
>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore need to mock a getter method
incidentReportingApi.descriptionAddendums = incidentReportingRelatedObjects
const userService = UserService.prototype as jest.Mocked<UserService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({ services: { userService } })
  userService.getUsers.mockResolvedValueOnce({
    [mockSharedUser.username]: mockSharedUser,
  })
  mockHandleReportEdit.withoutSideEffect()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Adding a description addendum to report', () => {
  const incidentDateAndTime = new Date('2024-10-21T16:32:00+01:00')
  const mockedReport = convertReportDates(
    mockReport({
      type: 'DISORDER_2',
      status: 'NEEDS_UPDATING',
      reportReference: '6544',
      reportDateAndTime: incidentDateAndTime,
      withDetails: true,
      withAddendums: true,
    }),
  )
  const addDescriptionAddendumUrl = `/reports/${mockedReport.id}/add-description`
  const validPayload = {
    descriptionAddendum: 'Additional information',
  }

  let agent: Agent

  beforeEach(() => {
    agent = request.agent(app)
    incidentReportingApi.getReportWithDetailsById.mockResolvedValue(mockedReport)
  })

  function expectOnDescriptionAddendumPage(res: Response): void {
    expect(res.request.url.endsWith(addDescriptionAddendumUrl)).toBe(true)
    expect(res.text).toContain('app-description-addendum')
    expect(res.text).toContain('Incident description')
  }

  function expectRedirectToReportPage(res: Response): void {
    expect(res.redirect).toBe(true)
    expect(res.header.location).toEqual(`/reports/${mockedReport.id}`)
  }

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return agent
      .get(addDescriptionAddendumUrl)
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should display existing description addenda along with new entry text box', () => {
    return agent
      .get(addDescriptionAddendumUrl)
      .expect(200)
      .expect(res => {
        expectOnDescriptionAddendumPage(res)
        expect(res.text).not.toContain('There is a problem')
        expect(res.text).toContain('Incident description')
        expect(res.text).toContain('21 October 2024 at 16:32')
        expect(res.text).toContain('A new incident created in the new service of type DISORDER_2')
        expect(res.text).toContain('John Smith')
        expect(res.text).toContain('Addendum #1')
        expect(res.text).toContain('Jane Doe')
        expect(res.text).toContain('Addendum #2')
        expect(res.text).toContain('Add information to the description')
        expect(res.text).toContain('descriptionAddendum')

        expect(userService.getUsers).toHaveBeenCalledWith('test-system-token', ['user1'])
      })
  })

  it('should show an error if additional description is left empty', () => {
    const invalidPayload = {
      ...validPayload,
      descriptionAddendum: '',
    }
    return agent
      .post(addDescriptionAddendumUrl)
      .send(invalidPayload)
      .redirects(1)
      .expect(200)
      .expect(res => {
        expectOnDescriptionAddendumPage(res)
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Enter some additional information')
        expect(incidentReportingRelatedObjects.addToReport).not.toHaveBeenCalled()
        mockHandleReportEdit.expectNotCalled()
      })
  })

  it('should send request to API if form is valid and return to report page', () => {
    incidentReportingRelatedObjects.addToReport.mockResolvedValueOnce([]) // NB: response is ignored

    return agent
      .post(addDescriptionAddendumUrl)
      .send(validPayload)
      .redirects(0)
      .expect(302)
      .expect(res => {
        expectRedirectToReportPage(res)
        expect(incidentReportingRelatedObjects.addToReport).toHaveBeenCalledWith(mockedReport.id, {
          firstName: 'JOHN',
          lastName: 'SMITH',
          text: 'Additional information',
        })
        mockHandleReportEdit.expectCalled()
      })
  })

  it('should show an error if API rejects description addendum', () => {
    const error = mockThrownError(mockErrorResponse({ message: 'Description is too short' }))
    incidentReportingRelatedObjects.addToReport.mockRejectedValueOnce(error)

    return agent
      .post(addDescriptionAddendumUrl)
      .send(validPayload)
      .redirects(1)
      .expect(200)
      .expect(res => {
        expectOnDescriptionAddendumPage(res)
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Sorry, there was a problem with your request')
        expect(res.text).not.toContain('Bad Request')
        expect(res.text).not.toContain('Description is too short')
      })
  })

  it('should show an error if API rejects (possible) status change', () => {
    incidentReportingRelatedObjects.addToReport.mockResolvedValueOnce([]) // NB: response is ignored
    mockHandleReportEdit.failure()

    return agent
      .post(addDescriptionAddendumUrl)
      .send(validPayload)
      .redirects(1)
      .expect(200)
      .expect(res => {
        expectOnDescriptionAddendumPage(res)
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Sorry, there was a problem with your request')
      })
  })

  describe('Cannot be used before data warden review', () => {
    afterAll(() => {
      mockedReport.status = 'NEEDS_UPDATING'
    })

    const scenarios: {
      status: Status
      result:
        | 'allow appending to the description'
        | 'redirect to incident date and description page'
        | 'forbid appending to the description'
    }[] = [
      { status: 'DRAFT', result: 'redirect to incident date and description page' },
      { status: 'AWAITING_REVIEW', result: 'forbid appending to the description' },
      { status: 'ON_HOLD', result: 'forbid appending to the description' },
      { status: 'NEEDS_UPDATING', result: 'allow appending to the description' },
      { status: 'UPDATED', result: 'forbid appending to the description' },
      { status: 'CLOSED', result: 'forbid appending to the description' },
      { status: 'DUPLICATE', result: 'forbid appending to the description' },
      { status: 'NOT_REPORTABLE', result: 'forbid appending to the description' },
      { status: 'REOPENED', result: 'allow appending to the description' },
      { status: 'WAS_CLOSED', result: 'forbid appending to the description' },
    ]
    it.each(scenarios)('should $result when report status is $status', ({ status, result }) => {
      mockedReport.status = status
      const testAgent = agent.get(addDescriptionAddendumUrl).redirects(1)
      if (result === 'allow appending to the description') {
        return testAgent.expect(200)
      }
      return testAgent.expect(res => {
        const redirectedTo = res.redirects[0]
        if (result === 'redirect to incident date and description page') {
          expect(redirectedTo).toContain(`/reports/${mockedReport.id}/update-details`)
        } else {
          expect(redirectedTo).toContain('/sign-out')
        }
      })
    })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: mockReportingOfficer, action: granted },
      { userType: 'data warden', user: mockDataWarden, action: denied },
      { userType: 'HQ view-only user', user: mockHqViewer, action: denied },
      { userType: 'unauthorised user', user: mockUnauthorisedUser, action: denied },
    ])('should be $action to $userType', ({ user, action }) => {
      const testRequest = request
        .agent(appWithAllRoutes({ services: { userService }, userSupplier: () => user }))
        .get(addDescriptionAddendumUrl)
        .redirects(1)
      if (action === 'granted') {
        return testRequest.expect(200)
      }
      return testRequest.expect(res => {
        expect(res.redirects[0]).toContain('/sign-out')
      })
    })
  })
})

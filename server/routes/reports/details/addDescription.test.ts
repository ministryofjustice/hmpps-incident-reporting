import type { Express } from 'express'
import request, { type Agent, type Response } from 'supertest'

import { appWithAllRoutes } from '../../testutils/appSetup'
import {
  IncidentReportingApi,
  RelatedObjects,
  type DescriptionAddendum,
  type AddDescriptionAddendumRequest,
  type UpdateDescriptionAddendumRequest,
} from '../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../data/testData/thrownErrors'
import { mockSharedUser } from '../../../data/testData/manageUsers'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../data/testData/users'
import UserService from '../../../services/userService'
import type { Status } from '../../../reportConfiguration/constants'

jest.mock('../../../data/incidentReportingApi')
jest.mock('../../../services/userService')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>
let incidentReportingRelatedObjects: jest.Mocked<
  RelatedObjects<DescriptionAddendum, AddDescriptionAddendumRequest, UpdateDescriptionAddendumRequest>
>
let userService: jest.Mocked<UserService>

beforeEach(() => {
  userService = UserService.prototype as jest.Mocked<UserService>
  userService.getUsers.mockResolvedValueOnce({
    [mockSharedUser.username]: mockSharedUser,
  })

  app = appWithAllRoutes({ services: { userService } })
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
  incidentReportingRelatedObjects = RelatedObjects.prototype as jest.Mocked<
    RelatedObjects<DescriptionAddendum, AddDescriptionAddendumRequest, UpdateDescriptionAddendumRequest>
  >
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore need to mock a getter method
  incidentReportingApi.descriptionAddendums = incidentReportingRelatedObjects
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Adding a description addendum to report', () => {
  const incidentDateAndTime = new Date('2024-10-21T16:32:00+01:00')
  const mockedReport = convertReportWithDetailsDates(
    mockReport({
      type: 'DISORDER_2',
      status: 'ON_HOLD',
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
      })
  })

  it('should show an error if API rejects request', () => {
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

  describe('redirect if status before DW has seen report', () => {
    const scenarios: { status: Status; redirect: boolean }[] = [
      { status: 'DRAFT', redirect: true },
      { status: 'AWAITING_REVIEW', redirect: true },
      { status: 'ON_HOLD', redirect: false },
      { status: 'NEEDS_UPDATING', redirect: false },
      { status: 'UPDATED', redirect: false },
      { status: 'CLOSED', redirect: false },
      { status: 'DUPLICATE', redirect: false },
      { status: 'NOT_REPORTABLE', redirect: false },
      { status: 'REOPENED', redirect: false },
      { status: 'WAS_CLOSED', redirect: false },
    ]
    it.each(scenarios)('report status of $status redirects page: $redirect', ({ status, redirect }) => {
      mockedReport.status = status
      const testAgent = agent.get(addDescriptionAddendumUrl).redirects(1)
      if (!redirect) {
        return testAgent.expect(200)
      }
      return testAgent.expect(res => {
        expect(res.redirects[0]).toContain(`/reports/${mockedReport.id}/update-details`)
      })
    })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: reportingUser, action: granted },
      { userType: 'data warden', user: approverUser, action: denied },
      { userType: 'HQ view-only user', user: hqUser, action: denied },
      { userType: 'unauthorised user', user: unauthorisedUser, action: denied },
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

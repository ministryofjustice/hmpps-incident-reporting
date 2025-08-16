import type { Express } from 'express'
import request from 'supertest'

import { IncidentReportingApi, ReportWithDetails } from '../../../../data/incidentReportingApi'
import { convertReportDates } from '../../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import {
  mockDataWarden,
  mockReportingOfficer,
  mockHqViewer,
  mockUnauthorisedUser,
} from '../../../../data/testData/users'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { mockHandleReportEdit } from '../../../testutils/handleReportEdit'
import { now } from '../../../../testutils/fakeClock'

jest.mock('../../../../data/incidentReportingApi')
jest.mock('../../actions/handleReportEdit')

const incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes()

  mockHandleReportEdit.withoutSideEffect()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Staff involvement summary for report', () => {
  let mockedReport: ReportWithDetails

  beforeEach(() => {
    mockedReport = convertReportDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
  })

  function summaryUrl(createJourney = false): string {
    if (createJourney) {
      return `/create-report/${mockedReport.id}/staff`
    }
    return `/reports/${mockedReport.id}/staff`
  }

  it.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])('should 404 if report is not found ($scenario)', ({ createJourney }) => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return request(app)
      .get(
        createJourney
          ? '/create-report/01852368-477f-72e9-a239-265ad6e9ec56/staff'
          : '/reports/01852368-477f-72e9-a239-265ad6e9ec56/staff',
      )
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])('should render staff summary table ($scenario) for DPS report with existing involvements', ({ createJourney }) => {
    return request(app)
      .get(summaryUrl(createJourney))
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-staff-summary')

        expect(res.text).toContain('Staff involved')
        expect(res.text).toContain('Mary Johnson')
        expect(res.text).toContain('Actively involved')
        expect(res.text).toContain('Comment about Mary')
        expect(res.text).toContain('Remove')
        expect(res.text).toContain('Edit')
        expect(res.text).toContain('Do you want to add another member of staff?')
        expect(res.text).not.toContain('Do you want to add a member of staff to the report?')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')
        // TODO: test links

        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        mockHandleReportEdit.expectNotCalled()
      })
  })

  it.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])('should not render staff summary table if no existing involvements ($scenario)', ({ createJourney }) => {
    mockedReport.staffInvolved = []

    return request(app)
      .get(summaryUrl(createJourney))
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-staff-summary')

        expect(res.text).toContain('No staff members have been added to this incident report.')
        expect(res.text).not.toContain('Remove')
        expect(res.text).not.toContain('Edit')
        expect(res.text).toContain('Do you want to add a member of staff?')
        expect(res.text).not.toContain('Do you want to add a member of staff to the report?')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')

        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        mockHandleReportEdit.expectNotCalled()
      })
  })

  it.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])('should show an error if user does not choose an option when continuing ($scenario)', ({ createJourney }) => {
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)

    return request
      .agent(app)
      .post(summaryUrl(createJourney))
      .send({})
      .redirects(1)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-staff-summary')

        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Select yes if you want to add a member of staff')

        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        mockHandleReportEdit.expectNotCalled()
      })
  })

  it.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])('should redirect to search page ($scenario) if user chooses to add involvements', ({ createJourney }) => {
    return request(app)
      .post(summaryUrl(createJourney))
      .send({ confirmAdd: 'yes' })
      .expect(302)
      .expect(res => {
        if (createJourney) {
          expect(res.headers.location).toEqual(`/create-report/${mockedReport.id}/staff/search`)
        } else {
          expect(res.headers.location).toEqual(`/reports/${mockedReport.id}/staff/search`)
        }
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        mockHandleReportEdit.expectNotCalled()
      })
  })

  it.each([
    { scenario: 'redirect to questions section (when continuing create journey)', createJourney: true },
    {
      scenario: 'redirect to report page (when exiting create journey)',
      createJourney: true,
      formAction: 'exit' as const,
    },
    { scenario: 'redirect to report page (normally)', createJourney: false },
  ])('should $scenario if user chooses not to add involvements', ({ createJourney, formAction }) => {
    return request(app)
      .post(summaryUrl(createJourney))
      .send({ confirmAdd: 'no', formAction })
      .expect(302)
      .expect(res => {
        if (createJourney && formAction !== 'exit') {
          expect(res.headers.location).toEqual(`/create-report/${mockedReport.id}/questions`)
        } else {
          expect(res.headers.location).toEqual(`/reports/${mockedReport.id}`)
        }
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        mockHandleReportEdit.expectNotCalled()
      })
  })

  describe('…when involvements haven’t been added yet', () => {
    beforeEach(() => {
      mockedReport.staffInvolved = []
      mockedReport.staffInvolvementDone = false
    })

    it('should show option to skip adding staff', () => {
      return request(app)
        .get(summaryUrl())
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('app-staff-request')

          expect(res.text).not.toContain('No staff have been added to this incident report.')
          expect(res.text).not.toContain('Remove')
          expect(res.text).not.toContain('Edit')

          expect(res.text).toContain('Do you want to add a member of staff to the report?')
          expect(res.text).toContain('Do you want to add a member of staff?')
          expect(res.text).toContain('Skip for now')
          expect(res.text).toContain('Continue')
          expect(res.text).not.toContain('Save and exit')

          expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
          mockHandleReportEdit.expectNotCalled()
        })
    })

    it('should show an error if user does not choose an option when continuing', () => {
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)

      return request
        .agent(app)
        .post(summaryUrl())
        .send({})
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('app-staff-request')

          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Select yes if you want to add a member of staff')

          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
          mockHandleReportEdit.expectNotCalled()
        })
    })

    it.each([
      { scenario: 'during create journey', createJourney: true },
      { scenario: 'normally', createJourney: false },
    ])('should redirect to search page ($scenario) if user chooses to add involvements', ({ createJourney }) => {
      return request(app)
        .post(summaryUrl(createJourney))
        .send({ confirmAdd: 'yes' })
        .expect(302)
        .expect(res => {
          if (createJourney) {
            expect(res.headers.location).toEqual(`/create-report/${mockedReport.id}/staff/search`)
          } else {
            expect(res.headers.location).toEqual(`/reports/${mockedReport.id}/staff/search`)
          }
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
          mockHandleReportEdit.expectNotCalled()
        })
    })

    it.each([
      { scenario: 'redirect to questions section (when continuing create journey)', createJourney: true },
      {
        scenario: 'redirect to report page (when exiting create journey)',
        createJourney: true,
        formAction: 'exit' as const,
      },
      { scenario: 'redirect to report page (normally)', createJourney: false },
    ])('should $scenario if user chooses not to add involvements', ({ createJourney, formAction }) => {
      return request(app)
        .post(summaryUrl(createJourney))
        .send({ confirmAdd: 'no', formAction })
        .expect(302)
        .expect(res => {
          if (createJourney && formAction !== 'exit') {
            expect(res.headers.location).toEqual(`/create-report/${mockedReport.id}/questions`)
          } else {
            expect(res.headers.location).toEqual(`/reports/${mockedReport.id}`)
          }
          expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
            staffInvolvementDone: true,
          })
          mockHandleReportEdit.expectCalled()
        })
    })

    it.each([
      { scenario: 'during create journey', createJourney: true },
      { scenario: 'normally', createJourney: false },
    ])('should show an error if API rejects update $scenario', ({ createJourney }) => {
      const error = mockThrownError(mockErrorResponse({ message: 'Confirmation took too long' }))
      incidentReportingApi.updateReport.mockRejectedValueOnce(error)
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport) // due to redirect

      return request
        .agent(app)
        .post(summaryUrl(createJourney))
        .send({ confirmAdd: 'no' })
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Sorry, there was a problem with your request')
          expect(res.text).not.toContain('Bad Request')
          expect(res.text).not.toContain('Confirmation took too long')
        })
    })

    it.each([
      { scenario: 'during create journey', createJourney: true },
      { scenario: 'normally', createJourney: false },
    ])('should show an error if API rejects (possible) status change $scenario', ({ createJourney }) => {
      mockHandleReportEdit.failure()
      incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport) // due to redirect

      return request
        .agent(app)
        .post(summaryUrl(createJourney))
        .send({ confirmAdd: 'no' })
        .redirects(1)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Sorry, there was a problem with your request')
        })
    })

    it.each([
      { scenario: 'redirect to questions section (when continuing create journey)', createJourney: true },
      {
        scenario: 'redirect to report page (when exiting create journey)',
        createJourney: true,
        formAction: 'exit' as const,
      },
      { scenario: 'redirect to report page (normally)', createJourney: false },
    ])('should $scenario if user chooses to skip adding involvements', ({ createJourney, formAction }) => {
      return request(app)
        .post(summaryUrl(createJourney))
        .send({ confirmAdd: 'skip', formAction })
        .expect(302)
        .expect(res => {
          if (createJourney && formAction !== 'exit') {
            expect(res.headers.location).toEqual(`/create-report/${mockedReport.id}/questions`)
          } else {
            expect(res.headers.location).toEqual(`/reports/${mockedReport.id}`)
          }
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
          mockHandleReportEdit.expectNotCalled()
        })
    })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    const granted = 'granted' as const
    const denied = 'denied' as const

    describe.each([
      { scenario: 'during create journey', createJourney: true },
      { scenario: 'normally', createJourney: false },
    ])('$scenario', ({ createJourney }) => {
      it.each([
        { userType: 'reporting officer', user: mockReportingOfficer, action: granted },
        { userType: 'data warden', user: mockDataWarden, action: denied },
        { userType: 'HQ view-only user', user: mockHqViewer, action: denied },
        { userType: 'unauthorised user', user: mockUnauthorisedUser, action: denied },
      ])('should be $action to $userType', ({ user, action }) => {
        const testRequest = request(appWithAllRoutes({ userSupplier: () => user }))
          .get(summaryUrl(createJourney))
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
})

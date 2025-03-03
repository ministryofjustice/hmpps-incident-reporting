import type { Express } from 'express'
import request from 'supertest'

import { IncidentReportingApi, ReportWithDetails } from '../../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import { approverUser, hqUser, reportingUser, unauthorisedUser } from '../../../../data/testData/users'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'

jest.mock('../../../../data/incidentReportingApi')

let app: Express
let incidentReportingApi: jest.Mocked<IncidentReportingApi>

beforeEach(() => {
  app = appWithAllRoutes()
  incidentReportingApi = IncidentReportingApi.prototype as jest.Mocked<IncidentReportingApi>
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Staff involvement summary for report', () => {
  let mockedReport: ReportWithDetails

  beforeEach(() => {
    mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
  })

  function summaryUrl(): string {
    return `/reports/${mockedReport.id}/staff`
  }

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return request(app)
      .get('/reports/01852368-477f-72e9-a239-265ad6e9ec56/staff')
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should render staff summary table and add staff form for DPS report with existing staff involved', () => {
    return request(app)
      .get(summaryUrl())
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
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')
        // TODO: test links

        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
      })
  })

  it('should not render staff summary table and only add staff form if no existing staff involved', () => {
    mockedReport.staffInvolved = []

    return request(app)
      .get(summaryUrl())
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-staff-summary')

        expect(res.text).toContain('No staff members have been added to this incident report.')
        expect(res.text).not.toContain('Role')
        expect(res.text).not.toContain('>Details')
        expect(res.text).not.toContain('Action')
        expect(res.text).not.toContain('Remove')
        expect(res.text).not.toContain('Edit')
        expect(res.text).toContain('Do you want to add a member of staff?')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')

        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
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
        expect(res.text).toContain('app-staff-summary')

        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Select if you would like to add another staff member to continue')

        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
      })
  })

  it('should redirect to search page is user choses to add involvements', () => {
    return request(app)
      .post(summaryUrl())
      .send({ confirmAdd: 'yes' })
      .expect(302)
      .expect(res => {
        expect(res.headers.location).toEqual(`/reports/${mockedReport.id}/staff/search`)
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
      })
  })

  it('should redirect to report page is user choses to not add involvements', () => {
    return request(app)
      .post(summaryUrl())
      .send({ confirmAdd: 'no' })
      .expect(302)
      .expect(res => {
        expect(res.headers.location).toEqual(`/reports/${mockedReport.id}`)
        expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
          staffInvolvementDone: true,
        })
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
          expect(res.text).not.toContain('Role')
          expect(res.text).not.toContain('Outcome')
          expect(res.text).not.toContain('>Details')
          expect(res.text).not.toContain('Action')
          expect(res.text).not.toContain('Remove')
          expect(res.text).not.toContain('Edit')
          expect(res.text).not.toContain('Do you want to add a member of staff?')

          expect(res.text).toContain('Were any staff involved in the incident?')
          expect(res.text).toContain('Skip for now')
          expect(res.text).toContain('Continue')
          expect(res.text).not.toContain('Save and exit')

          expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
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
          expect(res.text).toContain('Select if you would like to add another staff member to continue')

          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    })

    it('should redirect to search page is user choses to add involvements', () => {
      return request(app)
        .post(summaryUrl())
        .send({ confirmAdd: 'yes' })
        .expect(302)
        .expect(res => {
          expect(res.headers.location).toEqual(`/reports/${mockedReport.id}/staff/search`)
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    })

    it('should redirect to report page is user choses to not add involvements', () => {
      return request(app)
        .post(summaryUrl())
        .send({ confirmAdd: 'no' })
        .expect(302)
        .expect(res => {
          expect(res.headers.location).toEqual(`/reports/${mockedReport.id}`)
          expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
            staffInvolvementDone: true,
          })
        })
    })

    it('should redirect to report page is user choses to skip adding involvements', () => {
      return request(app)
        .post(summaryUrl())
        .send({ confirmAdd: 'skip' })
        .expect(302)
        .expect(res => {
          expect(res.headers.location).toEqual(`/reports/${mockedReport.id}`)
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    })
  })

  describe('Permissions', () => {
    // NB: these test cases are simplified because the permissions class methods are thoroughly tested elsewhere

    const granted = 'granted' as const
    const denied = 'denied' as const
    it.each([
      { userType: 'reporting officer', user: reportingUser, action: granted },
      { userType: 'data warden', user: approverUser, action: granted },
      { userType: 'HQ view-only user', user: hqUser, action: denied },
      { userType: 'unauthorised user', user: unauthorisedUser, action: denied },
    ])('should be $action to $userType', ({ user, action }) => {
      const testRequest = request(appWithAllRoutes({ userSupplier: () => user }))
        .get(summaryUrl())
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

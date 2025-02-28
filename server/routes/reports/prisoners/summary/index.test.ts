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

describe('Prisoner involvement summary for report', () => {
  let mockedReport: ReportWithDetails

  beforeEach(() => {
    mockedReport = convertReportWithDetailsDates(
      mockReport({ reportReference: '6543', reportDateAndTime: now, withDetails: true }),
    )
    incidentReportingApi.getReportWithDetailsById.mockResolvedValueOnce(mockedReport)
  })

  function summaryUrl(): string {
    return `/reports/${mockedReport.id}/prisoners`
  }

  it('should 404 if report is not found', () => {
    const error = mockThrownError(mockErrorResponse({ status: 404, message: 'Report not found' }), 404)
    incidentReportingApi.getReportWithDetailsById.mockReset()
    incidentReportingApi.getReportWithDetailsById.mockRejectedValueOnce(error)

    return request(app)
      .get('/reports/01852368-477f-72e9-a239-265ad6e9ec56/prisoners')
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it('should render prisoner summary table with no outcome column and add prisoner form for DPS report with existing prisoners involved', () => {
    return request(app)
      .get(summaryUrl())
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-prisoner-summary')

        expect(res.text).toContain('Prisoners involved')
        expect(res.text).toContain('A1111AA: Andrew Arnold')
        expect(res.text).toContain('Active involvement')
        expect(res.text).not.toContain('Investigation (local)')
        expect(res.text).toContain('Comment about A1111AA')
        expect(res.text).toContain('Remove')
        expect(res.text).toContain('Edit')
        expect(res.text).toContain('Do you want to add another prisoner?')
        expect(res.text).not.toContain('Were any prisoners involved in the incident?')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')
        expect(res.text).not.toContain('Skip for now')
        // TODO: test links

        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
      })
  })

  it('should render prisoner summary table with outcome column and add prisoner form for NOMIS report with existing prisoners involved', () => {
    Object.assign(
      mockedReport,
      convertReportWithDetailsDates(
        mockReport({ reportReference: '6543', reportDateAndTime: now, createdInNomis: true, withDetails: true }),
      ),
    )

    return request(app)
      .get(summaryUrl())
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-prisoner-summary')

        expect(res.text).toContain('Prisoners involved')
        expect(res.text).toContain('A1111AA: Andrew Arnold')
        expect(res.text).toContain('Active involvement')
        expect(res.text).toContain('Investigation (local)')
        expect(res.text).toContain('Comment about A1111AA')
        expect(res.text).toContain('Remove')
        expect(res.text).toContain('Edit')
        expect(res.text).toContain('Do you want to add another prisoner?')
        expect(res.text).not.toContain('Were any prisoners involved in the incident?')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')
        expect(res.text).not.toContain('Skip for now')
        // TODO: test links

        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
      })
  })

  it('should not render prisoner summary table and only add prisoner form if no existing prisoners involved', () => {
    mockedReport.prisonersInvolved = []

    return request(app)
      .get(summaryUrl())
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-prisoner-summary')

        expect(res.text).toContain('No prisoners have been added to this incident report.')
        expect(res.text).not.toContain('Role')
        expect(res.text).not.toContain('Outcome')
        expect(res.text).not.toContain('>Details')
        expect(res.text).not.toContain('Action')
        expect(res.text).not.toContain('Remove')
        expect(res.text).not.toContain('Edit')
        expect(res.text).toContain('Do you want to add a prisoner?')
        expect(res.text).not.toContain('Were any prisoners involved in the incident?')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')
        expect(res.text).not.toContain('Skip for now')

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
        expect(res.text).toContain('app-prisoner-summary')

        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Select if you would like to add another prisoner to continue')

        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
      })
  })

  it('should redirect to search page is user choses to add involvements', () => {
    return request(app)
      .post(summaryUrl())
      .send({ addPrisoner: 'yes' })
      .expect(302)
      .expect(res => {
        expect(res.headers.location).toEqual(`/reports/${mockedReport.id}/prisoners/search`)
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
      })
  })

  it('should redirect to report page is user choses to not add involvements', () => {
    return request(app)
      .post(summaryUrl())
      .send({ addPrisoner: 'no' })
      .expect(302)
      .expect(res => {
        expect(res.headers.location).toEqual(`/reports/${mockedReport.id}`)
        expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
          prisonerInvolvementDone: true,
        })
      })
  })

  describe('…when involvements haven’t been added yet', () => {
    beforeEach(() => {
      mockedReport.prisonersInvolved = []
      mockedReport.prisonerInvolvementDone = false
    })

    it('should show option to skip adding prisoners', () => {
      return request(app)
        .get(summaryUrl())
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('app-prisoner-request')

          expect(res.text).not.toContain('No prisoners have been added to this incident report.')
          expect(res.text).not.toContain('Role')
          expect(res.text).not.toContain('Outcome')
          expect(res.text).not.toContain('>Details')
          expect(res.text).not.toContain('Action')
          expect(res.text).not.toContain('Remove')
          expect(res.text).not.toContain('Edit')
          expect(res.text).not.toContain('Do you want to add a prisoner?')

          expect(res.text).toContain('Were any prisoners involved in the incident?')
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
          expect(res.text).toContain('app-prisoner-request')

          expect(res.text).toContain('There is a problem')
          expect(res.text).toContain('Select if you would like to add another prisoner to continue')

          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    })

    it('should redirect to search page is user choses to add involvements', () => {
      return request(app)
        .post(summaryUrl())
        .send({ addPrisoner: 'yes' })
        .expect(302)
        .expect(res => {
          expect(res.headers.location).toEqual(`/reports/${mockedReport.id}/prisoners/search`)
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    })

    it('should redirect to report page is user choses to not add involvements', () => {
      return request(app)
        .post(summaryUrl())
        .send({ addPrisoner: 'no' })
        .expect(302)
        .expect(res => {
          expect(res.headers.location).toEqual(`/reports/${mockedReport.id}`)
          expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
            prisonerInvolvementDone: true,
          })
        })
    })

    it('should redirect to report page is user choses to skip adding involvements', () => {
      return request(app)
        .post(summaryUrl())
        .send({ addPrisoner: 'skip' })
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

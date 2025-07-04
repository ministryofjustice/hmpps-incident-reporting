import type { Express } from 'express'
import request from 'supertest'

import { IncidentReportingApi, ReportWithDetails } from '../../../../data/incidentReportingApi'
import { convertReportWithDetailsDates } from '../../../../data/incidentReportingApiUtils'
import { mockErrorResponse, mockReport } from '../../../../data/testData/incidentReporting'
import { mockThrownError } from '../../../../data/testData/thrownErrors'
import {
  mockDataWarden,
  mockReportingOfficer,
  mockHqViewer,
  mockUnauthorisedUser,
} from '../../../../data/testData/users'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import { now } from '../../../../testutils/fakeClock'
import { PrisonApi } from '../../../../data/prisonApi'

jest.mock('../../../../data/incidentReportingApi')

let app: Express
let prisonApi: jest.Mocked<PrisonApi>
let incidentReportingApi: jest.Mocked<IncidentReportingApi>

beforeEach(() => {
  app = appWithAllRoutes()

  prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
  prisonApi.getServicePrisonIds = jest.fn().mockResolvedValue(['MDI'])

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

  function summaryUrl(createJourney = false): string {
    if (createJourney) {
      return `/create-report/${mockedReport.id}/prisoners`
    }
    return `/reports/${mockedReport.id}/prisoners`
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
          ? '/create-report/01852368-477f-72e9-a239-265ad6e9ec56/prisoners'
          : '/reports/01852368-477f-72e9-a239-265ad6e9ec56/prisoners',
      )
      .expect(404)
      .expect(res => {
        expect(res.text).toContain('Page not found')
      })
  })

  it.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])(
    'should render prisoner summary table with no outcome column ($scenario) for DPS report with existing involvements',
    ({ createJourney }) => {
      return request(app)
        .get(summaryUrl(createJourney))
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
          expect(res.text).not.toContain('Do you want to add a prisoner to the report?')
          expect(res.text).toContain('Continue')
          expect(res.text).toContain('Save and exit')
          expect(res.text).not.toContain('Skip for now')
          // TODO: test links

          expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    },
  )

  it.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])(
    'should render prisoner summary table with outcome column ($scenario) for NOMIS report with existing involvements',
    ({ createJourney }) => {
      Object.assign(
        mockedReport,
        convertReportWithDetailsDates(
          mockReport({ reportReference: '6543', reportDateAndTime: now, createdInNomis: true, withDetails: true }),
        ),
      )

      return request(app)
        .get(summaryUrl(createJourney))
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
          expect(res.text).not.toContain('Do you want to add a prisoner to the report?')
          expect(res.text).toContain('Continue')
          expect(res.text).toContain('Save and exit')
          expect(res.text).not.toContain('Skip for now')
          // TODO: test links

          expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    },
  )

  it.each([
    { scenario: 'during create journey', createJourney: true },
    { scenario: 'normally', createJourney: false },
  ])('should not render prisoner summary table if no existing involvements ($scenario)', ({ createJourney }) => {
    mockedReport.prisonersInvolved = []

    return request(app)
      .get(summaryUrl(createJourney))
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('app-prisoner-summary')

        expect(res.text).toContain('No prisoners have been added to this incident report.')
        expect(res.text).not.toContain('Remove')
        expect(res.text).not.toContain('Edit')
        expect(res.text).toContain('Do you want to add a prisoner?')
        expect(res.text).not.toContain('Do you want to add a prisoner to the report?')
        expect(res.text).toContain('Continue')
        expect(res.text).toContain('Save and exit')
        expect(res.text).not.toContain('Skip for now')

        expect(incidentReportingApi.getReportWithDetailsById).toHaveBeenCalledTimes(1)
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
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
        expect(res.text).toContain('app-prisoner-summary')

        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Select yes if you want to add a prisoner')

        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
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
          expect(res.headers.location).toEqual(`/create-report/${mockedReport.id}/prisoners/search`)
        } else {
          expect(res.headers.location).toEqual(`/reports/${mockedReport.id}/prisoners/search`)
        }
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
      })
  })

  it.each([
    { scenario: 'redirect to adding staff (when continuing create journey)', createJourney: true },
    {
      scenario: 'redirect to report page (when exiting create journey)',
      createJourney: true,
      userAction: 'exit' as const,
    },
    { scenario: 'redirect to report page (normally)', createJourney: false },
  ])('should $scenario if user chooses not to add involvements', ({ createJourney, userAction }) => {
    return request(app)
      .post(summaryUrl(createJourney))
      .send({ confirmAdd: 'no', userAction })
      .expect(302)
      .expect(res => {
        if (createJourney && userAction !== 'exit') {
          expect(res.headers.location).toEqual(`/create-report/${mockedReport.id}/staff`)
        } else {
          expect(res.headers.location).toEqual(`/reports/${mockedReport.id}`)
        }
        expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
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
          expect(res.text).not.toContain('Remove')
          expect(res.text).not.toContain('Edit')

          expect(res.text).toContain('Do you want to add a prisoner to the report?')
          expect(res.text).toContain('Do you want to add a prisoner?')
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
          expect(res.text).toContain('Select yes if you want to add a prisoner')

          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
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
            expect(res.headers.location).toEqual(`/create-report/${mockedReport.id}/prisoners/search`)
          } else {
            expect(res.headers.location).toEqual(`/reports/${mockedReport.id}/prisoners/search`)
          }
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
        })
    })

    it.each([
      { scenario: 'redirect to adding staff (when continuing create journey)', createJourney: true },
      {
        scenario: 'redirect to report page (when exiting create journey)',
        createJourney: true,
        userAction: 'exit' as const,
      },
      { scenario: 'redirect to report page (normally)', createJourney: false },
    ])('should $scenario if user chooses not to add involvements', ({ createJourney, userAction }) => {
      return request(app)
        .post(summaryUrl(createJourney))
        .send({ confirmAdd: 'no', userAction })
        .expect(302)
        .expect(res => {
          if (createJourney && userAction !== 'exit') {
            expect(res.headers.location).toEqual(`/create-report/${mockedReport.id}/staff`)
          } else {
            expect(res.headers.location).toEqual(`/reports/${mockedReport.id}`)
          }
          expect(incidentReportingApi.updateReport).toHaveBeenCalledWith(mockedReport.id, {
            prisonerInvolvementDone: true,
          })
        })
    })

    it.each([
      { scenario: 'during create journey', createJourney: true },
      { scenario: 'normally', createJourney: false },
    ])('should show an error if API rejects request $scenario', ({ createJourney }) => {
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
      { scenario: 'redirect to adding staff (when continuing create journey)', createJourney: true },
      {
        scenario: 'redirect to report page (when exiting create journey)',
        createJourney: true,
        userAction: 'exit' as const,
      },
      { scenario: 'redirect to report page (normally)', createJourney: false },
    ])('should $scenario if user chooses to skip adding involvements', ({ createJourney, userAction }) => {
      return request(app)
        .post(summaryUrl(createJourney))
        .send({ confirmAdd: 'skip', userAction })
        .expect(302)
        .expect(res => {
          if (createJourney && userAction !== 'exit') {
            expect(res.headers.location).toEqual(`/create-report/${mockedReport.id}/staff`)
          } else {
            expect(res.headers.location).toEqual(`/reports/${mockedReport.id}`)
          }
          expect(incidentReportingApi.updateReport).not.toHaveBeenCalled()
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

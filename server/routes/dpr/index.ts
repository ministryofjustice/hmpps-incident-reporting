import { Router } from 'express'
import defaultTokenProvider from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/report-list/defaultTokenProvider'
import ReportListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/report-list/utils'

import config from '../../config'

// eslint-disable-next-line import/prefer-default-export
export function dprRouter(): Router {
  const router = Router({ mergeParams: true })

  router.get(
    '/summary',
    ReportListUtils.createReportListRequestHandler({
      title: 'Incident report summary',
      definitionName: 'incident-report',
      variantName: 'summary',
      apiUrl: config.apis.hmppsIncidentReportingApi.url,
      apiTimeout: config.apis.hmppsIncidentReportingApi.timeout.deadline,
      layoutTemplate: 'partials/dprLayout.njk',
      tokenProvider: defaultTokenProvider,
    }),
  )

  router.get(
    '/count/by-week',
    ReportListUtils.createReportListRequestHandler({
      title: 'Incident count by week',
      definitionName: 'incident-count',
      variantName: 'by-location-per-week',
      apiUrl: config.apis.hmppsIncidentReportingApi.url,
      apiTimeout: config.apis.hmppsIncidentReportingApi.timeout.deadline,
      layoutTemplate: 'partials/dprLayout.njk',
      tokenProvider: defaultTokenProvider,
    }),
  )

  router.get(
    '/count/by-month',
    ReportListUtils.createReportListRequestHandler({
      title: 'Incident count by month',
      definitionName: 'incident-count',
      variantName: 'by-location-per-month',
      apiUrl: config.apis.hmppsIncidentReportingApi.url,
      apiTimeout: config.apis.hmppsIncidentReportingApi.timeout.deadline,
      layoutTemplate: 'partials/dprLayout.njk',
      tokenProvider: defaultTokenProvider,
    }),
  )

  router.get(
    '/count/by-day',
    ReportListUtils.createReportListRequestHandler({
      title: 'Incident count per day',
      definitionName: 'incident-count',
      variantName: 'by-day',
      apiUrl: config.apis.hmppsIncidentReportingApi.url,
      apiTimeout: config.apis.hmppsIncidentReportingApi.timeout.deadline,
      layoutTemplate: 'partials/dprLayout.njk',
      tokenProvider: defaultTokenProvider,
    }),
  )

  router.get(
    '/prisoners',
    ReportListUtils.createReportListRequestHandler({
      title: 'Prisoners with incidents',
      definitionName: 'incident-with-people',
      variantName: 'by-prisoner',
      apiUrl: config.apis.hmppsIncidentReportingApi.url,
      apiTimeout: config.apis.hmppsIncidentReportingApi.timeout.deadline,
      layoutTemplate: 'partials/dprLayout.njk',
      tokenProvider: defaultTokenProvider,
    }),
  )

  router.get(
    '/staff',
    ReportListUtils.createReportListRequestHandler({
      title: 'Staff involved with incidents',
      definitionName: 'incident-with-people',
      variantName: 'by-staff',
      apiUrl: config.apis.hmppsIncidentReportingApi.url,
      apiTimeout: config.apis.hmppsIncidentReportingApi.timeout.deadline,
      layoutTemplate: 'partials/dprLayout.njk',
      tokenProvider: defaultTokenProvider,
    }),
  )

  return router
}

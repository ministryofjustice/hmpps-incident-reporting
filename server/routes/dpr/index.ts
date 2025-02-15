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
      title: 'Incident reports',
      definitionName: 'incident-report',
      variantName: 'summary',
      apiUrl: config.apis.hmppsIncidentReportingApi.url,
      apiTimeout: config.apis.hmppsIncidentReportingApi.timeout.deadline,
      layoutTemplate: 'partials/dprLayout',
      tokenProvider: defaultTokenProvider,
    }),
  )

  router.get(
    '/count',
    ReportListUtils.createReportListRequestHandler({
      title: 'Incident Count',
      definitionName: 'incident-count',
      variantName: 'by-location-per-week',
      apiUrl: config.apis.hmppsIncidentReportingApi.url,
      apiTimeout: config.apis.hmppsIncidentReportingApi.timeout.deadline,
      layoutTemplate: 'partials/dprLayout',
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
      layoutTemplate: 'partials/dprLayout',
      tokenProvider: defaultTokenProvider,
    }),
  )

  return router
}

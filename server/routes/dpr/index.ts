import { Router } from 'express'
import defaultTokenProvider from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/report-list/defaultTokenProvider'
import ReportListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/report-list/utils'
import config from '../../config'

// eslint-disable-next-line import/prefer-default-export
export function dprRouter(): Router {
  const router = Router({ mergeParams: true })

  router.get('/', async (req, res) => {
    const { incidentReportingApi } = res.locals.apis

    // TODO: This should be cached and the routes setup on initialisation
    const definitions = await incidentReportingApi.getManagementReportDefinitions()

    for (const definition of definitions) {
      for (const variant of definition.variants) {
        router.get(
          `/${definition.id}/${variant.id}`,
          ReportListUtils.createReportListRequestHandler({
            title: variant.name,
            definitionName: definition.id,
            variantName: variant.id,
            apiUrl: config.apis.hmppsIncidentReportingApi.url,
            apiTimeout: config.apis.hmppsIncidentReportingApi.timeout.deadline,
            layoutTemplate: 'partials/dprLayout.njk',
            tokenProvider: defaultTokenProvider,
          }),
        )
      }
    }

    res.render('pages/managementReporting/index.njk', { definitions })
  })

  return router
}

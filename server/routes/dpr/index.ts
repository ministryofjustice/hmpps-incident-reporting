import { NextFunction, Request, Response, Router } from 'express'
import ReportListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/report-list/utils'
import config from '../../config'
import { IncidentReportingApi } from '../../data/incidentReportingApi'
import { services } from '../../services'

async function getDefinitions() {
  const systemToken = await services().hmppsAuthClient.getSystemClientToken()
  const incidentReportingApiSystem = new IncidentReportingApi(systemToken)
  return incidentReportingApiSystem.getManagementReportDefinitions()
}

// eslint-disable-next-line import/prefer-default-export
export function dprRouter(): Router {
  const router = Router({ mergeParams: true })
  getDefinitions().then(allDefinitions => {
    for (const definition of allDefinitions) {
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
            tokenProvider: (req: Request, res: Response, next: NextFunction) => {
              return res.locals.systemToken
            },
          }),
        )
      }
    }
  })

  router.get('/', async (req, res) => {
    const { incidentReportingApi } = res.locals.apis
    const definitions = await incidentReportingApi.getManagementReportDefinitions()
    res.render('pages/managementReporting/index.njk', { definitions })
  })

  return router
}

import { Request, Response, Router } from 'express'
import ReportListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/report-list/utils'
import config from '../../config'

let definitionsRoutesInitialised: boolean = false

// eslint-disable-next-line import/prefer-default-export
export function dprRouter(): Router {
  const router = Router({ mergeParams: true })

  router.get('/', async (req, res) => {
    const { incidentReportingApi } = res.locals.apis

    if (definitionsRoutesInitialised === false) {
      incidentReportingApi.getManagementReportDefinitions().then(allDefinitions => {
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
                tokenProvider: (request: Request, response: Response) => {
                  return response.locals.systemToken
                },
              }),
            )
          }
        }
        definitionsRoutesInitialised = true
      })
    }
    const userDefinitions = await incidentReportingApi.getManagementReportDefinitions()
    res.render('pages/managementReporting/index.njk', { userDefinitions })
  })

  return router
}

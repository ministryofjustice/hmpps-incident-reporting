import { Request, Response, Router } from 'express'
import ReportListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/report-list/utils'
import config from '../../config'
import { IncidentReportingApi, ManagementReportDefinition } from '../../data/incidentReportingApi'
import { Services } from '../../services'

let definitionsRoutesInitialised: boolean = false

async function getIncidentReportingApi(services: Services): Promise<IncidentReportingApi> {
  const systemToken = await services.hmppsAuthClient.getSystemClientToken()
  return new IncidentReportingApi(systemToken)
}

async function populateRoutes(
  incidentReportingApi: IncidentReportingApi,
  router: Router,
): Promise<ManagementReportDefinition[]> {
  const allDefinitions = await incidentReportingApi.getManagementReportDefinitions()
  if (definitionsRoutesInitialised === false) {
    for (const definition of allDefinitions) {
      for (const variant of definition.variants) {
        router.get(
          `/${definition.id}-${variant.id}`,
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
  }
  return allDefinitions
}

// eslint-disable-next-line import/prefer-default-export
export function dprRouter(services: Services): Router {
  const router = Router({ mergeParams: true })

  if (config.loadReportDefinitionsOnStartup === true && definitionsRoutesInitialised === false) {
    getIncidentReportingApi(services).then(incidentReportingApi => populateRoutes(incidentReportingApi, router))
  }

  router.get('/', async (req, res) => {
    const { incidentReportingApi } = res.locals.apis
    const definitions = await populateRoutes(incidentReportingApi, router)
    res.render('pages/managementReporting/index.njk', { definitions })
  })

  return router
}

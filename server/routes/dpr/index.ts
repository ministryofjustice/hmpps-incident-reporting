import { Request, Response, Router } from 'express'
// import ReportListUtils from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/report-list/utils'
import dprRoutes from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/routes/index'
// TODO: Worked on v4. What's the v5 equivalent?
import { init as initCatalogue } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/_catalogue/catalogue/utils'
import { init as initUserReports } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/user-reports/utils'
// TODO: It doesn't work, from: https://github.com/ministryofjustice/hmpps-digital-prison-reporting-mi-ui/blob/main/server/routes/index.ts#L3C1-L4C114
// import { initCatalogue } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/catalogueUtils'
// import { initUserReports } from '@ministryofjustice/hmpps-digital-prison-reporting-frontend/userReportsListUtils'

import config from '../../config'
import { IncidentReportingApi, ManagementReportDefinition } from '../../data/incidentReportingApi'
import { Services } from '../../services'

let definitionsRoutesInitialised: boolean = false

async function getIncidentReportingApi(services: Services): Promise<IncidentReportingApi> {
  const systemToken = await services.hmppsAuthClient.getToken()
  return new IncidentReportingApi(systemToken)
}

// // REMOVED: Doesn't work like this in DPR FE v5
// async function populateRoutes(
//   incidentReportingApi: IncidentReportingApi,
//   router: Router,
// ): Promise<ManagementReportDefinition[]> {
//   const allDefinitions = await incidentReportingApi.getManagementReportDefinitions()
//   if (definitionsRoutesInitialised === false) {
//     for (const definition of allDefinitions) {
//       for (const variant of definition.variants) {
//         router.get(
//           `/management-reporting/${definition.id}-${variant.id}`,
//           ReportListUtils.createReportListRequestHandler({
//             title: variant.name,
//             definitionName: definition.id,
//             variantName: variant.id,
//             apiUrl: config.apis.hmppsIncidentReportingApi.url,
//             apiTimeout: config.apis.hmppsIncidentReportingApi.timeout.deadline,
//             layoutTemplate: 'partials/dprLayout.njk',
//             tokenProvider: (request: Request, response: Response) => {
//               return response.locals.systemToken
//             },
//           }),
//         )
//       }
//     }
//     definitionsRoutesInitialised = true
//   }
//   return allDefinitions
// }

export function dprRouter(router: Router, services: Services): Router {
  // // REMOVED: Doesn't work like this in DPR FE v5
  // if (config.loadReportDefinitionsOnStartup === true && definitionsRoutesInitialised === false) {
  //   getIncidentReportingApi(services).then(incidentReportingApi => populateRoutes(incidentReportingApi, router))
  // }

  // // TODO: will management reporting need a separate role?

  // router.get('/management-reporting', async (req, res) => {
  //   const { incidentReportingApi } = res.locals.apis
  //   const definitions = await populateRoutes(incidentReportingApi, router)
  //   res.render('pages/managementReporting/index', { definitions })
  // })

  // TODO: "Lets try loading a report to see if the endpoints are working correctly":
  // https://mojdt.slack.com/archives/C03FYCXFBQT/p1769088170179389?thread_ts=1769086216.185899&cid=C03FYCXFBQT
  // {your_nested_path}/dpr/view-report/report/{product_id}/{variant_id}/load-report
  //
  // TODO:
  //  - http://localhost:3000/management-reporting-fe-spike/dpr/request-report/TYPE/REPORTID/VARIANT/filters
  //    - "renders"
  //  - http://localhost:3000/management-reporting-fe-spike/dpr/request-report/report/incident-report/summary/filters
  //    - 403: `Error calling Reporting API Client, path: '/definitions', verb: 'GET' (status=403, data={}, message=Forbidden)`
  //  - http://localhost:3000/management-reporting-fe-spike/dpr/view-report/report/incident-report/summary/load-report
  //    - 404: `Error handling request for '/management-reporting-fe-spike/dpr/view-report/report/incident-report/summary/load-report', user 'AGIAMBELLUCA_GEN' NotFoundError: Not Found`
  //  - ???
  //    - crashes the node server with `Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client`

  // DPR FE Platform spike endpoints
  router.use('/management-reporting-fe-spike', dprRoutes({ services, layoutPath: 'partials/dprLayout.njk' }))

  // Catalogue
  router.get('/management-reporting-fe-spike/catalogue', async (_req, res) => {
    // TODO: `TypeError: definitions.sort is not a function`
    // [Node]       at Object.getReportsList ([...]/hmpps-incident-reporting/node_modules/@ministryofjustice/hmpps-digital-prison-reporting-frontend/dpr/components/_catalogue/catalogue-list/utils.ts:18:41)
    const catalogue = await initCatalogue({ res, services })
    const userReportsLists = await initUserReports({ res, services })

    console.log(`catalogue = ${JSON.stringify(catalogue)}`)
    console.log(`userReportsLists = ${JSON.stringify(userReportsLists)}`)

    res.render('pages/dprCatalogue', {
      title: 'Digital Prison Reporting',
      userReportsLists,
      catalogue,
    })
  })

  return router
}

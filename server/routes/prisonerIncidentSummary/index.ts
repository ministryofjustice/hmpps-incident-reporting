import express, { type Router } from 'express'

import { populatePrisoner } from '../../middleware/populatePrisoner'
import { requirePrisonerInCaseload } from '../../middleware/requirePrisonerInCaseload'
import { getPrisonerIncidentSummary } from '../../services/prisonerIncidentSummary'
import { getPrisonerIncidentList } from '../../services/prisonerIncidentSummary/list'

/**
 * Read-only page summarising the incidents a prisoner has been involved in over the past 12
 * months. Accessible to any signed-in user, provided the prisoner is in one of their caseloads
 * (enforced by requirePrisonerInCaseload).
 *
 * Mounted under `/prisoner/:prisonerNumber/incident-summary`, so the router merges params.
 */
export default function prisonerIncidentSummaryRouter(): Router {
  const router = express.Router({ mergeParams: true })

  router.get('/', populatePrisoner(), requirePrisonerInCaseload(), async (req, res) => {
    const { prisonerNumber } = req.params
    const { incidentReportingApi } = res.locals.apis

    const summary = await getPrisonerIncidentSummary(incidentReportingApi, prisonerNumber)

    res.render('pages/prisonerIncidentSummary', {
      prisoner: res.locals.prisoner,
      summary,
    })
  })

  // Drill-down: a line-by-line list of the prisoner's incidents over the same 12-month window.
  router.get('/incidents', populatePrisoner(), requirePrisonerInCaseload(), async (req, res) => {
    const { prisonerNumber } = req.params
    const { incidentReportingApi, prisonApi } = res.locals.apis

    const prisonerIncidentList = await getPrisonerIncidentList(incidentReportingApi, prisonApi, prisonerNumber)

    res.render('pages/prisonerIncidentList', {
      prisoner: res.locals.prisoner,
      prisonerIncidentList,
    })
  })

  return router
}

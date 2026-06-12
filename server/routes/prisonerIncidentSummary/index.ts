import express, { type Router } from 'express'

import { populatePrisoner } from '../../middleware/populatePrisoner'
import { requirePrisonerInCaseload } from '../../middleware/requirePrisonerInCaseload'
import { getPrisonerIncidentSummary } from '../../services/prisonerIncidentSummary'

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

  return router
}

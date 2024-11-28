import type { RequestHandler } from 'express'
import { NotFound } from 'http-errors'

import { Router } from 'express'
import type { PathParams } from 'express-serve-static-core'
import type { Services } from '../services'
import {
  prisonerInvolvementOutcomes,
  prisonerInvolvementRoles,
  staffInvolvementRoles,
  statuses,
  types,
} from '../reportConfiguration/constants'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function viewReport(service: Services): Router {
  const router = Router({ mergeParams: true })
  const { userService } = service
  const get = (path: PathParams, handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res) => {
    const { incidentReportingApi, prisonApi, offenderSearchApi } = res.locals.apis

    const { id } = req.params
    if (!id) {
      throw new NotFound()
    }

    const report = await incidentReportingApi.getReportWithDetailsById(id)

    let usernames = [report.reportedBy]
    if (report.staffInvolved) {
      usernames = [...report.staffInvolved.map(staff => staff.staffUsername), report.reportedBy]
    }
    const usersLookup = await userService.getUsers(res.locals.systemToken, usernames)

    let prisonersLookup = null
    if (report.prisonersInvolved) {
      const prisonerNumbers = report.prisonersInvolved.map(pi => pi.prisonerNumber)
      prisonersLookup = await offenderSearchApi.getPrisoners(prisonerNumbers)
    }
    const prisonsLookup = await prisonApi.getPrisons()

    const typesLookup = Object.fromEntries(types.map(type => [type.code, type.description]))
    const statusLookup = Object.fromEntries(statuses.map(status => [status.code, status.description]))
    const prisonerInvolvementLookup = Object.fromEntries(
      prisonerInvolvementRoles.map(role => [role.code, role.description]),
    )
    const prisonerOutcomeLookup = Object.fromEntries(
      prisonerInvolvementOutcomes.map(outcome => [outcome.code, outcome.description]),
    )
    const staffInvolvementLookup = Object.fromEntries(staffInvolvementRoles.map(role => [role.code, role.description]))

    res.render('pages/debug/reportDetails', {
      report,
      prisonersLookup,
      usersLookup,
      prisonsLookup,
      prisonerInvolvementLookup,
      prisonerOutcomeLookup,
      staffInvolvementLookup,
      typesLookup,
      statusLookup,
    })
  })

  return router
}

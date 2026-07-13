import { Router, type Request, type Response } from 'express'
import { NotFound } from 'http-errors'

import { buildCreateRequest, buildUpdateRequest } from '../../../data/incidentTypeConfiguration/nomisPayload'
import { compareConfigs } from '../../../data/incidentTypeConfiguration/nomisCompare'
import { types, isTypeActive } from '../../../reportConfiguration/constants'
import { getIncidentTypeConfiguration } from '../../../reportConfiguration/types'
import { errorResponseStatusMatches } from '../../../utils/utils'

/** Active incident types offered for syncing, in display order */
function activeTypes() {
  return types.filter(type => isTypeActive(type.code))
}

/** Look up an active type by its DPS code or throw NotFound */
function findActiveType(dpsCode: string) {
  const typeMeta = activeTypes().find(type => type.code === dpsCode)
  if (!typeMeta) {
    throw new NotFound(`Unknown or inactive incident type “${dpsCode}”`)
  }
  return typeMeta
}

async function renderSelect(_req: Request, res: Response): Promise<void> {
  res.render('pages/admin/syncNomis/select', { types: activeTypes() })
}

function selectType(req: Request, res: Response): void {
  const dpsCode = typeof req.body.dpsCode === 'string' ? req.body.dpsCode : ''
  const typeMeta = activeTypes().find(type => type.code === dpsCode)
  if (!typeMeta) {
    res.render('pages/admin/syncNomis/select', {
      types: activeTypes(),
      errors: { dpsCode: { message: 'Select an incident type' } },
    })
    return
  }
  res.redirect(`/admin/sync-nomis/${encodeURIComponent(typeMeta.code)}`)
}

async function renderConfirm(req: Request, res: Response): Promise<void> {
  const typeMeta = findActiveType(req.params.dpsCode)
  const { prisonApi } = res.locals.apis

  const dpsConfig = await getIncidentTypeConfiguration(typeMeta.code)
  const exists = await prisonApi.incidentTypeConfigurationExists(typeMeta.nomisCode)
  const request = buildUpdateRequest(dpsConfig, { description: typeMeta.description, active: typeMeta.active })

  res.render('pages/admin/syncNomis/confirm', {
    type: typeMeta,
    action: exists ? 'update' : 'create',
    questionCount: request.questions.length,
    prisonerRoleCount: request.prisonerRoles.length,
  })
}

async function performSync(req: Request, res: Response): Promise<void> {
  const typeMeta = findActiveType(req.params.dpsCode)
  const { prisonApi } = res.locals.apis

  const dpsConfig = await getIncidentTypeConfiguration(typeMeta.code)
  const exists = await prisonApi.incidentTypeConfigurationExists(typeMeta.nomisCode)
  const meta = { nomisCode: typeMeta.nomisCode, description: typeMeta.description, active: typeMeta.active }

  try {
    if (exists) {
      const request = buildUpdateRequest(dpsConfig, meta)
      const stored = await prisonApi.updateIncidentTypeConfiguration(typeMeta.nomisCode, request)
      res.render('pages/admin/syncNomis/result', {
        type: typeMeta,
        action: 'updated',
        comparison: compareConfigs(request, stored),
      })
    } else {
      const request = buildCreateRequest(dpsConfig, meta)
      const stored = await prisonApi.createIncidentTypeConfiguration(request)
      res.render('pages/admin/syncNomis/result', {
        type: typeMeta,
        action: 'created',
        comparison: compareConfigs(request, stored),
      })
    }
  } catch (error) {
    // A missing system-client role surfaces as 401/403 from Prison API
    if (errorResponseStatusMatches(error, 403) || errorResponseStatusMatches(error, 401)) {
      res.render('pages/admin/syncNomis/result', {
        type: typeMeta,
        action: exists ? 'update' : 'create',
        roleError: true,
      })
      return
    }
    throw error
  }
}

export default function makeSyncNomisRouter(): Router {
  const router = Router({ mergeParams: true })

  router.get('/', renderSelect)
  router.post('/', selectType)
  router.get('/:dpsCode', renderConfirm)
  router.post('/:dpsCode', performSync)

  return router
}

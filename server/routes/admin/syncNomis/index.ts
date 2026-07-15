import { Router, type Request, type Response } from 'express'
import { NotFound } from 'http-errors'

import { buildCreateRequest, buildUpdateRequest } from '../../../data/incidentTypeConfiguration/nomisPayload'
import { compareConfigs } from '../../../data/incidentTypeConfiguration/nomisCompare'
import { types, isTypeActive, type TypeDetails } from '../../../reportConfiguration/constants'
import { getIncidentTypeConfiguration } from '../../../reportConfiguration/types'
import { errorResponseStatusMatches } from '../../../utils/utils'

/**
 * Active incident types offered for syncing, in display order.
 *
 * Only active types are selectable, so `active` on a type reaching the payload builders is always
 * `true`. Retiring a type in NOMIS is therefore out of this screen's reach.
 */
function activeTypes(): TypeDetails[] {
  return types.filter(type => isTypeActive(type.code))
}

/** Look up an active type by its DPS code or throw NotFound */
function findActiveType(dpsCode: string): TypeDetails {
  const typeInfo = activeTypes().find(type => type.code === dpsCode)
  if (!typeInfo) {
    throw new NotFound(`Unknown or inactive incident type “${dpsCode}”`)
  }
  return typeInfo
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
  const typeInfo = findActiveType(req.params.dpsCode)
  const { prisonApi } = res.locals.apis

  const dpsConfig = await getIncidentTypeConfiguration(typeInfo.code)
  const exists = await prisonApi.incidentTypeConfigurationExists(typeInfo.nomisCode)
  const request = buildUpdateRequest(dpsConfig, typeInfo)

  res.render('pages/admin/syncNomis/confirm', {
    type: typeInfo,
    action: exists ? 'update' : 'create',
    questionCount: request.questions.length,
    prisonerRoleCount: request.prisonerRoles.length,
  })
}

async function performSync(req: Request, res: Response): Promise<void> {
  const typeInfo = findActiveType(req.params.dpsCode)
  const { prisonApi } = res.locals.apis

  const dpsConfig = await getIncidentTypeConfiguration(typeInfo.code)
  const exists = await prisonApi.incidentTypeConfigurationExists(typeInfo.nomisCode)

  try {
    if (exists) {
      const request = buildUpdateRequest(dpsConfig, typeInfo)
      const stored = await prisonApi.updateIncidentTypeConfiguration(typeInfo.nomisCode, request)
      res.render('pages/admin/syncNomis/result', {
        type: typeInfo,
        action: 'updated',
        comparison: compareConfigs(request, stored),
      })
    } else {
      const request = buildCreateRequest(dpsConfig, typeInfo)
      const stored = await prisonApi.createIncidentTypeConfiguration(request)
      res.render('pages/admin/syncNomis/result', {
        type: typeInfo,
        action: 'created',
        comparison: compareConfigs(request, stored),
      })
    }
  } catch (error) {
    // Prison API answers 403 when the system client lacks the write role; a 401 means the token
    // itself is missing or expired, which is a different fault and must not be reported as one
    if (errorResponseStatusMatches(error, 403)) {
      res.render('pages/admin/syncNomis/result', {
        type: typeInfo,
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

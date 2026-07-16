import { Router, type Request, type Response } from 'express'
import { NotFound } from 'http-errors'

import { buildCreateRequest, buildUpdateRequest } from '../../../data/incidentTypeConfiguration/nomisPayload'
import { compareConfigs } from '../../../data/incidentTypeConfiguration/nomisCompare'
import {
  types,
  isTypeActiveOrUpcoming,
  upcomingActivationDate,
  type TypeDetails,
} from '../../../reportConfiguration/constants'
import { getIncidentTypeConfiguration } from '../../../reportConfiguration/types'
import format from '../../../utils/format'

/** A syncable type decorated with its go-live date, for display, when it is not yet live */
type SyncableType = TypeDetails & { liveFrom?: string }

/**
 * Incident types offered for syncing, in display order: those active now and those due to go live.
 *
 * Upcoming versions are included deliberately so their config can be pushed into NOMIS before the
 * switch-over date — see {@link isTypeActiveOrUpcoming}. All are written to NOMIS with their registry
 * `active` flag (always `true` here), so a pre-synced type is ready to use on its go-live day.
 */
function syncableTypes(): TypeDetails[] {
  return types.filter(type => isTypeActiveOrUpcoming(type.code))
}

/** The go-live date of an upcoming type formatted for display, or undefined if it is already live */
function liveFromLabel(code: string): string | undefined {
  const iso = upcomingActivationDate(code)
  return iso ? format.longDate(new Date(`${iso}T12:00:00Z`)) : undefined
}

/** Syncable types decorated with their go-live date so upcoming versions can be flagged */
function syncableTypeItems(): SyncableType[] {
  return syncableTypes().map(type => ({ ...type, liveFrom: liveFromLabel(type.code) }))
}

/** Look up a syncable type by its DPS code or throw NotFound */
function findSyncableType(dpsCode: string): TypeDetails {
  const typeInfo = syncableTypes().find(type => type.code === dpsCode)
  if (!typeInfo) {
    throw new NotFound(`Unknown or non-syncable incident type “${dpsCode}”`)
  }
  return typeInfo
}

async function renderSelect(_req: Request, res: Response): Promise<void> {
  res.render('pages/admin/syncNomis/select', { types: syncableTypeItems() })
}

function selectType(req: Request, res: Response): void {
  const dpsCode = typeof req.body.dpsCode === 'string' ? req.body.dpsCode : ''
  const typeInfo = syncableTypes().find(type => type.code === dpsCode)
  if (!typeInfo) {
    res.render('pages/admin/syncNomis/select', {
      types: syncableTypeItems(),
      errors: { dpsCode: { message: 'Select an incident type' } },
    })
    return
  }
  res.redirect(`/admin/sync-nomis/${encodeURIComponent(typeInfo.code)}`)
}

async function renderConfirm(req: Request, res: Response): Promise<void> {
  const typeInfo = findSyncableType(req.params.dpsCode)
  const { prisonApi } = res.locals.apis

  const dpsConfig = await getIncidentTypeConfiguration(typeInfo.code)
  const exists = await prisonApi.incidentTypeConfigurationExists(typeInfo.nomisCode)
  const request = buildUpdateRequest(dpsConfig, typeInfo)

  res.render('pages/admin/syncNomis/confirm', {
    type: typeInfo,
    liveFrom: liveFromLabel(typeInfo.code),
    action: exists ? 'update' : 'create',
    questionCount: request.questions.length,
    prisonerRoleCount: request.prisonerRoles.length,
  })
}

async function performSync(req: Request, res: Response): Promise<void> {
  const typeInfo = findSyncableType(req.params.dpsCode)
  const { prisonApi } = res.locals.apis

  const dpsConfig = await getIncidentTypeConfiguration(typeInfo.code)
  const exists = await prisonApi.incidentTypeConfigurationExists(typeInfo.nomisCode)

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
}

export default function makeSyncNomisRouter(): Router {
  const router = Router({ mergeParams: true })

  router.get('/', renderSelect)
  router.post('/', selectType)
  router.get('/:dpsCode', renderConfirm)
  router.post('/:dpsCode', performSync)

  return router
}

// Hand-maintained (NOT generated): date-based activation windows for incident types.

import config from '../../config'
import format from '../../utils/format'
import { getTypeDetails, types, type Type, type TypeDetails } from './types'
import { typeFamilies, type TypeFamily, type TypeFamilyDetails } from './typeFamilies'

/**
 * The date used when deciding whether a type is active and no explicit date is supplied.
 * Normally "now", but `INCIDENT_TYPE_ACTIVE_DATE` (config.incidentTypeActiveDate) overrides it
 * in non-production environments to preview a future state. Midday avoids any BST/GMT edge.
 */
function effectiveNow(): Date {
  const override = config.incidentTypeActiveDate
  return override ? new Date(`${override}T12:00:00Z`) : new Date()
}

/**
 * Whether an incident type is active at a given moment.
 *
 * A type is active if its registry `active` boolean is `true` AND `at` falls within its
 * activation window (if any). Types without a window are active whenever their boolean is true.
 * Comparison is done on Europe/London calendar dates, so switch-overs happen at local midnight
 * regardless of BST/GMT.
 */
export function isTypeActive(code: Type, at: Date = effectiveNow()): boolean {
  const details = getTypeDetails(code)
  if (!details?.active) {
    return false
  }

  if (!details.activeTo && !details.activeFrom) {
    return true
  }

  const on = format.isoDate(at)
  if (details.activeFrom && on < details.activeFrom) {
    return false
  }
  return !(details.activeTo && on >= details.activeTo)
}

/**
 * Whether an incident type is active now or is due to become active in the future.
 *
 * This is {@link isTypeActive} without the "not started yet" exclusion: a type whose `activeFrom`
 * is still in the future counts as upcoming and returns `true`. Retired types (`activeTo` reached)
 * and registry-inactive types (`active` boolean `false`) still return `false`.
 *
 * Used by the NOMIS sync screen so a new version can be pushed into NOMIS *before* its go-live date,
 * leaving the data ready to be used the moment the switch-over happens.
 */
export function isTypeActiveOrUpcoming(code: Type, at: Date = effectiveNow()): boolean {
  const details = getTypeDetails(code)
  if (!details?.active) {
    return false
  }

  if (!details.activeTo && !details.activeFrom) {
    return true
  }

  // Only exclude once retired; a still-future activeFrom is upcoming, not inactive.
  return !(details.activeTo && format.isoDate(at) >= details.activeTo)
}

/**
 * The go-live date of an upcoming type, or `undefined` if the type is already live (or has no
 * `activeFrom`). Returns the ISO `YYYY-MM-DD` string only while `activeFrom` is still in the future,
 * so callers can label a type as "live from …" without re-deriving the window.
 */
export function upcomingActivationDate(code: Type, at: Date = effectiveNow()): string | undefined {
  const period = types[code]
  if (period?.activeFrom && format.isoDate(at) < period.activeFrom) {
    return period.activeFrom
  }
  return undefined
}


/**
 * Produces an object with each type family as the key with a corresponding indicator that will be true if all types
 * belonging to that family are inactive.
 */
export function areTypeFamiliesInactive(
  typeDetails: Record<string, TypeDetails>,
  at: Date = effectiveNow(),
): Record<TypeFamily, boolean> {
  return Object.entries(typeDetails).reduce(
    (acc, [code, details]) => {
      acc[details.familyCode] = (acc[details.familyCode] ?? true) && !isTypeActive(code as Type, at)
      return acc
    },
    {} as Record<TypeFamily, boolean>,
  )
}

/**
 * In preparation for the incident type autocomplete items on the dashboard, this generates an object with
 * the incident type families as a key, and then the corresponding value is either null if the type family has no
 * expired dates associated with any of the types belonging to that family, or it will have the date as a string in
 * the format 'MMM YYYY' of the most recent expiration date within that family.
 */
export function getTypeFamilyExpiryDates(
  typeDetails: Record<string, TypeDetails>,
  typeFamilyDetails: readonly TypeFamilyDetails[],
): Record<TypeFamily, string | null> {
  const acc = {} as Record<TypeFamily, string | null>

  typeFamilyDetails.forEach(({ code: familyCode }) => {
    const expiryDates = (Object.entries(typeDetails) as [Type, TypeDetails][])
      .filter(([, { familyCode: someFamilyCode }]) => someFamilyCode === familyCode)
      .map(([typeCode]) =>
        typeDetails[typeCode]?.activeTo ? new Date(typeDetails[typeCode]?.activeTo) : null,
      )
      .filter((date): date is Date => date !== null) // Remove nulls for comparison

    const latestDate = expiryDates.length > 0 ? new Date(Math.max(...expiryDates.map(d => d.getTime()))) : null

    acc[familyCode] = latestDate
      ? `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(latestDate)} ${latestDate.getFullYear()}`
      : null
  })
  return acc
}
export const familyExpiryDates = getTypeFamilyExpiryDates(types, typeFamilies)

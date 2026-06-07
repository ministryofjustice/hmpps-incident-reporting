// Hand-maintained (NOT generated): date-based activation windows for incident types.

import config from '../../config'
import format from '../../utils/format'
import { getTypeDetails, type Type } from './types'

/**
 * An activation window for an incident type, expressed as Europe/London calendar dates
 * in ISO `YYYY-MM-DD` form. The window is half-open: `activeFrom` is inclusive and
 * `activeTo` is exclusive. This lets one version's `activeTo` equal its successor's
 * `activeFrom` with no overlap and no gap (e.g. v1 ends and v2 starts on the same day).
 */
interface ActivePeriod {
  /** Inclusive first day the type is active (London date). Omit if always active up to `activeTo`. */
  activeFrom?: string
  /** Exclusive first day the type is no longer active (London date). Omit if open-ended. */
  activeTo?: string
}

/**
 * Date-based activation windows for incident types.
 *
 * Source of truth for *when* a type is active, layered on top of the generated `active`
 * boolean in `./types`. Kept in this hand-maintained file (rather than the generated registry)
 * so the dates survive regeneration of the constants from the API.
 *
 * A type is only ever active when its registry boolean is `true` AND now falls within its
 * window (see {@link isTypeActive}). Windows therefore can only *retire* or *delay* a type;
 * a recorded `activeTo` on an already-inactive (boolean `false`) type is metadata only and
 * never reactivates it — important because some retired NOMIS types carry recent/future end
 * dates that are not monotonic by version number.
 */
export const typeActivePeriods: Partial<Record<Type, ActivePeriod>> = {
  // Family switch-over for 1 July 2026: Food refusal v1 retires as v2 begins.
  FOOD_REFUSAL_1: { activeTo: '2026-07-01' },
  FOOD_REFUSAL_2: { activeFrom: '2026-07-01' },
  // Close down search is decommissioned (no replacement) from 1 July 2026.
  CLOSE_DOWN_SEARCH_1: { activeTo: '2026-07-01' },

  // Historical end dates for already-retired NOMIS types (metadata only; boolean is already false).
  ASSAULT_1: { activeTo: '2017-04-13' },
  ASSAULT_2: { activeTo: '2017-04-13' },
  ASSAULT_3: { activeTo: '2017-04-13' },
  ASSAULT_4: { activeTo: '2017-04-27' },
  BARRICADE_1: { activeTo: '2015-01-10' },
  CONCERTED_INDISCIPLINE_1: { activeTo: '2015-01-10' },
  DAMAGE_1: { activeTo: '2024-11-11' },
  DISORDER_1: { activeTo: '2018-04-23' },
  DRONE_SIGHTING_1: { activeTo: '2017-01-04' },
  DRONE_SIGHTING_2: { activeTo: '2024-09-09' },
  DRUGS_1: { activeTo: '2015-01-10' },
  FIND_1: { activeTo: '2015-09-17' },
  FIND_2: { activeTo: '2025-01-10' },
  FIND_3: { activeTo: '2025-01-04' },
  FIND_4: { activeTo: '2022-03-29' },
  FIND_5: { activeTo: '2022-04-20' },
  FIREARM_1: { activeTo: '2015-01-10' },
  HOSTAGE_1: { activeTo: '2015-01-10' },
  INCIDENT_AT_HEIGHT_1: { activeTo: '2015-01-10' },
  KEY_OR_LOCK_1: { activeTo: '2013-08-03' },
  MOBILE_PHONE_1: { activeTo: '2015-01-10' },
  RADIO_COMPROMISE_1: { activeTo: '2026-02-03' },
  TEMPORARY_RELEASE_FAILURE_1: { activeTo: '2017-01-04' },
  TEMPORARY_RELEASE_FAILURE_2: { activeTo: '2017-01-04' },
  TEMPORARY_RELEASE_FAILURE_3: { activeTo: '2017-03-16' },
}

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
export function isTypeActive(code: string, at: Date = effectiveNow()): boolean {
  const details = getTypeDetails(code)
  if (!details?.active) {
    return false
  }

  const period = typeActivePeriods[code as Type]
  if (!period) {
    return true
  }

  const on = format.isoDate(at)
  if (period.activeFrom && on < period.activeFrom) {
    return false
  }
  return !(period.activeTo && on >= period.activeTo)
}

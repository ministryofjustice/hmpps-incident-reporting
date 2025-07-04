import config from '../../config'
import { isPecsRegionCode } from '../../data/pecsRegions'
import { SERVICE_ALL_PRISONS } from '../../data/prisonApi'

/**
 * If the location is a PECS region, is it enabled?
 * Otherwise, is the prison enabled?
 */
export function isLocationActiveInService(activePrisons: string[], code: string): boolean {
  return (isPecsRegionCode(code) && config.activeForPecsRegions) || isPrisonActiveInService(activePrisons, code)
}

/**
 * Whether given prison should have full access to incident report on DPS, ie. the service has been rolled out there.
 * Otherwise, users are expected to continue using NOMIS.
 */
export function isPrisonActiveInService(activePrisons: string[], prisonId: string): boolean {
  // empty list permits none
  if (activePrisons.length === 0) {
    return false
  }
  // list with only "*ALL*" permits all
  if (activePrisons.length === 1 && activePrisons[0] === SERVICE_ALL_PRISONS) {
    return true
  }
  // otherwise actually check
  return activePrisons.includes(prisonId)
}

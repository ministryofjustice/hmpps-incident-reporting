import config from '../../config'
import { isPecsRegionCode } from '../../data/pecsRegions'

/**
 * If the location is a PECS region, is it enabled?
 * Otherwise, is the prison enabled?
 */
export function isLocationActiveInService(code: string): boolean {
  return (isPecsRegionCode(code) && config.activeForPecsRegions) || isPrisonActiveInService(code)
}

/**
 * Whether given prison should have full access to incident report on DPS, ie. the service has been rolled out there.
 * Otherwise, users are expected to continue using NOMIS.
 */
export function isPrisonActiveInService(prisonId: string): boolean {
  // empty list permits none
  if (config.activePrisons.length === 0) {
    return false
  }
  // list with only "***" permits all
  if (config.activePrisons.length === 1 && config.activePrisons[0] === '***') {
    return true
  }
  // otherwise actually check
  return config.activePrisons.includes(prisonId)
}

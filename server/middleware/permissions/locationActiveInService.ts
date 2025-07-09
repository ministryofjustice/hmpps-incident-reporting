import { SERVICE_ALL_PRISONS } from '../../data/prisonApi'

/**
 * Whether given prison or PECS region should have full access to incident report on DPS
 *
 * Meaning the service has been rolled out there.
 * Otherwise, users are expected to continue using NOMIS.
 */
// eslint-disable-next-line import/prefer-default-export
export function isLocationActiveInService(activePrisons: string[], prisonId: string): boolean {
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

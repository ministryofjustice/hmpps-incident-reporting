import { SERVICE_ALL_AGENCIES } from '../../data/activeAgencies'

/**
 * Whether given prison or PECS region should have full access to incident report on DPS
 *
 * Meaning the service has been rolled out there.
 * Otherwise, users are expected to continue using NOMIS.
 */
// eslint-disable-next-line import/prefer-default-export
export function isLocationActiveInService(activeAgencies: string[], agencyId: string): boolean {
  // empty list permits none
  if (activeAgencies.length === 0) {
    return false
  }
  // list with only "*ALL*" permits all
  if (activeAgencies.length === 1 && activeAgencies[0] === SERVICE_ALL_AGENCIES) {
    return true
  }
  // otherwise actually check
  return activeAgencies.includes(agencyId)
}

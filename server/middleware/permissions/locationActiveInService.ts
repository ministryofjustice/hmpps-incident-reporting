import { activeAgencies, SERVICE_ALL_AGENCIES } from '../../data/activeAgencies'

/**
 * Whether given prison or PECS region should have full access to incident report on DPS
 *
 * Meaning the service has been rolled out there.
 * Otherwise, users are expected to continue using NOMIS.
 */
// eslint-disable-next-line import/prefer-default-export
export function isLocationActiveInService(agencyId: string): boolean {
  // empty list permits none
  if (activeAgencies.length === 0) {
    return false
  }

  return activeAgencies.some(
    item =>
      // list with only "*ALL*" permits all
      item === SERVICE_ALL_AGENCIES ||
      // list contains agencyId
      item === agencyId,
  )
}

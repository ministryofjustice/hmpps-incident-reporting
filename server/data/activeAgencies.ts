/**
 * Agencies where the service is active
 *
 * NOTE: This is kept up-to-date asynchronously by `updateActiveAgencies`
 * middleware (using Prison API)
 *
 * TODO: remove after full rollout
 */
export const activeAgencies: string[] = []

// Special agencyId that designates service active in all agencies
export const SERVICE_ALL_AGENCIES = '*ALL*'

/**
 * Updates the list of agencies currently active
 *
 * @param newActiveAgencies list of new active agencies ids
 */
export function setActiveAgencies(newActiveAgencies: string[]) {
  activeAgencies.splice(0, activeAgencies.length, ...newActiveAgencies)
}

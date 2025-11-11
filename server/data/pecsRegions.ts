import type { Agency } from './prisonApi'

export interface PecsRegion {
  code: string
  description: string
  active: boolean
}

/**
 * All PECS regions, including inactive historic ones.
 * Loaded from prison-api asynchronously by middleware and cached for the lifetime of the application.
 * This should be safe since they will change extremely rarely.
 */
export const pecsRegions: PecsRegion[] = []

export function isPecsRegionCode(code: string): boolean {
  return pecsRegions.some(region => region.code === code)
}

export function getActivePecsRegions(): PecsRegion[] {
  return pecsRegions.filter(region => region.active && region.code !== 'NOU')
}

export function fromAgency(agency: Agency): PecsRegion {
  return {
    code: agency.agencyId,
    description: agency.description,
    active: agency.active,
  }
}

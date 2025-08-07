import { defaultPageSize, type Page } from '../incidentReportingApi'

/**
 * Build a 1-page response of unsorted items.
 * Used only in testing.
 */
export function unsortedPageOf<T>(content: T[]): Page<T> {
  return {
    content,
    number: 0,
    size: defaultPageSize,
    numberOfElements: content.length,
    totalElements: content.length,
    totalPages: 1,
    sort: [],
  }
}

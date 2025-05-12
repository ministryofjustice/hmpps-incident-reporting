import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'

/**
 * Build an object mimicking a sanitised Error thrown by an api client in case of unsuccessful response.
 * Used only in mocks.
 *
 * NB: some fields are omitted, in reality these are built out of superagent.ResponseError
 */
// eslint-disable-next-line import/prefer-default-export
export function mockThrownError<T>(responseBody: T, status: number = 400): SanitisedError<T> {
  const error = new Error(`Error: ${status}`) as SanitisedError<T>
  error.responseStatus = status
  error.headers = {}
  error.data = responseBody
  error.text = typeof responseBody === 'object' ? JSON.stringify(responseBody) : responseBody.toString()
  return error
}

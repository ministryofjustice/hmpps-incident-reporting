import type { ResponseError } from 'superagent'

/**
 * An error that may be safe to log as it omits sensitive request headers
 */
export class SanitisedError<Data = unknown> extends Error {
  text?: string

  status?: number

  headers?: unknown

  data?: Data
}

/**
 * An error as returned by superagemt, contains sensitive request headers
 */
export type UnsanitisedError = ResponseError

/**
 * Converts an UnsanitisedError (superagent.ResponseError) into a simpler Error object,
 * omitting request inforation (e.g. sensitive request headers)
 */
export function sanitiseError<Data = unknown>(error: UnsanitisedError): SanitisedError<Data> {
  const e = new SanitisedError<Data>(error.message)
  e.stack = error.stack
  if (error.response) {
    e.text = error.response.text
    e.status = error.response.status
    e.headers = error.response.headers
    e.data = error.response.body
  }
  return e
}

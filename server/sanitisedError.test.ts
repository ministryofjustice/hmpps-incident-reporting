import { sanitiseError, SanitisedError, type UnsanitisedError } from './sanitisedError'

describe('sanitised error', () => {
  it('it should omit the request headers from the error object ', () => {
    const error = {
      name: '',
      status: 404,
      response: {
        req: {
          method: 'GET',
          url: 'https://test-api/endpoint?active=true',
          headers: {
            property: 'not for logging',
          },
        },
        headers: {
          date: 'Tue, 19 May 2020 15:16:20 GMT',
        },
        status: 404,
        statusText: 'Not found',
        text: { details: 'details' },
        body: { content: 'hello' },
      },
      message: 'Not Found',
      stack: 'stack description',
    } as unknown as UnsanitisedError

    const expectedError = new SanitisedError<{ content: string }>('Not Found')
    expectedError.text = 'details'
    expectedError.status = 404
    expectedError.headers = { date: 'Tue, 19 May 2020 15:16:20 GMT' }
    expectedError.data = { content: 'hello' }
    expectedError.stack = 'stack description'

    const sanitisedError = sanitiseError(error)
    expect(sanitisedError).toEqual(expectedError)
    expect(sanitisedError).toBeInstanceOf(SanitisedError)
  })

  it('it should return the error message', () => {
    const error = {
      message: 'error description',
    } as unknown as UnsanitisedError

    expect(sanitiseError(error)).toBeInstanceOf(Error)
    expect(sanitiseError(error)).toHaveProperty('message', 'error description')
  })

  it('it should return an empty error for an unknown error structure', () => {
    const error = {
      property: 'unknown',
    } as unknown as UnsanitisedError

    expect(sanitiseError(error)).toBeInstanceOf(Error)
    expect(sanitiseError(error)).not.toHaveProperty('property')
  })
})

import { RequestData, type DataTelemetry, type EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'

import { addUserDataToRequests, ignorePathsProcessor, type ContextObject } from './azureAppInsights'

const user = {
  activeCaseLoadId: 'LII',
  username: 'test-user',
}

function createEnvelope(name: string, properties: Record<string, string | boolean>, baseType = 'RequestData') {
  const baseData = new RequestData()
  baseData.name = name
  baseData.properties = properties
  return {
    data: {
      baseType,
      baseData,
    } as DataTelemetry,
  } as EnvelopeTelemetry
}

function createContext(username: string, activeCaseLoadId: string): ContextObject {
  return {
    'http.ServerRequest': {
      res: {
        locals: {
          user: {
            username,
            activeCaseLoadId,
          },
        },
      },
    },
  }
}

const context = createContext(user.username, user.activeCaseLoadId)

describe('Azure Application Insights', () => {
  describe('addUserDataToRequests', () => {
    it('adds user data to properties when present', () => {
      const envelope = createEnvelope('GET /', { other: 'things' })

      addUserDataToRequests(envelope, context)

      expect(envelope.data.baseData.properties).toStrictEqual({
        ...user,
        other: 'things',
      })
    })

    it('handles absent user data', () => {
      const envelope = createEnvelope('GET /', { other: 'things' })

      addUserDataToRequests(envelope, createContext(undefined, user.activeCaseLoadId))

      expect(envelope.data.baseData.properties).toStrictEqual({ other: 'things' })
    })

    it('returns true when not RequestData type', () => {
      const envelope = createEnvelope('GET /', {}, 'NOT_REQUEST_DATA')

      const response = addUserDataToRequests(envelope, context)

      expect(response).toBe(true)
    })

    it('handles when no properties have been set', () => {
      const envelope = createEnvelope('GET /', undefined)

      addUserDataToRequests(envelope, context)

      expect(envelope.data.baseData.properties).toStrictEqual(user)
    })

    it('handles missing user details', () => {
      const envelope = createEnvelope('GET /', { other: 'things' })

      addUserDataToRequests(envelope, {
        'http.ServerRequest': {},
      } as ContextObject)

      expect(envelope.data.baseData.properties).toEqual({
        other: 'things',
      })
    })
  })

  describe('ignorePathsProcessor', () => {
    it.each(['/metrics', '/info', '/ping', '/health', '/health?service=abc'])(
      'ignores pre-specified path: %s',
      path => {
        const envelope = createEnvelope(`GET ${path}`, {})

        const result = ignorePathsProcessor(envelope)
        expect(result).toBe(false)
      },
    )

    it.each(['/', '/reports'])('allows path: %s', path => {
      const envelope = createEnvelope(`GET ${path}`, {})

      const result = ignorePathsProcessor(envelope)
      expect(result).toBe(true)
    })
  })
})

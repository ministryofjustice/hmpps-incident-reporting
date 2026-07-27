import type { Response as SuperAgentResponse, SuperAgentRequest } from 'superagent'

import { stubFor } from './wiremock'
import type { Agency } from '../../server/data/prisonApi'
import { leeds, moorland, pecsNorth, pecsSouth, staffBarry, staffMary } from '../../server/data/testData/prisonApi'

export default {
  /**
   * Stub getting details for a prison
   */
  stubPrisonApiMockPrison: (prison: Agency): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/prisonApi/api/agencies/${prison.agencyId}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: prison,
      },
    }),

  /**
   * Stub getting details for all mock prisons
   */
  stubPrisonApiMockPrisons: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/prisonApi/api/agencies/prisons',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [leeds, moorland],
      },
    }),

  /**
   * Stub getting details for all mock prisons
   */
  stubPrisonApiMockPecsRegions: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/prisonApi/api/agencies/type/PECS',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [pecsNorth, pecsSouth],
      },
    }),

  /**
   * Stub a plaholder JPEG photo
   */
  stubPrisonApiMockPrisonerPhoto: (prisonerNumber: string): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: `/prisonApi/api/bookings/offenderNo/${prisonerNumber}/image/data`,
        queryParameters: {
          fullSizeImage: { equalTo: 'false' },
        },
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'image/jpeg' },
        base64Body:
          '/9j/4AAQSkZJRgABAQEBLAEsAAD/2wCEAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBABAwMDBAMECAQECBALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/AABEIAAEAAQMBEQACEQEDEQH/xABLAAEAAAAAAAAAAAAAAAAAAAAIEAEAAAAAAAAAAAAAAAAAAAAAAQEBAAAAAAAAAAAAAAAAAAAGCBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AVqFyt//Z',
      },
    }),

  /**
   * Stub getting details for all mock staff
   */
  stubPrisonApiMockStaff: (): Promise<SuperAgentResponse[]> =>
    Promise.all(
      [staffBarry, staffMary].map(staff =>
        stubFor({
          request: {
            method: 'GET',
            urlPath: `/prisonApi/api/users/${staff.username}`,
          },
          response: {
            status: 200,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
            jsonBody: staff,
          },
        }),
      ),
    ),

  /**
   * Stub looking up a NOMIS incident-type configuration that does not exist (used to force a "create")
   */
  stubPrisonApiIncidentTypeConfigurationNotFound: (nomisCode: string): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/prisonApi/api/incidents/configuration',
        queryParameters: {
          'incident-type': { equalTo: nomisCode },
        },
      },
      response: {
        status: 404,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: 404, userMessage: `Incident type ${nomisCode} not found` },
      },
    }),

  /**
   * Stub creating a NOMIS incident-type configuration; echoes back a minimal persisted config
   */
  stubPrisonApiCreateIncidentTypeConfiguration: (nomisCode: string): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPath: '/prisonApi/api/incidents/configuration',
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          incidentType: nomisCode,
          incidentTypeDescription: 'Abscond',
          questionnaireId: 1,
          questions: [],
          prisonerRoles: [],
          active: true,
        },
      },
    }),

  /**
   * Health check
   */
  stubPrisonApiPing: (): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/prisonApi/health/ping',
      },
      response: {
        status: 200,
      },
    }),
}

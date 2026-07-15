import type { Express } from 'express'
import request from 'supertest'

import { PrisonApi, type IncidentTypeConfiguration } from '../../../data/prisonApi'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { mockUser } from '../../../data/testData/users'
import { makeMockCaseload } from '../../../data/testData/frontendComponents'
import { moorland } from '../../../data/testData/prisonApi'
import { roleReadWrite, roleAdmin } from '../../../data/constants'

jest.mock('../../../data/prisonApi')

const prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>

/** An always-active type with a real DPS config file: ABSCOND_1 → NOMIS code ABSCOND */
const dpsCode = 'ABSCOND_1'
const nomisCode = 'ABSCOND'

const adminUser = mockUser([makeMockCaseload(moorland)], [roleReadWrite, roleAdmin])

function appAsAdmin(): Express {
  return appWithAllRoutes({ userSupplier: () => adminUser })
}

/** Minimal NOMIS response used to satisfy the create/update stubs (dates as strings, as returned over HTTP) */
function nomisResponse(): DatesAsStrings<IncidentTypeConfiguration> {
  return {
    incidentType: nomisCode,
    incidentTypeDescription: 'Abscond',
    questionnaireId: 1,
    questions: [],
    prisonerRoles: [],
    active: true,
  }
}

function forbiddenError(responseStatus: number): Error {
  return Object.assign(new Error('Forbidden'), { responseStatus })
}

afterEach(() => {
  jest.resetAllMocks()
})

describe('Sync NOMIS admin screen', () => {
  describe('access control', () => {
    it('forbids a user without the admin role', () => {
      const app = appWithAllRoutes() // default reporting officer, no admin role
      // logoutUnless denies with Forbidden, which the error handler turns into a sign-out redirect
      return request(app).get('/admin/sync-nomis').expect(302).expect('Location', '/sign-out')
    })

    it('allows an admin user and lists active types', () => {
      return request(appAsAdmin())
        .get('/admin/sync-nomis')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Sync an incident type to NOMIS')
          expect(res.text).toContain(nomisCode)
        })
    })
  })

  describe('confirm page', () => {
    it('says the type will be created when it does not exist in NOMIS', () => {
      prisonApi.incidentTypeConfigurationExists.mockResolvedValueOnce(false)
      return request(appAsAdmin())
        .get(`/admin/sync-nomis/${dpsCode}`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Create in NOMIS')
          expect(prisonApi.incidentTypeConfigurationExists).toHaveBeenCalledWith(nomisCode)
        })
    })

    it('says the type will be updated when it already exists in NOMIS', () => {
      prisonApi.incidentTypeConfigurationExists.mockResolvedValueOnce(true)
      return request(appAsAdmin())
        .get(`/admin/sync-nomis/${dpsCode}`)
        .expect(200)
        .expect(res => expect(res.text).toContain('Update in NOMIS'))
    })

    it('404s for an unknown type', () => {
      return request(appAsAdmin()).get('/admin/sync-nomis/NOT_A_TYPE').expect(404)
    })
  })

  describe('selecting a type', () => {
    it('redirects to the confirm page for the chosen type', () => {
      return request(appAsAdmin())
        .post('/admin/sync-nomis')
        .send({ dpsCode })
        .expect(302)
        .expect('Location', `/admin/sync-nomis/${dpsCode}`)
    })

    it('re-renders with an error when nothing valid is selected', () => {
      return request(appAsAdmin())
        .post('/admin/sync-nomis')
        .send({ dpsCode: '' })
        .expect(200)
        .expect(res => expect(res.text).toContain('Select an incident type'))
    })
  })

  describe('performing the sync', () => {
    it('creates the type in NOMIS when it does not exist', () => {
      prisonApi.incidentTypeConfigurationExists.mockResolvedValueOnce(false)
      prisonApi.createIncidentTypeConfiguration.mockResolvedValueOnce(nomisResponse())

      return request(appAsAdmin())
        .post(`/admin/sync-nomis/${dpsCode}`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('was created in NOMIS')
          expect(prisonApi.createIncidentTypeConfiguration).toHaveBeenCalledWith(
            expect.objectContaining({ incidentType: nomisCode }),
          )
          expect(prisonApi.updateIncidentTypeConfiguration).not.toHaveBeenCalled()
        })
    })

    it('updates the type in NOMIS when it already exists', () => {
      prisonApi.incidentTypeConfigurationExists.mockResolvedValueOnce(true)
      prisonApi.updateIncidentTypeConfiguration.mockResolvedValueOnce(nomisResponse())

      return request(appAsAdmin())
        .post(`/admin/sync-nomis/${dpsCode}`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('was updated in NOMIS')
          expect(prisonApi.updateIncidentTypeConfiguration).toHaveBeenCalledWith(nomisCode, expect.any(Object))
          expect(prisonApi.createIncidentTypeConfiguration).not.toHaveBeenCalled()
        })
    })

    it('explains when the system client lacks the required role (403)', () => {
      prisonApi.incidentTypeConfigurationExists.mockResolvedValueOnce(false)
      prisonApi.createIncidentTypeConfiguration.mockRejectedValueOnce(forbiddenError(403))

      return request(appAsAdmin())
        .post(`/admin/sync-nomis/${dpsCode}`)
        .expect(200)
        .expect(res => expect(res.text).toContain('PRISON_API__INCIDENT_TYPE_CONFIGURATION_RW'))
    })

    it('does not blame the role when Prison API rejects the token itself (401)', () => {
      // Prison API only answers 403 for a missing role; a 401 means the system token is absent or
      // expired, so it must not surface as a role problem. It falls through to the error handler,
      // which signs the user out like any other upstream 401.
      prisonApi.incidentTypeConfigurationExists.mockResolvedValueOnce(false)
      prisonApi.createIncidentTypeConfiguration.mockRejectedValueOnce(forbiddenError(401))

      return request(appAsAdmin()).post(`/admin/sync-nomis/${dpsCode}`).expect(302).expect('Location', '/sign-out')
    })
  })
})

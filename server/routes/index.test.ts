import type { Express } from 'express'
import request from 'supertest'

import { PrisonApi } from '../data/prisonApi'
import { mockUnauthorisedUser } from '../data/testData/users'
import { appWithAllRoutes } from './testutils/appSetup'

jest.mock('../data/prisonApi')

let app: Express

beforeEach(() => {
  app = appWithAllRoutes()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render index page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Digital Prison Services')
        expect(res.text).toContain('Incident reporting')
      })
  })

  it('should log user out if they do not have appropriate role', () => {
    return request(appWithAllRoutes({ userSupplier: () => mockUnauthorisedUser }))
      .get('/')
      .expect(302)
      .expect(res => {
        expect(res.redirect).toBe(true)
        expect(res.header.location).toEqual('/sign-out')
      })
  })
})

describe('prisoner photos', () => {
  let prisonApi: jest.Mocked<PrisonApi>
  beforeEach(() => {
    prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>
  })

  const prisonerNumber = 'A1234BC'
  const imageData = Buffer.from('image data')

  it('should return the same data as returned by prison-api', () => {
    prisonApi.getPhoto.mockResolvedValue(imageData)

    return request(app)
      .get(`/prisoner/${prisonerNumber}/photo.jpeg`)
      .expect('Content-Type', /image\/jpeg/)
      .expect(200)
      .expect(res => {
        expect(prisonApi.getPhoto).toHaveBeenLastCalledWith(prisonerNumber)

        expect(res.headers['cache-control']).toEqual('private, max-age=86400')
        expect(res.body).toEqual(imageData)
      })
  })

  it('should return generic image if prison-api returns 404', () => {
    prisonApi.getPhoto.mockResolvedValue(null)

    return request(app)
      .get(`/prisoner/${prisonerNumber}/photo.jpeg`)
      .expect('Content-Type', /image\/jpeg/)
      .expect(200)
      .expect(res => {
        expect(prisonApi.getPhoto).toHaveBeenLastCalledWith(prisonerNumber)

        expect(res.headers['cache-control']).toEqual('private, max-age=86400')
        expect(res.body).toHaveLength(3054) // file size of assets/images/prisoner.jpeg
      })
  })
})

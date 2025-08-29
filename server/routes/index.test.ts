import type { Express } from 'express'
import request from 'supertest'

import { PrisonApi } from '../data/prisonApi'
import { mockPecsRegions } from '../data/testData/pecsRegions'
import { mockDataWarden, mockReportingOfficer, mockHqViewer, mockUnauthorisedUser } from '../data/testData/users'
import { appWithAllRoutes } from './testutils/appSetup'

jest.mock('../data/prisonApi')

const prisonApi = PrisonApi.prototype as jest.Mocked<PrisonApi>

let app: Express

beforeAll(() => {
  mockPecsRegions()
})

beforeEach(() => {
  app = appWithAllRoutes()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Home page', () => {
  it.each([
    {
      userType: 'HQ viewer',
      user: mockHqViewer,
      expectedText: [],
    },
    {
      userType: 'reporting officer',
      user: mockReportingOfficer,
      expectedText: ['Create an incident report'],
    },
    {
      userType: 'data warden',
      user: mockDataWarden,
      expectedText: ['Create a PECS incident report'],
    },
  ])('should render tiles for $userType', ({ user, expectedText }) => {
    return request(appWithAllRoutes({ userSupplier: () => user }))
      .get('/')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Digital Prison Services')
        expect(res.text).toContain('Incident reporting')
        expect(res.text).toContain('Search incident reports')
        expect(res.text).toContain('Management reporting')
        expectedText.forEach(text => {
          expect(res.text).toContain(text)
        })
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

import { andrew, barry, chris, donald, ernie, fred } from '../data/testData/offenderSearch'
import { prisonerLocation } from './prisonerLocationUtils'

describe('prisonerLocation()', () => {
  describe('for people in prison with a known prison name', () => {
    it.each([andrew, barry, chris])('returns the prison name', prisoner => {
      expect(prisonerLocation(prisoner)).toEqual(prisoner.prisonName)
    })
  })

  describe('for people being tranferred', () => {
    it(`returns 'N/A'`, () => {
      expect(prisonerLocation(donald)).toEqual('N/A')
    })

    it(`without a location description, also returns 'N/A'`, () => {
      const prisoner = {
        ...donald,
        // @ts-expect-error - invalid input for testing purpose
        locationDescription: undefined,
      }

      expect(prisonerLocation(prisoner)).toEqual('N/A')
    })
  })

  describe('for people outside prison', () => {
    it('returns the location description', () => {
      expect(prisonerLocation(ernie)).toEqual('Outside - released from Moorland (HMP)')
    })

    it(`without a location description, returns 'Outside'`, () => {
      const prisoner = {
        ...ernie,
        // @ts-expect-error - invalid input for testing purpose
        locationDescription: undefined,
      }

      expect(prisonerLocation(prisoner)).toEqual('Outside')
    })
  })

  describe('for people with unknown location', () => {
    it(`when location is blank, returns 'Not known'`, () => {
      const prisoner = {
        ...andrew,
        prisonId: '',
        prisonName: '',
        cellLocation: '',
      }
      expect(prisonerLocation(prisoner)).toEqual('Not known')
    })

    it(`when location is undefined, returns 'Not known'`, () => {
      // @ts-expect-error - Fred test user has some undefined values
      expect(prisonerLocation(fred)).toEqual('Not known')
    })
  })
})

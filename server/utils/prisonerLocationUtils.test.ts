import { andrew, barry, chris, donald, ernie, fred } from '../data/testData/offenderSearch'
import { isBeingTransferred, isInPrison, isOutside, prisonerLocation } from './prisonerLocationUtils'

describe('prisoners’ locations', () => {
  it.each([andrew, barry, chris])(
    'for people who are in prison with a known cell location (e.g. $cellLocation)',
    prisoner => {
      expect(prisonerLocation(prisoner)).toEqual(prisoner.prisonName)

      expect(isBeingTransferred(prisoner)).toBe(false)
      expect(isOutside(prisoner)).toBe(false)
      expect(isInPrison(prisoner)).toBe(true)
    },
  )

  it('for people who are in prison without a known cell location', () => {
    const prisoner = { ...andrew }
    delete prisoner.cellLocation
    expect(prisonerLocation(prisoner)).toEqual(prisoner.prisonName)

    expect(isBeingTransferred(prisoner)).toBe(false)
    expect(isOutside(prisoner)).toBe(false)
    expect(isInPrison(prisoner)).toBe(true)
  })

  it('for people being transferred', () => {
    expect(prisonerLocation(donald)).toEqual('N/A')

    expect(isBeingTransferred(donald)).toBe(true)
    expect(isOutside(donald)).toBe(false)
    expect(isInPrison(donald)).toBe(false)
  })

  it('for people being transferred without a location description', () => {
    const prisoner = { ...donald }
    delete prisoner.locationDescription
    expect(prisonerLocation(prisoner)).toEqual('N/A')

    expect(isBeingTransferred(prisoner)).toBe(true)
    expect(isOutside(prisoner)).toBe(false)
    expect(isInPrison(prisoner)).toBe(false)
  })

  it('for people outside prison', () => {
    expect(prisonerLocation(ernie)).toEqual('Outside - released from Moorland (HMP)')

    expect(isBeingTransferred(ernie)).toBe(false)
    expect(isOutside(ernie)).toBe(true)
    expect(isInPrison(ernie)).toBe(false)
  })

  it('for people outside prison without a location description', () => {
    const prisoner = { ...ernie }
    delete prisoner.locationDescription
    expect(prisonerLocation(prisoner)).toEqual('Outside')

    expect(isBeingTransferred(prisoner)).toBe(false)
    expect(isOutside(prisoner)).toBe(true)
    expect(isInPrison(prisoner)).toBe(false)
  })

  it('for people whose location is blank', () => {
    const prisoner = {
      ...andrew,
      prisonId: '',
      prisonName: '',
      cellLocation: '',
    }
    expect(prisonerLocation(prisoner)).toEqual('Not known')

    expect(isBeingTransferred(prisoner)).toBe(false)
    expect(isOutside(prisoner)).toBe(false)
    expect(isInPrison(prisoner)).toBe(false)
  })

  it('for people whose location is undefined', () => {
    expect(prisonerLocation(fred)).toEqual('Not known')

    expect(isBeingTransferred(fred)).toBe(false)
    expect(isOutside(fred)).toBe(false)
    expect(isInPrison(fred)).toBe(false)
  })
})

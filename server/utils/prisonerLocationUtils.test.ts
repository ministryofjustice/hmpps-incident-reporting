import { andrew, barry, chris, donald, ernie, fred } from '../data/testData/offenderSearch'
import { prisonerLocation } from './prisonerLocationUtils'

describe('prisoners’ locations', () => {
  it.each([andrew, barry, chris])(
    'for people who are in prison with a known cell location (e.g. $cellLocation)',
    prisoner => {
      expect(prisonerLocation(prisoner)).toEqual(prisoner.prisonName)
    },
  )

  it('for people who are in prison without a known cell location', () => {
    const prisoner = { ...andrew }
    delete prisoner.cellLocation
    expect(prisonerLocation(prisoner)).toEqual(prisoner.prisonName)
  })

  it('for people being transferred', () => {
    expect(prisonerLocation(donald)).toEqual('N/A')
  })

  it('for people being transferred without a location description', () => {
    const prisoner = { ...donald }
    delete prisoner.locationDescription
    expect(prisonerLocation(prisoner)).toEqual('N/A')
  })

  it('for people outside prison', () => {
    expect(prisonerLocation(ernie)).toEqual('Outside - released from Moorland (HMP)')
  })

  it('for people outside prison without a location description', () => {
    const prisoner = { ...ernie }
    delete prisoner.locationDescription
    expect(prisonerLocation(prisoner)).toEqual('Outside')
  })

  it('for people whose location is blank', () => {
    const prisoner = {
      ...andrew,
      prisonId: '',
      prisonName: '',
      cellLocation: '',
    }
    expect(prisonerLocation(prisoner)).toEqual('Not known')
  })

  it('for people whose location is undefined', () => {
    expect(prisonerLocation(fred)).toEqual('Not known')
  })
})

import { getTypeDetails, types } from './types'
import { typeFamilies } from './typeFamilies'
import { aboutTheType } from './typeHints'

describe('Type family', () => {
  it('should share the same code prefix for each type within a family', () => {
    Object.entries(types).forEach(([typeCode, typeDetails]) => {
      expect(typeCode.startsWith(`${typeDetails.familyCode}_`)).toBe(true)
    })
  })

  it('should have the same description for each type within a family', () => {
    const typeFamilyDescriptions = Object.fromEntries(typeFamilies.map(({ code, description }) => [code, description]))
    Object.entries(types).forEach(([typeCode, typeDetails]) => {
      expect(typeDetails.description).toEqual(typeFamilyDescriptions[typeDetails.familyCode])
    })
  })
})

describe('getTypeDetails()', () => {
  it('should find active codes', () => {
    expect(getTypeDetails('ASSAULT_5')).toStrictEqual({
      familyCode: 'ASSAULT',
      description: 'Assault',
      active: true,
      hint: 'Includes fights and suspected assaults.',
      nomisCode: 'ASSAULTS3',
    })
  })

  it('should find inactive codes', () => {
    expect(getTypeDetails('ASSAULT_1')).toStrictEqual({
      familyCode: 'ASSAULT',
      description: 'Assault',
      active: false,
      nomisCode: 'ASSAULT',
      activeTo: '2017-04-13',
    })
  })

  it('should return null for non-existant codes', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore as testing function returns a null for an invalid entry
    expect(getTypeDetails('ASSAULT')).toBeNull()
  })
})

describe('aboutTheType()', () => {
  it.each([
    { type: 'ASSAULT_5' as const, expectedTitle: 'About the assault' },
    { type: 'CLOSE_DOWN_SEARCH_1' as const, expectedTitle: 'About the close down search' },
    { type: 'DAMAGE_1' as const, expectedTitle: 'About the deliberate damage' },
    { type: 'MISCELLANEOUS_1' as const, expectedTitle: 'About the incident' },
  ])('should generate a title for type: $type', ({ type, expectedTitle }) => {
    const title = aboutTheType(type)
    expect(title).toEqual(expectedTitle)
  })

  it.each([
    { typeFamily: 'ASSAULT' as const, expectedTitle: 'About the assault' },
    { typeFamily: 'CLOSE_DOWN_SEARCH' as const, expectedTitle: 'About the close down search' },
    { typeFamily: 'DAMAGE' as const, expectedTitle: 'About the deliberate damage' },
    { typeFamily: 'MISCELLANEOUS' as const, expectedTitle: 'About the incident' },
  ])('should generate a title for type family: $typeFamily', ({ typeFamily, expectedTitle }) => {
    const title = aboutTheType(typeFamily)
    expect(title).toEqual(expectedTitle)
  })
})

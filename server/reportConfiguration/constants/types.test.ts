import { getTypeDetails, types } from './types'
import { typeFamilies } from './typeFamilies'

describe('Type family', () => {
  it('should share the same code prefix for each type within a family', () => {
    types.forEach(type => {
      expect(type.code.startsWith(`${type.familyCode}_`)).toBe(true)
    })
  })

  it('should have the same description for each type within a family', () => {
    const typeFamilyDescriptions = Object.fromEntries(typeFamilies.map(({ code, description }) => [code, description]))
    types.forEach(type => {
      expect(type.description).toEqual(typeFamilyDescriptions[type.familyCode])
    })
  })
})

describe('getTypeDetails()', () => {
  it('should find active codes', () => {
    expect(getTypeDetails('ASSAULT_5')).toStrictEqual({
      familyCode: 'ASSAULT',
      code: 'ASSAULT_5',
      description: 'Assault',
      active: true,
      nomisCode: 'ASSAULTS3',
    })
  })

  it('should find inactive codes', () => {
    expect(getTypeDetails('ASSAULT_1')).toStrictEqual({
      familyCode: 'ASSAULT',
      code: 'ASSAULT_1',
      description: 'Assault',
      active: false,
      nomisCode: 'ASSAULT',
    })
  })

  it('should return null for non-existant codes', () => {
    expect(getTypeDetails('ASSAULT')).toBeNull()
  })
})

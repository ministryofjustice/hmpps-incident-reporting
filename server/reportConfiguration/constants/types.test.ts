import { getTypeDetails } from './types'

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

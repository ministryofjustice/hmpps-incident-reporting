import { getTypeDetails } from './types'

describe('getTypeDetails()', () => {
  it('should find active codes', () => {
    expect(getTypeDetails('ASSAULT')).toStrictEqual({
      code: 'ASSAULT',
      description: 'Assault',
      active: true,
      nomisCode: 'ASSAULTS3',
    })
  })

  it('should find inactive codes', () => {
    expect(getTypeDetails('OLD_ASSAULT')).toStrictEqual({
      code: 'OLD_ASSAULT',
      description: 'Assault',
      active: false,
      nomisCode: 'ASSAULT',
    })
  })

  it('should return null for non-existant codes', () => {
    expect(getTypeDetails('OLDER_ASSAULT')).toBeNull()
  })
})

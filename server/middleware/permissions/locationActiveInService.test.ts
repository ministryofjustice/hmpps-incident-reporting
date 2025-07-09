import { isLocationActiveInService } from './locationActiveInService'
import { pecsRegions } from '../../data/pecsRegions'
import { pecsNorthRegion, pecsSouthRegion } from '../../data/testData/pecsRegions'
import { SERVICE_ALL_AGENCIES } from '../../data/prisonApi'

describe('Active location helper functions', () => {
  it('should always return true if all agencies are permitted', () => {
    const activeAgencies = [SERVICE_ALL_AGENCIES]

    const agencies = [undefined, null, '', 'MDI', 'LEI']
    for (const agencyId of agencies) {
      expect(isLocationActiveInService(activeAgencies, agencyId)).toBe(true)
    }
  })

  it('should always return false if no agencies are permitted', () => {
    const activeAgencies: string[] = []

    const agencies = [undefined, null, '', 'MDI', 'LEI']
    for (const agencyId of agencies) {
      expect(isLocationActiveInService(activeAgencies, agencyId)).toBe(false)
    }
  })

  it('should check agency against configured list', () => {
    const activeAgencies = ['BXI', 'LEI']

    const textCases: [string, boolean][] = [
      [undefined, false],
      [null, false],
      ['', false],
      ['BXI', true],
      ['LEI', true],
      ['MDI', false],
      ['OWI', false],
    ]
    for (const [code, active] of textCases) {
      expect(isLocationActiveInService(activeAgencies, code)).toBe(active)
    }
  })

  it('should check if PECS regions are active', () => {
    pecsRegions.splice(0, pecsRegions.length, pecsNorthRegion, pecsSouthRegion, {
      code: 'WEST',
      description: 'Historic West region',
      active: false,
    })
    const activeAgencies: string[] = pecsRegions.map(region => region.code)

    expect(isLocationActiveInService(activeAgencies, 'NORTH')).toBe(true)
    expect(isLocationActiveInService(activeAgencies, 'SOUTH')).toBe(true)
    expect(isLocationActiveInService(activeAgencies, 'WEST')).toBe(true) // TODO: region itself is inactive
  })
})

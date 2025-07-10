import { isLocationActiveInService } from './locationActiveInService'
import { pecsRegions } from '../../data/pecsRegions'
import { pecsNorthRegion, pecsSouthRegion } from '../../data/testData/pecsRegions'
import { SERVICE_ALL_AGENCIES, setActiveAgencies } from '../../data/activeAgencies'

describe('Active location helper functions', () => {
  it('should always return true if all agencies are permitted', () => {
    setActiveAgencies(['XYZ', SERVICE_ALL_AGENCIES])

    const agencies = [undefined, null, '', 'MDI', 'LEI']
    for (const agencyId of agencies) {
      expect(isLocationActiveInService(agencyId)).toBe(true)
    }
  })

  it('should always return false if no agencies are permitted', () => {
    setActiveAgencies([])

    const agencies = [undefined, null, '', 'MDI', 'LEI']
    for (const agencyId of agencies) {
      expect(isLocationActiveInService(agencyId)).toBe(false)
    }
  })

  it('should check agency against configured list', () => {
    setActiveAgencies(['BXI', 'LEI'])

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
      expect(isLocationActiveInService(code)).toBe(active)
    }
  })

  it('should check if PECS regions are active', () => {
    pecsRegions.splice(0, pecsRegions.length, pecsNorthRegion, pecsSouthRegion, {
      code: 'WEST',
      description: 'Historic West region',
      active: false,
    })
    const pecsCodes = pecsRegions.map(region => region.code)
    setActiveAgencies(pecsCodes)

    expect(isLocationActiveInService('NORTH')).toBe(true)
    expect(isLocationActiveInService('SOUTH')).toBe(true)
    expect(isLocationActiveInService('WEST')).toBe(true) // TODO: region itself is inactive
  })
})

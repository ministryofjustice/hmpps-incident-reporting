import config from '../../config'
import { isLocationActiveInService, isPrisonActiveInService } from './locationActiveInService'
import { pecsRegions } from '../../data/pecsRegions'
import { pecsNorthRegion, pecsSouthRegion } from '../../data/testData/pecsRegions'

describe('Active location helper functions', () => {
  it('should always return true if all prisons are permitted', () => {
    config.activePrisons = ['***']

    const prisons = [undefined, null, '', 'MDI', 'LEI']
    for (const prison of prisons) {
      expect(isLocationActiveInService(prison)).toBe(true)
      expect(isPrisonActiveInService(prison)).toBe(true)
    }
  })

  it('should always return false if no prisons are permitted', () => {
    config.activePrisons = []

    const prisons = [undefined, null, '', 'MDI', 'LEI']
    for (const prison of prisons) {
      expect(isLocationActiveInService(prison)).toBe(false)
      expect(isPrisonActiveInService(prison)).toBe(false)
    }
  })

  it('should check prison against configured list', () => {
    config.activePrisons = ['BXI', 'LEI']

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
      expect(isPrisonActiveInService(code)).toBe(active)
    }
  })

  it('should check if PECS regions are active', () => {
    config.activePrisons = []
    config.activeForPecsRegions = true
    pecsRegions.splice(0, pecsRegions.length, pecsNorthRegion, pecsSouthRegion, {
      code: 'WEST',
      description: 'Historic West region',
      active: false,
    })

    expect(isLocationActiveInService('NORTH')).toBe(true)
    expect(isLocationActiveInService('SOUTH')).toBe(true)
    expect(isLocationActiveInService('WEST')).toBe(true) // TODO: region itself is inactive
  })
})

import config from '../../config'
import { isLocationActiveInService, isPrisonActiveInService } from './locationActiveInService'
import { pecsRegions } from '../../data/pecsRegions'
import { pecsNorthRegion, pecsSouthRegion } from '../../data/testData/pecsRegions'
import { SERVICE_ALL_PRISONS } from '../../data/prisonApi'

describe('Active location helper functions', () => {
  it('should always return true if all prisons are permitted', () => {
    const activePrisons = [SERVICE_ALL_PRISONS]

    const prisons = [undefined, null, '', 'MDI', 'LEI']
    for (const prison of prisons) {
      expect(isLocationActiveInService(activePrisons, prison)).toBe(true)
      expect(isPrisonActiveInService(activePrisons, prison)).toBe(true)
    }
  })

  it('should always return false if no prisons are permitted', () => {
    const activePrisons: string[] = []

    const prisons = [undefined, null, '', 'MDI', 'LEI']
    for (const prison of prisons) {
      expect(isLocationActiveInService(activePrisons, prison)).toBe(false)
      expect(isPrisonActiveInService(activePrisons, prison)).toBe(false)
    }
  })

  it('should check prison against configured list', () => {
    const activePrisons = ['BXI', 'LEI']

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
      expect(isLocationActiveInService(activePrisons, code)).toBe(active)
      expect(isPrisonActiveInService(activePrisons, code)).toBe(active)
    }
  })

  it('should check if PECS regions are active', () => {
    const activePrisons: string[] = []
    config.activeForPecsRegions = true
    pecsRegions.splice(0, pecsRegions.length, pecsNorthRegion, pecsSouthRegion, {
      code: 'WEST',
      description: 'Historic West region',
      active: false,
    })

    expect(isLocationActiveInService(activePrisons, 'NORTH')).toBe(true)
    expect(isLocationActiveInService(activePrisons, 'SOUTH')).toBe(true)
    expect(isLocationActiveInService(activePrisons, 'WEST')).toBe(true) // TODO: region itself is inactive
  })
})

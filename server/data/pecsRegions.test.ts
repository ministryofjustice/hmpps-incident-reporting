import { getActivePecsRegions, isPecsRegionCode, type PecsRegion, pecsRegions } from './pecsRegions'
import { nouRegion, pecsNorthRegion, pecsSouthRegion } from './testData/pecsRegions'

describe('PECS regions', () => {
  let previousPecsRegions: PecsRegion[]

  beforeAll(() => {
    previousPecsRegions = pecsRegions.splice(0, pecsRegions.length)
    pecsRegions.splice(0, pecsRegions.length, pecsNorthRegion, pecsSouthRegion, nouRegion, {
      code: 'WEST',
      description: 'Historic West region',
      active: false,
    })
  })

  afterAll(() => {
    pecsRegions.splice(0, pecsRegions.length, ...previousPecsRegions)
  })

  it.each([
    { code: 'NORTH', expected: true },
    { code: 'WEST', expected: true },
    { code: 'EAST', expected: false },
    { code: 'NOU', expected: true },
  ])('should check whether a code is a known PECS region: $code', ({ code, expected }) => {
    expect(isPecsRegionCode(code)).toBe(expected)
  })

  it('should list active regions', () => {
    expect(getActivePecsRegions()).toEqual([pecsNorthRegion, pecsSouthRegion])
  })
})

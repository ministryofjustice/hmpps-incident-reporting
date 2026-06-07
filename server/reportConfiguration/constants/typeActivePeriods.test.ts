import { isTypeActive, typeActivePeriods } from './typeActivePeriods'
import { types, getTypeDetails, type Type } from './types'
import config from '../../config'

/** Local London-midnight date helper for fixed test instants. */
function on(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00+01:00`)
}

describe('typeActivePeriods table', () => {
  it('only references real incident types', () => {
    Object.keys(typeActivePeriods).forEach(code => {
      expect(getTypeDetails(code)).not.toBeNull()
    })
  })

  it('uses valid ISO YYYY-MM-DD dates', () => {
    Object.values(typeActivePeriods).forEach(period => {
      ;[period.activeFrom, period.activeTo].forEach(date => {
        if (date !== undefined) {
          expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        }
      })
    })
  })
})

describe('isTypeActive()', () => {
  it('returns true for a boolean-active type with no window', () => {
    expect(isTypeActive('ASSAULT_5', on('2026-06-07'))).toBe(true)
  })

  it('returns false for a boolean-inactive type even within a future recorded window', () => {
    // FIND_3 carries a recorded end date but its registry boolean is false: it must never reactivate
    expect(getTypeDetails('FIND_3')?.active).toBe(false)
    expect(isTypeActive('FIND_3', on('2020-01-01'))).toBe(false)
  })

  it('returns false for an unknown type code', () => {
    expect(isTypeActive('NOT_A_TYPE')).toBe(false)
  })

  describe('Food refusal switch-over on 2026-07-01', () => {
    it.each([
      ['2026-06-30', 'FOOD_REFUSAL_1', true],
      ['2026-06-30', 'FOOD_REFUSAL_2', false],
      ['2026-07-01', 'FOOD_REFUSAL_1', false],
      ['2026-07-01', 'FOOD_REFUSAL_2', true],
    ] satisfies [string, Type, boolean][])('%s: %s is active=%s', (date, type, expected) => {
      expect(isTypeActive(type, on(date))).toBe(expected)
    })
  })

  describe('Close down search decommission on 2026-07-01', () => {
    it.each([
      ['2026-06-30', true],
      ['2026-07-01', false],
    ])('%s: CLOSE_DOWN_SEARCH_1 is active=%s', (date, expected) => {
      expect(isTypeActive('CLOSE_DOWN_SEARCH_1', on(date))).toBe(expected)
    })
  })

  describe('window boundaries', () => {
    it('treats activeFrom as inclusive', () => {
      expect(isTypeActive('FOOD_REFUSAL_2', on('2026-07-01'))).toBe(true)
    })

    it('treats activeTo as exclusive', () => {
      expect(isTypeActive('FOOD_REFUSAL_1', on('2026-07-01'))).toBe(false)
      expect(isTypeActive('FOOD_REFUSAL_1', on('2026-06-30'))).toBe(true)
    })
  })
})

describe('INCIDENT_TYPE_ACTIVE_DATE override (default "now")', () => {
  const original = config.incidentTypeActiveDate
  afterEach(() => {
    config.incidentTypeActiveDate = original
  })

  it('shifts the effective date used when no explicit instant is given', () => {
    config.incidentTypeActiveDate = '2026-07-01'
    // With the effective date moved to the switch-over, the v2 state is in effect
    expect(isTypeActive('FOOD_REFUSAL_2')).toBe(true)
    expect(isTypeActive('FOOD_REFUSAL_1')).toBe(false)
    expect(isTypeActive('CLOSE_DOWN_SEARCH_1')).toBe(false)
  })

  it('keeps v1 state the day before the override date', () => {
    config.incidentTypeActiveDate = '2026-06-30'
    expect(isTypeActive('FOOD_REFUSAL_1')).toBe(true)
    expect(isTypeActive('FOOD_REFUSAL_2')).toBe(false)
  })
})

describe('one active version per family invariant', () => {
  // Evaluate at "now", at every window boundary, and a day either side of each boundary.
  const boundaries = Object.values(typeActivePeriods).flatMap(period =>
    [period.activeFrom, period.activeTo].filter((date): date is string => date !== undefined),
  )
  const dayBefore = (date: string): string => {
    const d = new Date(`${date}T12:00:00Z`)
    d.setUTCDate(d.getUTCDate() - 1)
    return d.toISOString().slice(0, 10)
  }
  const sampleDates = Array.from(
    new Set([new Date().toISOString().slice(0, 10), ...boundaries, ...boundaries.map(dayBefore)]),
  )

  const families = Array.from(new Set(types.map(type => type.familyCode)))

  it.each(families)('family %s never has more than one active type at any sampled date', familyCode => {
    const familyTypes = types.filter(type => type.familyCode === familyCode)
    sampleDates.forEach(date => {
      const activeCount = familyTypes.filter(type => isTypeActive(type.code, on(date))).length
      if (activeCount > 1) {
        const activeCodes = familyTypes.filter(type => isTypeActive(type.code, on(date))).map(type => type.code)
        throw new Error(`On ${date}, family ${familyCode} has multiple active types: ${activeCodes.join(', ')}`)
      }
    })
  })
})

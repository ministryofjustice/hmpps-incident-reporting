import {
  buildArray,
  convertToTitleCase,
  datesAsStrings,
  initialiseName,
  kebabCase,
  nameOfPerson,
  parseDateInput,
  parseTimeInput,
  prisonerLocation,
  reversedNameOfPerson,
} from './utils'
import { andrew, barry, chris, donald, ernie, fred } from '../data/testData/offenderSearch'
import { isBeingTransferred, isOutside, isInPrison } from '../data/offenderSearchApi'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('display of prisoner names', () => {
  const prisoner = {
    firstName: 'DAVID',
    lastName: 'JONES',
  }

  it('normal', () => {
    expect(nameOfPerson(prisoner)).toEqual('David Jones')
  })

  it('reversed', () => {
    expect(reversedNameOfPerson(prisoner)).toEqual('Jones, David')
  })

  describe.each([
    { scenario: 'only first name', firstName: 'DAVID', expected: 'David' },
    { scenario: 'only surname', lastName: 'JONES', expected: 'Jones' },
  ])('trimming whitespace if $scenario is present', person => {
    it('normal', () => {
      expect(nameOfPerson(person as unknown as { firstName: string; lastName: string })).toEqual(person.expected)
    })

    it('reversed', () => {
      expect(reversedNameOfPerson(person as unknown as { firstName: string; lastName: string })).toEqual(
        person.expected,
      )
    })
  })
})

describe('prisoners’ locations', () => {
  it.each([andrew, barry, chris])(
    'for people who are in prison with a known cell location (e.g. $cellLocation)',
    prisoner => {
      expect(prisonerLocation(prisoner)).toEqual(prisoner.cellLocation)

      expect(isBeingTransferred(prisoner)).toBeFalsy()
      expect(isOutside(prisoner)).toBeFalsy()
      expect(isInPrison(prisoner)).toBeTruthy()
    },
  )

  it('for people who are in prison without a known cell location', () => {
    const prisoner = { ...andrew }
    delete prisoner.cellLocation
    expect(prisonerLocation(prisoner)).toEqual('Not known')

    expect(isBeingTransferred(prisoner)).toBeFalsy()
    expect(isOutside(prisoner)).toBeFalsy()
    expect(isInPrison(prisoner)).toBeTruthy()
  })

  it('for people being transferred', () => {
    expect(prisonerLocation(donald)).toEqual('Transfer')

    expect(isBeingTransferred(donald)).toBeTruthy()
    expect(isOutside(donald)).toBeFalsy()
    expect(isInPrison(donald)).toBeFalsy()
  })

  it('for people being transferred without a location description', () => {
    const prisoner = { ...donald }
    delete prisoner.locationDescription
    expect(prisonerLocation(prisoner)).toEqual('Transfer')

    expect(isBeingTransferred(prisoner)).toBeTruthy()
    expect(isOutside(prisoner)).toBeFalsy()
    expect(isInPrison(prisoner)).toBeFalsy()
  })

  it('for people outside prison', () => {
    expect(prisonerLocation(ernie)).toEqual('Outside - released from Moorland (HMP)')

    expect(isBeingTransferred(ernie)).toBeFalsy()
    expect(isOutside(ernie)).toBeTruthy()
    expect(isInPrison(ernie)).toBeFalsy()
  })

  it('for people outside prison without a location description', () => {
    const prisoner = { ...ernie }
    delete prisoner.locationDescription
    expect(prisonerLocation(prisoner)).toEqual('Outside')

    expect(isBeingTransferred(prisoner)).toBeFalsy()
    expect(isOutside(prisoner)).toBeTruthy()
    expect(isInPrison(prisoner)).toBeFalsy()
  })

  it('for people whose location is blank', () => {
    const prisoner = {
      ...andrew,
      prisonId: '',
      cellLocation: '',
    }
    expect(prisonerLocation(prisoner)).toEqual('Not known')

    expect(isBeingTransferred(prisoner)).toBeFalsy()
    expect(isOutside(prisoner)).toBeFalsy()
    expect(isInPrison(prisoner)).toBeFalsy()
  })

  it('for people whose location is undefined', () => {
    expect(prisonerLocation(fred)).toEqual('Not known')

    expect(isBeingTransferred(fred)).toBeFalsy()
    expect(isOutside(fred)).toBeFalsy()
    expect(isInPrison(fred)).toBeFalsy()
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('parseDateInput', () => {
  it.each([
    ['25/02/2024', [25, 2, 2024]],
    ['01/01/2024 ', [1, 1, 2024]],
    ['03/10/2024', [3, 10, 2024]], // BST
    ['1/1/2024', [1, 1, 2024]],
  ])('should work on valid date %s', (input, [day, month, year]) => {
    const date = parseDateInput(input)
    expect(date.getDate()).toEqual(day)
    expect(date.getUTCDate()).toEqual(day)
    expect(date.getMonth()).toEqual(month - 1)
    expect(date.getFullYear()).toEqual(year)
  })

  it.each([
    undefined,
    null,
    '',
    '1/1/24',
    '32/01/2024',
    '30/2/2025',
    '20-01-2024',
    '01/01/2024 12:00',
    '2024-01-01',
    '2024-01-01T12:00:00Z',
    'today',
  ])('should throw an error on invalid date %p', input => {
    expect(() => parseDateInput(input)).toThrow('Invalid date')
  })
})

describe('parseTimeInput', () => {
  it.each([
    ['10:30', '10:30'],
    ['1:30', '01:30'],
    [' 13:00 ', '13:00'],
    ['00:00', '00:00'],
    ['23:59', '23:59'],
  ])('should work on time: %s', (input, expectedTime) => {
    expect(parseTimeInput(input).time).toStrictEqual(expectedTime)
  })

  it.each([undefined, null, '', 'now', '10.00', '1000', '10', '24:00', '19:5', '0:60'])(
    'should throw an error on invalid time %p',
    input => {
      expect(() => parseTimeInput(input)).toThrow('Invalid time')
    },
  )
})

describe('buildArray()', () => {
  type Scenario = {
    scenario: string
    input: { length: number; builder: (index: number) => unknown }
    expected: unknown[]
  }
  const scenarios: Scenario[] = [
    { scenario: 'empty', input: { length: 0, builder: () => 0 }, expected: [] },
    { scenario: 'empty', input: { length: 1, builder: (index: number) => index }, expected: [0] },
    { scenario: 'empty', input: { length: 3, builder: (index: number) => `${index}` }, expected: ['0', '1', '2'] },
  ]
  it.each(scenarios)('should work with $scenario', ({ input: { length, builder }, expected }) => {
    const result = buildArray(length, builder)
    expect(result).toHaveLength(expected.length)
    expect(result).toEqual(expected)
  })
})

describe('datesAsStrings()', () => {
  const date = new Date()
  const dateString = date.toISOString()

  type Scenario<T> = {
    scenario: string
    input: T
    expected: DatesAsStrings<T>
  }
  it.each([
    { scenario: 'null', input: null, expected: null } satisfies Scenario<null>,
    { scenario: 'undefined', input: undefined, expected: undefined } satisfies Scenario<undefined>,
    { scenario: 'number', input: 123, expected: 123 } satisfies Scenario<number>,
    { scenario: 'boolean', input: true, expected: true } satisfies Scenario<boolean>,
    { scenario: 'string', input: 'abc', expected: 'abc' } satisfies Scenario<string>,
    { scenario: 'empty object', input: {}, expected: {} } satisfies Scenario<object>,
    { scenario: 'empty array', input: [], expected: [] } satisfies Scenario<object[]>,
    {
      scenario: 'simple object',
      input: { str: 'abc', date },
      expected: { str: 'abc', date: dateString },
    } satisfies Scenario<{ str: string; date: Date }>,
    { scenario: 'simple array', input: ['abc', date, 123], expected: ['abc', dateString, 123] } satisfies Scenario<
      [string, Date, number]
    >,
    {
      scenario: 'nested object',
      input: { str: 'abc', nested: { date } },
      expected: { str: 'abc', nested: { date: dateString } },
    } satisfies Scenario<{ str: string; nested: { date: Date } }>,
    {
      scenario: 'nested array',
      input: { str: 'abc', array: [date], nested: { dates: [date] } },
      expected: { str: 'abc', array: [dateString], nested: { dates: [dateString] } },
    } satisfies Scenario<{ str: string; array: [Date]; nested: { dates: [Date] } }>,
  ])('should work on $scenario', ({ input, expected }) => expect(datesAsStrings(input)).toEqual(expected))
})

describe('kebab-case', () => {
  it.each([
    { input: undefined, expected: undefined },
    { input: null, expected: undefined },
    { input: 'ATestValue', expected: 'a-test-value' },
    { input: 'aTestValue', expected: 'a-test-value' },
    { input: 'aTestvalue', expected: 'a-testvalue' },
    { input: 'atestvalue', expected: 'atestvalue' },
    { input: 'a-test-value', expected: 'a-test-value' },
    { input: 'govukCheckboxes', expected: 'govuk-checkboxes' },
    { input: 'HTML', expected: 'h-t-m-l' },
  ])('should convert $input to $expected', ({ input, expected }) => {
    expect(kebabCase(input)).toEqual(expected)
  })
})

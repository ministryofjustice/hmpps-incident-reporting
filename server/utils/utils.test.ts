import {
  type ErrorSummaryItem,
  buildArray,
  convertToTitleCase,
  datesAsStrings,
  findFieldInErrorSummary,
  initialiseName,
  nameOfPerson,
  parseDateInput,
  reversedNameOfPerson,
  prisonerLocation,
  govukSelectInsertDefault,
  GovukSelectItem,
  govukSelectSetSelected,
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
    ['1/1/2024', [1, 1, 2024]],
  ])('should work on valid date %s', (input, [day, month, year]) => {
    const date = parseDateInput(input)
    expect(date.getDate()).toEqual(day)
    expect(date.getMonth()).toEqual(month - 1)
    expect(date.getFullYear()).toEqual(year)
  })

  it.each([
    undefined,
    null,
    '',
    '1/1/24',
    '32/01/2024',
    '20-01-2024',
    '01/01/2024 12:00',
    '2024-01-01',
    '2024-01-01T12:00:00Z',
    'today',
  ])('should throw an error on invalid date %p', input => {
    expect(() => parseDateInput(input)).toThrow('Invalid date')
  })
})

describe('findFieldInErrorSummary', () => {
  it.each([undefined, null])('should return null if error list is %p', list => {
    expect(findFieldInErrorSummary(list, 'field')).toBeNull()
  })

  it('should return null if error list is empty', () => {
    expect(findFieldInErrorSummary([], 'field')).toBeNull()
  })

  const errorList: ErrorSummaryItem[] = [
    { text: 'Enter a number', href: '#field1' },
    { text: 'Enter a date', href: '#field3' },
  ]

  it('should return null if field is not found', () => {
    expect(findFieldInErrorSummary(errorList, 'field2')).toBeNull()
  })

  it('should return error message if field is found', () => {
    expect(findFieldInErrorSummary(errorList, 'field3')).toStrictEqual({ text: 'Enter a date' })
  })
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

describe('govukSelectInsertDefault', () => {
  it.each([undefined, null])('should ignore item list %p', list => {
    expect(govukSelectInsertDefault(list, 'Select an option…')).toStrictEqual(list)
  })

  it('should insert a blank item at the beginning', () => {
    const list: GovukSelectItem[] = [{ text: 'Red' }, { text: 'Blue', value: 'blue' }]
    const newList = govukSelectInsertDefault(list, 'Select an option…')
    expect(newList).toHaveLength(3)
    expect(newList[0]).toStrictEqual<GovukSelectItem>({ text: 'Select an option…', value: '', selected: true })
  })

  it('should insert a blank item into an empty list', () => {
    const list: GovukSelectItem[] = []
    const newList = govukSelectInsertDefault(list, 'Choose one')
    expect(newList).toHaveLength(1)
    expect(newList[0]).toStrictEqual<GovukSelectItem>({ text: 'Choose one', value: '', selected: true })
  })
})

describe('govukSelectSetSelected', () => {
  it.each([undefined, null])('should ignore item list %p', list => {
    expect(govukSelectSetSelected(list, 'red')).toStrictEqual(list)
  })

  it('should only leave `selected` as true for item that is found by-value', () => {
    const list: GovukSelectItem[] = [
      { text: 'Red', value: 'red' },
      { text: 'Blue', value: 'blue' },
    ]
    const newList = govukSelectSetSelected(list, 'blue')
    expect(newList).toHaveLength(2)
    expect(newList.map(item => item.selected)).toStrictEqual([false, true])
  })

  it('should set `selected` of all items to false if item is not found by-value', () => {
    const list: GovukSelectItem[] = [
      { text: 'Red', value: 'red' },
      { text: 'Blue', value: 'blue' },
    ]
    const newList = govukSelectSetSelected(list, 'green')
    expect(newList).toHaveLength(2)
    expect(newList.map(item => item.selected)).toStrictEqual([false, false])
  })

  it('should NOT set `selected` on any items if value being selected is undefined', () => {
    const list: GovukSelectItem[] = [
      { text: 'Red', value: 'red' },
      { text: 'Blue', value: 'blue' },
    ]
    const newList = govukSelectSetSelected(list, undefined)
    expect(newList).toHaveLength(2)
    expect(newList.map(item => item.selected)).toStrictEqual([undefined, undefined])
  })

  it('should fall back to matching on `text` property if item `value` is not set', () => {
    const list: GovukSelectItem[] = [{ text: 'Red' }, { text: 'Blue' }]
    const newList = govukSelectSetSelected(list, 'Blue')
    expect(newList).toHaveLength(2)
    expect(newList.map(item => item.selected)).toStrictEqual([false, true])
  })
})

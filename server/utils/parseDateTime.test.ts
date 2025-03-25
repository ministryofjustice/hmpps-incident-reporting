import { parseDateInput, parseTimeInput } from './parseDateTime'

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

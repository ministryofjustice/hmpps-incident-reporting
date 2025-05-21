import format from './format'

describe('longDateAndTime(): Format `Date` in long form as Europe/London including 24-hour time-of-day', () => {
  it.each([
    // same UTC offset, not DST
    ['2022-02-22T12:00:00Z', '22 February 2022 at 12:00'],
    // differing UTC offset, not DST
    ['2022-02-22T12:00:00+01:00', '22 February 2022 at 11:00'],

    // same UTC offset, DST
    ['2022-06-22T12:00:00Z', '22 June 2022 at 13:00'],
    // differing UTC offset, DST
    ['2022-06-22T12:00:00+01:00', '22 June 2022 at 12:00'],

    // near DST switch
    ['2021-10-30T23:59:59Z', '31 October 2021 at 00:59'],
    ['2021-10-31T00:00:00Z', '31 October 2021 at 01:00'],
    ['2021-10-31T00:00:01Z', '31 October 2021 at 01:00'],
    ['2021-10-31T00:59:59Z', '31 October 2021 at 01:59'],
    ['2021-10-31T01:00:00Z', '31 October 2021 at 01:00'],
    ['2021-10-31T01:00:01Z', '31 October 2021 at 01:00'],

    // 24-hr clock
    ['2022-02-23T16:37:53Z', '23 February 2022 at 16:37'],
  ])('new Date(%s) is formatted as %s', (date, expected) => {
    expect(format.longDateAndTime(new Date(date))).toEqual(expected)
  })

  it("returns '' for null and undefined", () => {
    expect(format.longDateAndTime(null)).toEqual('')
    expect(format.longDateAndTime(undefined)).toEqual('')
  })
})

describe('longDate(): Format `Date` in long form as Europe/London ignoring time-of-day', () => {
  it.each([
    // same UTC offset, not DST
    ['2022-02-22T12:00:00Z', '22 February 2022'],
    // differing UTC offset, not DST
    ['2022-02-22T12:00:00+01:00', '22 February 2022'],

    // same UTC offset, DST
    ['2022-06-22T12:00:00Z', '22 June 2022'],
    // differing UTC offset, DST
    ['2022-06-22T12:00:00+01:00', '22 June 2022'],

    // near DST switch
    ['2021-10-30T23:59:59Z', '31 October 2021'],
    ['2021-10-31T00:00:00Z', '31 October 2021'],
    ['2021-10-31T00:00:01Z', '31 October 2021'],
    ['2021-10-31T00:59:59Z', '31 October 2021'],
    ['2021-10-31T01:00:00Z', '31 October 2021'],
    ['2021-10-31T01:00:01Z', '31 October 2021'],

    // 24-hr clock
    ['2022-02-23T16:37:53Z', '23 February 2022'],
  ])('new Date(%s) is formatted as %s ignoring time-of-day', (date, expected) => {
    expect(format.longDate(new Date(date))).toEqual(expected)
  })

  it("returns '' for null and undefined", () => {
    expect(format.longDate(null)).toEqual('')
    expect(format.longDate(undefined)).toEqual('')
  })
})

describe('shortDateAndTime(): Format `Date` in short form as Europe/London including 24-hour time-of-day', () => {
  it.each([
    // same UTC offset, not DST
    ['2022-02-22T12:00:00Z', '22/2/2022 at 12:00'],
    // differing UTC offset, not DST
    ['2022-02-22T12:00:00+01:00', '22/2/2022 at 11:00'],

    // same UTC offset, DST
    ['2022-06-22T12:00:00Z', '22/6/2022 at 13:00'],
    // differing UTC offset, DST
    ['2022-06-22T12:00:00+01:00', '22/6/2022 at 12:00'],

    // near DST switch
    ['2021-10-30T23:59:59Z', '31/10/2021 at 00:59'],
    ['2021-10-31T00:00:00Z', '31/10/2021 at 01:00'],
    ['2021-10-31T00:00:01Z', '31/10/2021 at 01:00'],
    ['2021-10-31T00:59:59Z', '31/10/2021 at 01:59'],
    ['2021-10-31T01:00:00Z', '31/10/2021 at 01:00'],
    ['2021-10-31T01:00:01Z', '31/10/2021 at 01:00'],

    // 24-hr clock
    ['2022-02-23T16:37:53Z', '23/2/2022 at 16:37'],

    // no leading zeroes
    ['2025-01-01T12:34:56.78Z', '1/1/2025 at 12:34'],
  ])('new Date(%s) is formatted as %s ignoring time-of-day', (date, expected) => {
    expect(format.shortDateAndTime(new Date(date))).toEqual(expected)
  })

  it("returns '' for null and undefined", () => {
    expect(format.shortDateAndTime(null)).toEqual('')
    expect(format.shortDateAndTime(undefined)).toEqual('')
  })
})

describe('shortDate(): Format `Date` in short form as Europe/London ignoring time-of-day', () => {
  it.each([
    // same UTC offset, not DST
    ['2022-02-22T12:00:00Z', '22/2/2022'],
    // differing UTC offset, not DST
    ['2022-02-22T12:00:00+01:00', '22/2/2022'],

    // same UTC offset, DST
    ['2022-06-22T12:00:00Z', '22/6/2022'],
    // differing UTC offset, DST
    ['2022-06-22T12:00:00+01:00', '22/6/2022'],

    // near DST switch
    ['2021-10-30T23:59:59Z', '31/10/2021'],
    ['2021-10-31T00:00:00Z', '31/10/2021'],
    ['2021-10-31T00:00:01Z', '31/10/2021'],
    ['2021-10-31T00:59:59Z', '31/10/2021'],
    ['2021-10-31T01:00:00Z', '31/10/2021'],
    ['2021-10-31T01:00:01Z', '31/10/2021'],

    // 24-hr clock
    ['2022-02-23T16:37:53Z', '23/2/2022'],

    // no leading zeroes
    ['2025-01-01T12:34:56.78Z', '1/1/2025'],
  ])('new Date(%s) is formatted as %s ignoring time-of-day', (date, expected) => {
    expect(format.shortDate(new Date(date))).toEqual(expected)
  })

  it("returns '' for null and undefined", () => {
    expect(format.shortDate(null)).toEqual('')
    expect(format.shortDate(undefined)).toEqual('')
  })
})

describe('time(): Format `Date` as time alone in Europe/London using 24 hour clock', () => {
  it.each([
    // same UTC offset, not DST
    ['2022-02-22T12:00:00Z', '12:00'],
    // differing UTC offset, not DST
    ['2022-02-22T12:00:00+01:00', '11:00'],

    // same UTC offset, DST
    ['2022-06-22T12:00:00Z', '13:00'],
    // differing UTC offset, DST
    ['2022-06-22T12:00:00+01:00', '12:00'],

    // near DST switch
    ['2021-10-30T23:59:59Z', '00:59'],
    ['2021-10-31T00:00:00Z', '01:00'],
    ['2021-10-31T00:00:01Z', '01:00'],
    ['2021-10-31T00:59:59Z', '01:59'],
    ['2021-10-31T01:00:00Z', '01:00'],
    ['2021-10-31T01:00:01Z', '01:00'],

    // 24-hr clock
    ['2022-02-23T16:37:53Z', '16:37'],
  ])('new Date(%s) is formatted as %s ignoring time-of-day', (date, expected) => {
    expect(format.time(new Date(date))).toEqual(expected)
  })

  it("returns '' for null and undefined", () => {
    expect(format.time(null)).toEqual('')
    expect(format.time(undefined)).toEqual('')
  })
})

describe('isoDate(): Formats dates in Europe/London ISO style, used when calling APIs', () => {
  it.each([
    ['2024-07-30T12:34:56', '2024-07-30'],
    ['2024-07-30T12:34:56Z', '2024-07-30'],
    ['2024-07-30T12:34:56+01:00', '2024-07-30'],

    // near DST switch
    ['2021-10-30T23:59:59Z', '2021-10-31'],
    ['2021-10-31T00:00:00Z', '2021-10-31'],
    ['2021-10-31T00:00:01Z', '2021-10-31'],
    ['2021-10-31T00:59:59Z', '2021-10-31'],
    ['2021-10-31T01:00:00Z', '2021-10-31'],
    ['2021-10-31T01:00:01Z', '2021-10-31'],
  ])('new Date(%s) formats as %s in ISO date style', (date, expected) => {
    expect(format.isoDate(new Date(date))).toEqual(expected)
  })

  it.each([null, undefined])('preserves %s', input => {
    expect(format.isoDate(input)).toStrictEqual(input)
  })
})

describe('isoDateTime(): Formats dates with time-of-day in Europe/London ISO style, used when calling APIs', () => {
  it.each([
    ['2024-07-30T12:34:56', '2024-07-30T12:34:56'],
    ['2024-07-30T12:34:56Z', '2024-07-30T13:34:56'],
    ['2024-07-30T12:34:56+01:00', '2024-07-30T12:34:56'],

    // near DST switch
    ['2021-10-30T23:59:59Z', '2021-10-31T00:59:59'],
    ['2021-10-31T00:00:00Z', '2021-10-31T01:00:00'],
    ['2021-10-31T00:00:01Z', '2021-10-31T01:00:01'],
    ['2021-10-31T00:59:59Z', '2021-10-31T01:59:59'],
    ['2021-10-31T01:00:00Z', '2021-10-31T01:00:00'],
    ['2021-10-31T01:00:01Z', '2021-10-31T01:00:01'],
  ])('new Date(%s) formats as %s in ISO date style', (date, expected) => {
    expect(format.isoDateTime(new Date(date))).toEqual(expected)
  })

  it.each([null, undefined])('preserves %s', input => {
    expect(format.isoDateTime(input)).toStrictEqual(input)
  })
})

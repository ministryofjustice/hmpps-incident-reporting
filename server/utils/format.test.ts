import format from './format'

describe('dateAndTime(): Format datetime as Europe/London including time of day', () => {
  it.each([
    // same UTC offset, not DST
    ['2022-02-22T12:00:00Z', '22 February 2022, 12:00'],
    // differing UTC offset, not DST
    ['2022-02-22T12:00:00+01:00', '22 February 2022, 11:00'],

    // same UTC offset, DST
    ['2022-06-22T12:00:00Z', '22 June 2022, 13:00'],
    // differing UTC offset, DST
    ['2022-06-22T12:00:00+01:00', '22 June 2022, 12:00'],

    // near DST switch
    ['2021-10-30T23:59:59Z', '31 October 2021, 00:59'],
    ['2021-10-31T00:00:00Z', '31 October 2021, 01:00'],
    ['2021-10-31T00:00:01Z', '31 October 2021, 01:00'],
    ['2021-10-31T00:59:59Z', '31 October 2021, 01:59'],
    ['2021-10-31T01:00:00Z', '31 October 2021, 01:00'],
    ['2021-10-31T01:00:01Z', '31 October 2021, 01:00'],

    // 24-hr clock
    ['2022-02-23T16:37:53Z', '23 February 2022, 16:37'],
  ])('new Date(%s) is formatted as %s', (date, expected) => {
    expect(format.dateAndTime(new Date(date))).toEqual(expected)
  })

  it("returns '' for null and undefined", () => {
    expect(format.dateAndTime(null)).toEqual('')
    expect(format.dateAndTime(undefined)).toEqual('')
  })
})

describe('date(): Format dates as Europe/London ignoring time-of-day', () => {
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
    expect(format.date(new Date(date))).toEqual(expected)
  })

  it("returns '' for null and undefined", () => {
    expect(format.date(null)).toEqual('')
    expect(format.date(undefined)).toEqual('')
  })
})

describe('shortDate(): Format shorts dates as Europe/London ignoring time-of-day', () => {
  it.each([
    // same UTC offset, not DST
    ['2022-02-22T12:00:00Z', '22/02/2022'],
    // differing UTC offset, not DST
    ['2022-02-22T12:00:00+01:00', '22/02/2022'],

    // same UTC offset, DST
    ['2022-06-22T12:00:00Z', '22/06/2022'],
    // differing UTC offset, DST
    ['2022-06-22T12:00:00+01:00', '22/06/2022'],

    // near DST switch
    ['2021-10-30T23:59:59Z', '31/10/2021'],
    ['2021-10-31T00:00:00Z', '31/10/2021'],
    ['2021-10-31T00:00:01Z', '31/10/2021'],
    ['2021-10-31T00:59:59Z', '31/10/2021'],
    ['2021-10-31T01:00:00Z', '31/10/2021'],
    ['2021-10-31T01:00:01Z', '31/10/2021'],

    // 24-hr clock
    ['2022-02-23T16:37:53Z', '23/02/2022'],
  ])('new Date(%s) is formatted as %s ignoring time-of-day', (date, expected) => {
    expect(format.shortDate(new Date(date))).toEqual(expected)
  })

  it("returns '' for null and undefined", () => {
    expect(format.shortDate(null)).toEqual('')
    expect(format.shortDate(undefined)).toEqual('')
  })
})

describe('time(): Formats dates as time in Europe/London', () => {
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

describe('isoDate(): Formats dates in ISO style, used when calling APIs', () => {
  it.each([
    ['2024-07-30T12:34:56', '2024-07-30'],
    ['2024-07-30T12:34:56Z', '2024-07-30'],
    ['2024-07-30T12:34:56+01:00', '2024-07-30'],
  ])('new Date(%s) formats as %s in ISO date style', (date, expected) => {
    expect(format.isoDate(new Date(date))).toEqual(expected)
  })

  it.each([null, undefined])('preserves %s', input => {
    expect(format.isoDate(input)).toEqual(input)
  })
})

const longDateAndTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/London',
})
const longDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/London',
})
const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  // NB: 'numeric' for day or month always produces leading zeroes so might as well make it explicit
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Europe/London',
})
const hourAndMinuteFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
  timeZone: 'Europe/London',
})
const hourMinuteAndSecondFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Europe/London',
})

export default {
  /**
   * Format `Date` in long form as Europe/London including 24-hour time-of-day.
   *
   * Example: `2 March 2022 at 11:00`
   */
  longDateAndTime(date: Date): string {
    if (typeof date === 'undefined' || date === null) {
      return ''
    }
    return longDateAndTimeFormatter.format(date)
  },

  /**
   * Format `Date` in long form as Europe/London ignoring time-of-day.
   *
   * Example: `2 March 2022`
   */
  longDate(date: Date): string {
    if (typeof date === 'undefined' || date === null) {
      return ''
    }
    return longDateFormatter.format(date)
  },

  /**
   * Format `Date` in short form as Europe/London ignoring time-of-day.
   * Note absence of leading zeroes.
   *
   * Example: `2/3/2022`
   */
  shortDate(date: Date): string {
    if (typeof date === 'undefined' || date === null) {
      return ''
    }
    return shortDateFormatter
      .formatToParts(date)
      .map(part => part.value.replace(/^0+/, ''))
      .join('')
  },

  /**
   * Format `Date` as time alone in Europe/London using 24 hour clock.
   *
   * Example: `14:22`
   */
  time(date: Date): string {
    if (typeof date === 'undefined' || date === null) {
      return ''
    }
    return hourAndMinuteFormatter.format(date)
  },

  /**
   * Formats dates in Europe/London ISO style, used when calling APIs.
   * NB: time zone is _not_ appended.
   *
   * Example: `2024-07-30`
   */
  isoDate(date: Date): string {
    if (!(date instanceof Date)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore just in case value is not a Date
      return date
    }
    const { day, month, year } = Object.fromEntries(
      shortDateFormatter.formatToParts(date).map(part => [part.type, part.value]),
    ) as Record<'day' | 'month' | 'year', string>
    return `${year}-${month}-${day}`
  },

  /**
   * Formats dates with time-of-day in Europe/London ISO style, used when calling APIs.
   * NB: time zone is _not_ appended.
   *
   * Example: `2024-07-30T14:22`
   */
  isoDateTime(date: Date): string {
    if (!(date instanceof Date)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore just in case value is not a Date
      return date
    }
    const isoDate: string = this.isoDate(date)
    const time = hourMinuteAndSecondFormatter.format(date)
    const [hours, minutes, seconds] = time.split(':')
    return `${isoDate}T${hours}:${minutes}:${seconds}`
  },
}

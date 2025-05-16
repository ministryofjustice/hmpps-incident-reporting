export default {
  /**
   * Format `Date` in long form as Europe/London including 24-hour time of day.
   *
   * Example: `22 February 2022 at 11:00`
   */
  longDateAndTime(date: Date): string {
    if (typeof date === 'undefined' || date === null) {
      return ''
    }
    return date.toLocaleDateString('en-GB', {
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Europe/London',
    })
  },

  /**
   * Format Date as Europe/London ignoring time-of-day.
   *
   * Example: `22 February 2022`
   */
  longDate(date: Date): string {
    if (typeof date === 'undefined' || date === null) {
      return ''
    }
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Europe/London',
    })
  },

  /**
   * Format Date as Europe/London ignoring time-of-day.
   *
   * Example: `22/02/2022`
   */
  shortDate(date: Date): string {
    if (typeof date === 'undefined' || date === null) {
      return ''
    }
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      timeZone: 'Europe/London',
    })
  },

  /**
   * Format Date as time in Europe/London.
   *
   * Example: `14:22`
   */
  time(date: Date): string {
    if (typeof date === 'undefined' || date === null) {
      return ''
    }
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      timeZone: 'Europe/London',
    })
  },

  /**
   * Formats dates in Europe/London ISO style, used when calling APIs.
   *
   * Example: `2024-07-30`
   */
  isoDate(date: Date): string {
    if (!(date instanceof Date)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore just in case value is not a Date
      return date
    }
    const shortDate: string = this.shortDate(date)
    const [day, month, year] = shortDate.split('/')
    return `${year}-${month}-${day}`
  },

  /**
   * Formats dates with time-of-day in Europe/London ISO style, used when calling APIs.
   * NB: time zone is _not_ appended
   *
   * Example: `2024-07-30T14:22`
   */
  isoDateTime(date: Date): string {
    if (!(date instanceof Date)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore just in case value is not a Date
      return date
    }
    const shortDate: string = this.shortDate(date)
    const [day, month, year] = shortDate.split('/')
    const time = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Europe/London',
    })
    const [hours, minutes, seconds] = time.split(':')
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  },
}

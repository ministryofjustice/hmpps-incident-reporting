export default {
  dateAndTime(date: Date): string {
    if (typeof date === 'undefined' || date === null) {
      return ''
    }
    const formatted = date.toLocaleDateString('en-GB', {
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Europe/London',
    })
    return formatted.replace(' at ', ', ')
  },

  date(date: Date): string {
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

  /** Formats a date, e.g. 31/10/2021 */
  formDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      timeZone: 'Europe/London',
    })
  },
}

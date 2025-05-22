// NB: this module is shared with frontend code so cannot import or use anything not found in the browser!

/**
 * Parse date in the form DD/MM/YYYY; the returned time part should be ignored.
 * Accepts 1-digit date and month parts.
 * Throws an error when invalid.
 */
export function parseDateInput(input: string): Date {
  const match = input && /^(?<day>\d{1,2})\/(?<month>\d{1,2})\/(?<year>\d{4})$/.exec(input.trim())
  if (!match) throw new Error('Invalid date')
  const { year, month, day } = match.groups
  const y = parseInt(year, 10)
  const m = parseInt(month, 10)
  const d = parseInt(day, 10)
  if (Number.isSafeInteger(y) && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
    const date = new Date(y, m - 1, d, 12)
    if (date && date.getDate() === d) {
      // ensures date is valid and js did not choose to roll forward to the next month
      return date
    }
  }
  throw new Error('Invalid date')
}

/**
 * Parse time in the form HH:MM.
 * Accepts 1-digit hour part, but requires colon as the separator.
 * Throws an error when invalid.
 */
export function parseTimeInput(input: string): { hours: number; minutes: number; time: string } {
  const match = input && /^(?<hours>\d{1,2}):(?<minutes>\d\d)$/.exec(input.trim())
  if (!match) throw new Error('Invalid time')
  const { hours, minutes } = match.groups
  const h = parseInt(hours, 10)
  const m = parseInt(minutes, 10)
  if (h >= 0 && h < 24 && m >= 0 && m < 60)
    return {
      hours: h,
      minutes: m,
      time: `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`,
    }
  throw new Error('Invalid time')
}

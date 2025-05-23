import { now } from './fakeClock'

/**
 * Makes date objects and timers use  fixed clock with current date/time:
 * 2023-12-05T12:34:56.000Z
 */
export function fakeClock() {
  jest.useFakeTimers({ now })
  jest.setSystemTime(now)
}

/**
 * Reset to system clock
 */
export function resetClock() {
  jest.useRealTimers()
}

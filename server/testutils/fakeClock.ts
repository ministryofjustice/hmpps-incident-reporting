export function fakeClock() {
  const now = new Date(2023, 11, 5, 12, 34, 56)
  jest.useFakeTimers({ now })
  jest.setSystemTime(now)
}

export function resetClock() {
  jest.useRealTimers()
}

/**
 * Caches a value of type T for `durationMillisecs` ms
 */
export default class Cache<T> {
  durationMillisecs: number

  updatedAt: Date | null

  value: T | null

  constructor(durationMillisecs: number) {
    this.durationMillisecs = durationMillisecs
    this.reset()
  }

  set(newValue: T) {
    this.updatedAt = new Date()
    this.value = newValue
  }

  get(): T | null {
    // no value in cache yet
    if (this.value === null || this.updatedAt === null) {
      return null
    }

    const now = new Date()
    const msElapsed = now.getTime() - this.updatedAt.getTime()

    // is value in cache still valid?
    if (msElapsed < this.durationMillisecs) {
      return this.value
    }

    return null
  }

  reset() {
    this.updatedAt = null
    this.value = null
  }
}

import logger from '../../logger'

/**
 * Caches a value of type T for `durationMillisecs` ms
 */
export default class Cache<T> {
  durationMillisecs: number

  updatedAt: Date | null

  value: T | null

  constructor(durationMillisecs: number) {
    this.durationMillisecs = durationMillisecs
    this.updatedAt = null
    this.value = null
  }

  set(newValue: T) {
    this.updatedAt = new Date()
    this.value = newValue
  }

  get(): T | null {
    // no value in cache yet
    if (this.value === null || this.updatedAt === null) {
      logger.debug(`NO VALUE in cache`)
      return null
    }

    const now = new Date()
    const msElapsed = now.getTime() - this.updatedAt.getTime()

    // is value in cache still valid?
    if (msElapsed < this.durationMillisecs) {
      logger.debug(`msElapsed = ${msElapsed} - CACHE STILL VALID`)
      return this.value
    }

    logger.debug(`msElapsed = ${msElapsed} - CACHE EXPIRED`)

    return null
  }
}

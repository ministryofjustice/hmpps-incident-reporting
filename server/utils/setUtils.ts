/**
 * Returns a new set with the elements of A which are not in B
 *
 * @param a first Set
 * @param b second Set
 * @returns the Set with the difference A - B
 */
export function setDifference<T>(a: Set<T>, b: Set<T>): Set<T> {
  const diff = new Set<T>(a)

  b.forEach(elem => diff.delete(elem))

  return diff
}

/**
 * Returns a string with the list of elements in the given Set
 *
 * @param set a Set
 * @returns a string with the list of elements
 */
export function setToString<Q>(set: Set<Q>): string {
  return [...set.values()].join(', ')
}

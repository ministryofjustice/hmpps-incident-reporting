import ManageUsersApiClient from '../data/manageUsersApiClient'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

/**
 * Normal display form of a person’s name (often a prisoner)
 * { "firstName": "DAVID", "lastName": "JONES", … } → "David Jones"
 */
export const nameOfPerson = (prisoner: { firstName: string; lastName: string }): string =>
  `${convertToTitleCase(prisoner.firstName)} ${convertToTitleCase(prisoner.lastName)}`.trim()

/**
 * Display form of a person’s name (often a prisoner) for lists and tables
 * { "firstName": "DAVID", "lastName": "JONES", … } → "Jones, David"
 */
export const reversedNameOfPerson = (prisoner: { firstName: string; lastName: string }): string => {
  if (!prisoner.lastName) {
    return convertToTitleCase(prisoner.firstName)
  }
  if (!prisoner.firstName) {
    return convertToTitleCase(prisoner.lastName)
  }
  return `${convertToTitleCase(prisoner.lastName)}, ${convertToTitleCase(prisoner.firstName)}`
}

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Creates a lookup containing unique (username: user's name) pairs to replace usernames with the user's name in templates
 * @param manageUsersApi the API client for the manage users service to retrieve user information.
 * @param systemToken the system token to use to access the API client.
 * @param usernameSet Array containing all usernames that is required for the lookup
 * @returns Object containing key:value pairs where the system username is the key and the corresponding user's name is the value
 */
export async function makeUsernameLookup(
  manageUsersApi: ManageUsersApiClient,
  systemToken: string,
  usernameList: Array<string>,
): Promise<Record<string, string>> {
  const uniqueUsernames = [...new Set(usernameList)]
  const users = [
    ...(await Promise.allSettled(uniqueUsernames.map(username => manageUsersApi.getNamedUser(systemToken, username))))
      .map(promise => (promise.status === 'fulfilled' ? promise.value : null))
      .filter(user => user),
  ]
  return users.reduce((prev, user) => ({ ...prev, [user.username]: user.name }), {})
}

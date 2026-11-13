/** NOMIS staff member */
export interface Staff {
  firstName: string
  lastName: string
  username: string
  active: boolean
  activeCaseLoadId: string
}

export const staffBarry: Staff = {
  username: 'lev79n',
  firstName: 'BARRY',
  lastName: 'HARRISON',
  active: true,
  activeCaseLoadId: 'LEI',
}

export const staffMary: Staff = {
  username: 'abc12a',
  firstName: 'MARY',
  lastName: 'JOHNSON',
  active: true,
  activeCaseLoadId: 'MDI',
}

import type { Prison, Staff } from '../prisonApi'

export const brixton: Prison = {
  agencyId: 'BXI',
  description: 'Brixton (HMP)',
  agencyType: 'INST',
  active: true,
}

export const leeds: Prison = {
  agencyId: 'LEI',
  description: 'Leeds (HMP)',
  agencyType: 'INST',
  active: true,
}

export const moorland: Prison = {
  agencyId: 'MDI',
  description: 'Moorland (HMP & YOI)',
  agencyType: 'INST',
  active: true,
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

import type { Agency, Staff } from '../prisonApi'
import { AgencyType } from '../prisonApi'

export const brixton: Agency = {
  agencyId: 'BXI',
  description: 'Brixton (HMP)',
  agencyType: AgencyType.INST,
  active: true,
}

export const leeds: Agency = {
  agencyId: 'LEI',
  description: 'Leeds (HMP)',
  agencyType: AgencyType.INST,
  active: true,
}

export const moorland: Agency = {
  agencyId: 'MDI',
  description: 'Moorland (HMP & YOI)',
  agencyType: AgencyType.INST,
  active: true,
}

export const pecsNorth: Agency = {
  agencyId: 'NORTH',
  description: 'PECS North',
  agencyType: AgencyType.PECS,
  active: true,
}

export const pecsSouth: Agency = {
  agencyId: 'SOUTH',
  description: 'PECS South',
  agencyType: AgencyType.PECS,
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

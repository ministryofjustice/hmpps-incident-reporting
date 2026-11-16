import { RegisterAgencyType } from '../constants'
import type { Agency } from '../prisonRegisterApi'

export const brixton = {
  agencyId: 'BXI',
  description: 'Brixton (HMP)',
  agencyType: RegisterAgencyType.PRISON,
  active: true,
} satisfies Agency

export const leeds = {
  agencyId: 'LEI',
  description: 'Leeds (HMP)',
  agencyType: RegisterAgencyType.PRISON,
  active: true,
} satisfies Agency

export const moorland = {
  agencyId: 'MDI',
  description: 'Moorland (HMP & YOI)',
  agencyType: RegisterAgencyType.PRISON,
  active: true,
} satisfies Agency

export const pecsNou = {
  agencyId: 'NOU',
  description: 'National Operations Unit',
  agencyType: RegisterAgencyType.PECS,
  active: true,
} satisfies Agency

export const pecsNorth = {
  agencyId: 'NORTH',
  description: 'PECS North',
  agencyType: RegisterAgencyType.PECS,
  active: true,
} satisfies Agency

export const pecsSouth = {
  agencyId: 'SOUTH',
  description: 'PECS South',
  agencyType: RegisterAgencyType.PECS,
  active: true,
} satisfies Agency

import { RegisterAgencyType } from '../constants'
import type { Agency } from '../prisonRegisterApi'

/** Test agencies always have a description */
type TestAgency = Agency & { description: string }

export const brixton: TestAgency = {
  agencyId: 'BXI',
  description: 'Brixton (HMP)',
  agencyType: RegisterAgencyType.PRISON,
  active: true,
}

export const leeds: TestAgency = {
  agencyId: 'LEI',
  description: 'Leeds (HMP)',
  agencyType: RegisterAgencyType.PRISON,
  active: true,
}

export const moorland: TestAgency = {
  agencyId: 'MDI',
  description: 'Moorland (HMP & YOI)',
  agencyType: RegisterAgencyType.PRISON,
  active: true,
}

export const pecsNou: TestAgency = {
  agencyId: 'NOU',
  description: 'National Operations Unit',
  agencyType: RegisterAgencyType.PECS,
  active: true,
}

export const pecsNorth: TestAgency = {
  agencyId: 'NORTH',
  description: 'PECS North',
  agencyType: RegisterAgencyType.PECS,
  active: true,
}

export const pecsSouth: TestAgency = {
  agencyId: 'SOUTH',
  description: 'PECS South',
  agencyType: RegisterAgencyType.PECS,
  active: true,
}

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'
import { types } from '../constants'

// eslint-disable-next-line import/prefer-default-export
export function getAllIncidentTypeConfigurations(): Promise<IncidentTypeConfiguration[]> {
  return Promise.all(types.map(type => import(`./${type.code}`).then(module => module.default)))
}

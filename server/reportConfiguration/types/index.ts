import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'
import { types } from '../constants'

export function getAllIncidentTypeConfigurations(): Promise<IncidentTypeConfiguration[]> {
  return Promise.all(types.map(type => import(`./${type.code}`).then(module => module.default)))
}

export function getIncidentTypeConfiguration(type: string): Promise<IncidentTypeConfiguration> {
  return import(`./${type}.js`).then(module => module.default.default)
}

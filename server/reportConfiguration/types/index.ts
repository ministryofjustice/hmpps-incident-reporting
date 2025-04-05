import path from 'node:path'

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'
import { types } from '../constants'

export function getAllIncidentTypeConfigurations(): IncidentTypeConfiguration[] {
  // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-require-imports
  return types.map(type => require(`./${type.code}`).default)
}

export function getIncidentTypeConfiguration(type: string): Promise<IncidentTypeConfiguration> {
  // Import works differently when running TS directly (e.g tests)
  const ext = __filename.endsWith('.js') ? 'js' : 'ts'
  const configPath = path.resolve(__dirname, `./${type}.${ext}`)

  return import(configPath).then(module => {
    if (ext === 'js') {
      return module.default.default
    }

    return module.default
  })
}

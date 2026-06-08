import path from 'node:path'

import type { IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'
import { types } from '../constants'

export function getAllIncidentTypeConfigurations(): IncidentTypeConfiguration[] {
  // eslint-disable-next-line import/no-dynamic-require, global-require, @typescript-eslint/no-require-imports
  return types.map(type => require(`./${type.code}`).default)
}

export async function getIncidentTypeConfiguration(type: string): Promise<IncidentTypeConfiguration> {
  // Import works differently when running TS directly (e.g tests)
  const ext = __filename.endsWith('.js') ? 'js' : 'ts'
  const configPath = path.resolve(__dirname, `./${type}.${ext}`)

  // Depending on the runtime (ts-jest, tsx, built JS), CJS/ESM interop nests the
  // default export at a different depth — unwrap `.default` until we reach the config.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let config: any = await import(configPath)
  while (config && typeof config === 'object' && !('incidentType' in config) && 'default' in config) {
    config = config.default
  }
  return config as IncidentTypeConfiguration
}

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import { IncidentTypeConfiguration } from './types'
import { toGraphviz, toTypescript } from './conversion'

export function saveAsTypescript({
  scriptName,
  dpsConfig,
}: {
  scriptName: string
  dpsConfig: IncidentTypeConfiguration
}): string {
  const typesDir = typesPath()
  const tsPath = path.resolve(typesDir, `${dpsConfig.incidentType}.ts`)

  const tsData = toTypescript({ dpsConfig, scriptName })
  fs.writeFileSync(tsPath, tsData)

  // Make TypeScript file pretty
  spawnSync('npx', ['prettier', '--write', tsPath], { encoding: 'utf8' })

  return tsPath
}

export function saveAsGraphviz(config: IncidentTypeConfiguration): string {
  const typesDir = typesPath()
  const graphvizPath = path.resolve(typesDir, `${config.incidentType}.dot`)
  const svgPath = path.resolve(typesDir, `${config.incidentType}.svg`)

  const graphvizData = toGraphviz(config)
  fs.writeFileSync(graphvizPath, graphvizData)

  // Converts to SVG using graphviz's dot command
  spawnSync('dot', ['-T', 'svg', '-o', svgPath, graphvizPath])

  return svgPath
}

function typesPath(): string {
  return path.resolve(__dirname, '../../../server/reportConfiguration/types')
}

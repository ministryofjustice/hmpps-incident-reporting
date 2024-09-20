import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import { IncidentTypeConfiguration } from './types'
import { toGraphviz } from './graphviz'

export function saveAsTypescript({
  scriptName,
  dpsConfig,
}: {
  scriptName: string
  dpsConfig: IncidentTypeConfiguration
}): string {
  const outputPath = path.resolve(__dirname, `../../../server/reportConfiguration/types/${dpsConfig.incidentType}.ts`)
  const outputFile = fs.openSync(outputPath, 'w')

  fs.writeSync(outputFile, `// Generated with ${scriptName} at ${new Date().toISOString()}\n\n`)

  // Import type
  fs.writeSync(
    outputFile,
    // eslint-disable-next-line quotes
    `import { type IncidentTypeConfiguration } from '../../data/incidentTypeConfiguration/types'\n\n`,
  )

  // Declare incident type configuration constant
  fs.writeSync(
    outputFile,
    `const ${dpsConfig.incidentType}: IncidentTypeConfiguration = ${JSON.stringify(dpsConfig, null, 2)} as const\n\n`,
  )

  // Export as default
  fs.writeSync(outputFile, `export default ${dpsConfig.incidentType}\n`)

  fs.closeSync(outputFile)

  // Make TypeScript file pretty
  spawnSync('npx', ['prettier', '--write', outputPath], { encoding: 'utf8' })

  return outputPath
}

export function saveAsGraphviz(config: IncidentTypeConfiguration): string {
  const dir = path.resolve(__dirname, '../../../server/reportConfiguration/types')
  const graphvizPath = path.resolve(dir, `${config.incidentType}.dot`)
  const svgPath = path.resolve(dir, `${config.incidentType}.svg`)

  const graphviz = toGraphviz(config)
  fs.writeFileSync(graphvizPath, graphviz)

  // Converts to SVG using graphviz's dot command
  spawnSync('dot', ['-T', 'svg', '-o', svgPath, graphvizPath])

  return graphvizPath
}

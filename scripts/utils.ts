import fs from 'node:fs'
import path from 'node:path'

import { parse as parseYaml } from 'yaml'

/** Print text to standard error followed by a new line */
export function printText(text?: string): void {
  process.stderr.write(`${text ?? ''}\n`)
}

/** Makes text green if standard error is a TTY */
export function green(text: string): string {
  if (process.stderr.isTTY) {
    return `\x1b[32m${text}\x1b[0m`
  }
  return text
}

/** Makes text red if standard error is a TTY */
export function red(text: string): string {
  if (process.stderr.isTTY) {
    return `\x1b[31m${text}\x1b[0m`
  }
  return text
}

export interface HelmEnvironment {
  environment: string
  baseUrl: string
}

export function getHelmEnvironments(): HelmEnvironment[] {
  const helmRootPath = path.resolve(__dirname, '../helm_deploy')

  return fs
    .readdirSync(helmRootPath, { encoding: 'utf8' })
    .filter(p => p.startsWith('values-') && p.endsWith('.yaml'))
    .map(p => {
      const helmValuesPath = path.join(helmRootPath, p)
      const helmValues: { 'generic-service': { ingress: { host: string } } } = parseYaml(
        fs.readFileSync(helmValuesPath, { encoding: 'utf8' }),
      )

      const { environment } = /^values-(?<environment>.*?).yaml$/.exec(p).groups
      const baseUrl = `https://${helmValues['generic-service'].ingress.host}`
      return { environment, baseUrl }
    })
}

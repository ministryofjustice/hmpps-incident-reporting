import fs from 'node:fs'
import path from 'node:path'

import config from './config'

const { buildNumber, gitRef, productId, branchName } = config

export type ApplicationInfo = {
  applicationName: string
  buildNumber: string
  gitRef: string
  gitShortHash: string
  productId?: string
  branchName: string
  packageJsonPath: string
}

export default (): ApplicationInfo => {
  const packageJson = path.join(__dirname, '../../package.json')
  const { name: applicationName } = JSON.parse(fs.readFileSync(packageJson).toString())
  return {
    applicationName,
    buildNumber,
    gitRef,
    gitShortHash: gitRef.substring(0, 7),
    productId,
    branchName,
    get packageJsonPath(): string {
      return findPackageJson()
    },
  }
}

/**
 * The app runs from built JS files under ./dist
 * The tests run directly from TS files under ./
 * This function finds the application root where the package.json file resides
 */
function findPackageJson(): string {
  for (const p of [path.dirname(__dirname), path.dirname(path.dirname(__dirname))]) {
    try {
      fs.accessSync(path.join(p, 'package.json'), fs.constants.R_OK)
      return p
    } catch {
      /* empty */
    }
  }
  throw new Error('Could not find path of package.json')
}

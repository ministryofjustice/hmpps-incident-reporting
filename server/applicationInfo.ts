import fs from 'node:fs'
import path from 'node:path'

import config from './config'

const { buildNumber, gitRef, productId, branchName } = config

export type ApplicationInfo = {
  applicationName: string
  buildNumber: string
  gitRef: string
  gitShortHash: string
  productId: string
  branchName: string
  assetsPath: string
  activeAgencies: string[]
}

export default (): ApplicationInfo => {
  // NB: paths assume app is running from _built_ /dist/ directory
  const packageJson = path.join(__dirname, '../../package.json')
  const assetsPath = path.join(__dirname, '../assets')
  const { name: applicationName } = JSON.parse(fs.readFileSync(packageJson).toString())
  return {
    applicationName,
    buildNumber,
    gitRef,
    gitShortHash: gitRef.substring(0, 7),
    productId,
    branchName,
    assetsPath,
    activeAgencies: config.activePrisons,
  }
}

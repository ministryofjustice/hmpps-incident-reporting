import express, { type Router } from 'express'

import type { ApplicationInfo } from '../applicationInfo'
import config from '../config'
import healthcheck from '../services/healthCheck'

export default function setUpHealthChecks(applicationInfo: ApplicationInfo): Router {
  const router = express.Router()

  router.get('/health', (req, res, next): void => {
    healthcheck(applicationInfo, result => {
      if (result.status !== 'UP') {
        res.status(503)
      }
      res.json(result)
    })
  })

  router.get('/ping', (req, res): void => {
    res.send({
      status: 'UP',
    })
  })

  router.get('/info', (req, res): void => {
    res.json({
      git: {
        branch: applicationInfo.branchName,
      },
      build: {
        artifact: applicationInfo.applicationName,
        version: applicationInfo.buildNumber,
        name: applicationInfo.applicationName,
      },
      productId: applicationInfo.productId,
      activeAgencies: config.activePrisons,
    })
  })

  return router
}

import { RequestHandler } from 'express'
import type { Services } from '../services'
import asyncMiddleware from './asyncMiddleware'

export default function setSystemToken(services: Services): RequestHandler {
  const { hmppsAuthClient } = services

  return asyncMiddleware(async (req, res, next) => {
    const { username } = res.locals.user
    const systemToken = await hmppsAuthClient.getSystemClientToken(username)

    res.locals.systemToken = systemToken

    next()
  })
}

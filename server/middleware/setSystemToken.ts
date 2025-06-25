import type { RequestHandler } from 'express'

import type { Services } from '../services'

export default function setSystemToken(services: Services): RequestHandler {
  const { hmppsAuthClient } = services

  return async (req, res, next) => {
    const { username } = res.locals.user
    const systemToken = await hmppsAuthClient.getToken(username)

    res.locals.systemToken = systemToken

    next()
  }
}

import { randomUUID } from 'node:crypto'

import { RedisStore } from 'connect-redis'
import express, { type Router } from 'express'
import session, { MemoryStore, type Store } from 'express-session'

import config from '../config'
import logger from '../../logger'
import { createRedisClient } from '../data/redisClient'

export default function setUpWebSession(): Router {
  let store: Store
  if (config.redis.enabled) {
    const client = createRedisClient()
    client.connect().catch((err: Error) => logger.error('Error connecting to Redis', err))
    store = new RedisStore({ client })
  } else {
    store = new MemoryStore()
  }

  const router = express.Router()
  router.use(
    session({
      store,
      name: 'hmpps-incident-reporting.session',
      cookie: { secure: config.https, sameSite: 'lax', maxAge: config.session.expiryMinutes * 60 * 1000 },
      secret: config.session.secret,
      resave: false, // redis implements touch so shouldn't need this
      saveUninitialized: false,
      rolling: true,
    }),
  )

  // Update a value in the cookie so that the set-cookie will be sent.
  // Only changes every minute so that it's not sent with every request.
  router.use((req, res, next) => {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    next()
  })

  router.use((req, res, next) => {
    const headerName = 'X-Request-Id'
    const oldValue = req.get(headerName)
    const id = oldValue === undefined ? randomUUID() : oldValue

    res.set(headerName, id)
    req.id = id

    next()
  })

  return router
}

import crypto from 'node:crypto'

import express, { type Router, type Request, type Response, type NextFunction } from 'express'
import helmet from 'helmet'

import config from '../config'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  router.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
    next()
  })

  const authHost = new URL(config.apis.hmppsAuth.externalUrl).hostname
  const dpsHost = new URL(config.dpsUrl).hostname
  const frontendComponentsHost = new URL(config.apis.frontendComponents.url).hostname

  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            frontendComponentsHost,
            (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
          ],
          styleSrc: [
            "'self'",
            'fonts.googleapis.com',
            frontendComponentsHost,
            (_req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
          ],
          imgSrc: ["'self'", 'data:', frontendComponentsHost],
          fontSrc: ["'self'", 'fonts.gstatic.com', frontendComponentsHost],
          formAction: ["'self'", authHost, dpsHost],
          connectSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: { policy: 'require-corp' },
    }),
  )

  // cf. https://security-guidance.service.justice.gov.uk/implement-security-txt/
  router.get('/.well-known/security.txt', (req, res) =>
    res.redirect(301, 'https://security-guidance.service.justice.gov.uk/.well-known/security.txt'),
  )

  return router
}

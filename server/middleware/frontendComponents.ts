import type { NextFunction, Request, Response } from 'express'

import logger from '../../logger'
import type { Services } from '../services'

export default function frontendComponents({ frontendComponentsClient }: Services) {
  return async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { header, footer, meta } = await frontendComponentsClient.getComponents(
        ['header', 'footer'],
        res.locals.user.token,
      )
      res.locals.feComponents = {
        header: header.html,
        footer: footer.html,
        cssIncludes: [...header.css, ...footer.css],
        jsIncludes: [...header.javascript, ...footer.javascript],
      }
      if (meta?.activeCaseLoad) {
        res.locals.user.activeCaseLoad = meta.activeCaseLoad
        res.locals.user.caseLoads = meta.caseLoads
      }
      next()
    } catch (error) {
      logger.error(error, 'Failed to retrieve frontend components')
      next()
    }
  }
}

import type { NextFunction, Request, Response } from 'express'
import { NotImplemented } from 'http-errors'

import logger from '../../logger'
import ManageUsersApiClient from '../data/manageUsersApiClient'

/**
 * Loads a staff member by username from `req.params.username`
 */
// eslint-disable-next-line import/prefer-default-export
export function populateStaffMember() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username } = req.params
    if (!username) {
      next(new NotImplemented('populateStaffMember() requires req.params.username'))
      return
    }

    try {
      res.locals.staffMember = await new ManageUsersApiClient().getNamedUser(res.locals.systemToken, username)
      next()
    } catch (error) {
      logger.error(error, `Failed to load staff member ${username}`)
      next(error)
    }
  }
}

import { RequestHandler } from 'express'

export default function protectRoute(permission: string): RequestHandler {
  return async (req, res, next) => {
    if (req.canAccess(permission)) {
      return next()
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error(`Forbidden. Missing permission: '${permission}'`)
    error.status = 403

    return next(error)
  }
}

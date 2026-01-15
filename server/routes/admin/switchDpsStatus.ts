import { Router } from 'express'
import { MethodNotAllowed } from 'http-errors'
import logger from '../../../logger'
import { logoutUnless } from '../../middleware/permissions'
import type { GovukErrorSummaryItem } from '../../utils/govukFrontend'

export default function switchDpsStatus(): Router {
  const router = Router({ mergeParams: true })

  router.all(
    '/',
    (req, _res, next) => {
      if (req.method === 'GET' || req.method === 'POST') {
        next()
      } else {
        next(new MethodNotAllowed())
      }
    },
    logoutUnless(permissions => permissions.hasAdminAccess),
    async (req, res) => {
      const { prisonId } = req.params
      const { prisonApi } = res.locals.apis

      const prisonActive = await prisonApi.isPrisonActive(prisonId)

      const errors: GovukErrorSummaryItem[] = []
      if (req.method === 'POST') {
        const { formAction } = req.body ?? {}

        if (formAction === 'activate') {
          try {
            await prisonApi.activatePrison(prisonId)
            req.flash('success', { title: `${prisonId} successfully activated` })
          } catch (error) {
            logger.error(error, `Unable to activate ${prisonId}`, error)
            errors.push({
              text: 'Sorry, there was a problem with your request',
              href: '#formAction',
            })
          }
        }
        if (formAction === 'deactivate') {
          try {
            await prisonApi.deactivatePrison(prisonId)
            req.flash('success', { title: `${prisonId} successfully deactivated` })
          } catch (error) {
            logger.error(error, `Unable to deactivate ${prisonId}`, error)
            errors.push({
              text: 'Sorry, there was a problem with your request',
              href: '#formAction',
            })
          }
        }
        if (errors.length === 0) {
          res.redirect(`/admin/${prisonId}`)
          return
        }
      }

      res.render('pages/admin/switchDpsStatus', {
        errors,
        prisonId,
        prisonActive,
      })
    },
  )

  return router
}

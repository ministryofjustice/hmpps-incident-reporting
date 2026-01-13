import { Router } from 'express'
import { MethodNotAllowed } from 'http-errors'
import logger from '../../../logger'
import type { GovukErrorSummaryItem } from '../../utils/govukFrontend'

export default function switchNomisAccess(): Router {
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
    async (req, res) => {
      const { prisonId } = req.params
      const { prisonApi } = res.locals.apis

      const prisonActive = await prisonApi.isPrisonActive(prisonId)
      const incidentCreationSplash = await prisonApi.checkSplashScreenStatus('OIDINCRS', prisonId)
      const incidentEnquirySplash = await prisonApi.checkSplashScreenStatus('OIIIRSEN', prisonId)

      const incidentCreationBlocked = incidentCreationSplash?.blockAccess || false
      const incidentEnquiryBlocked = incidentEnquirySplash?.blockAccess || false

      const errors: GovukErrorSummaryItem[] = []
      if (req.method === 'POST') {
        const { formAction } = req.body ?? {}

        if (formAction === 'block') {
          if (!incidentCreationBlocked) {
            try {
              await prisonApi.setNomisScreenAccess('OIDINCRS', prisonId, 'true')
            } catch (error) {
              logger.error(error, `Unable to block incident creation NOMIS screen for ${prisonId}`, error)
              errors.push({
                text: 'Sorry, there was a problem with your request for incident creation',
                href: '#formAction',
              })
            }
          }
          if (!incidentEnquiryBlocked) {
            try {
              await prisonApi.setNomisScreenAccess('OIIIRSEN', prisonId, 'true')
            } catch (error) {
              logger.error(error, `Unable to block incident enquiry NOMIS screen for ${prisonId}`, error)
              errors.push({
                text: 'Sorry, there was a problem with your request for incident enquiry',
                href: '#formAction',
              })
            }
          }
        }
        if (formAction === 'unblock') {
          if (incidentCreationBlocked) {
            try {
              await prisonApi.setNomisScreenAccess('OIDINCRS', prisonId, 'false')
            } catch (error) {
              logger.error(error, `Unable to unblock incident creation NOMIS screen for ${prisonId}`, error)
              errors.push({
                text: 'Sorry, there was a problem with your request for incident creation',
                href: '#formAction',
              })
            }
          }
          if (incidentEnquiryBlocked) {
            try {
              await prisonApi.setNomisScreenAccess('OIIIRSEN', prisonId, 'false')
            } catch (error) {
              logger.error(error, `Unable to unblock incident enquiry NOMIS screen for ${prisonId}`, error)
              errors.push({
                text: 'Sorry, there was a problem with your request for incident enquiry',
                href: '#formAction',
              })
            }
          }
        }
        if (errors.length === 0) {
          if (formAction === 'block') {
            req.flash('success', { title: `Successfully blocked NOMIS screens for ${prisonId} ` })
          }
          if (formAction === 'unblock') {
            req.flash('success', { title: `Successfully unblocked NOMIS screens for ${prisonId} ` })
          }
          res.redirect(`/admin/${prisonId}`)
          return
        }
      }

      res.render('pages/admin/switchNomisAccess', {
        errors,
        prisonId,
        prisonActive,
        incidentCreationBlocked,
        incidentEnquiryBlocked,
      })
    },
  )

  return router
}

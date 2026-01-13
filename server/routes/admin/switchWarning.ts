import { Router } from 'express'
import { MethodNotAllowed } from 'http-errors'
import logger from '../../../logger'
import type { GovukErrorSummaryItem } from '../../utils/govukFrontend'

export default function switchWarningScreen(): Router {
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

      const incidentCreationWarningActive = !!incidentCreationSplash
      const incidentEnquiryWarningActive = !!incidentEnquirySplash

      const errors: GovukErrorSummaryItem[] = []
      if (req.method === 'POST') {
        const { formAction } = req.body ?? {}

        if (formAction === 'activate') {
          if (!incidentCreationWarningActive) {
            try {
              await prisonApi.activateSplashScreenWarning('OIDINCRS', prisonId)
            } catch (error) {
              logger.error(error, `Unable to switch on incident creation warning screen for ${prisonId}`, error)
              errors.push({
                text: 'Sorry, there was a problem with your request for incident creation',
                href: '#formAction',
              })
            }
          }
          if (!incidentEnquiryWarningActive) {
            try {
              await prisonApi.activateSplashScreenWarning('OIIIRSEN', prisonId)
            } catch (error) {
              logger.error(error, `Unable to switch on incident enquiry warning screen for ${prisonId}`, error)
              errors.push({
                text: 'Sorry, there was a problem with your request for incident enquiry',
                href: '#formAction',
              })
            }
          }
          if (errors.length === 0) {
            req.flash('success', { title: `Successfully switched on warning screens for ${prisonId} ` })
            res.redirect(`/admin/${prisonId}`)
            return
          }
        }
        if (formAction === 'deactivate') {
          if (incidentCreationWarningActive) {
            try {
              await prisonApi.deactivateSplashScreenWarning('OIDINCRS', prisonId)
            } catch (error) {
              logger.error(error, `Unable to switch off incident creation warning screen for ${prisonId}`, error)
              errors.push({
                text: 'Sorry, there was a problem with your request for incident creation',
                href: '#formAction',
              })
            }
          }
          if (incidentEnquiryWarningActive) {
            try {
              await prisonApi.deactivateSplashScreenWarning('OIIIRSEN', prisonId)
            } catch (error) {
              logger.error(error, `Unable to switch off incident enquiry warning screen for ${prisonId}`, error)
              errors.push({
                text: 'Sorry, there was a problem with your request for incident enquiry',
                href: '#formAction',
              })
            }
          }
          if (errors.length === 0) {
            req.flash('success', { title: `Successfully switched off warning screens for ${prisonId} ` })
            res.redirect(`/admin/${prisonId}`)
            return
          }
        }
      }
      res.render('pages/admin/switchWarning', {
        errors,
        prisonId,
        prisonActive,
        incidentCreationWarningActive,
        incidentEnquiryWarningActive,
      })
    },
  )

  return router
}

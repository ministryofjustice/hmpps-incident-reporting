import { Router } from 'express'

export default function prisonServiceConfiguration(): Router {
  const router = Router({ mergeParams: true })

  router.get('/', async (req, res) => {
    const { prisonId } = req.params
    const { prisonApi } = res.locals.apis

    // Check if prison is active in DPS
    const prisonActive = await prisonApi.isPrisonActive(prisonId)

    // Get splash screen conditions to check if warning screens are active and if NOMIS screens are blocked
    const incidentCreationSplash = await prisonApi.checkSplashScreenStatus('OIDINCRS', prisonId)
    const incidentEnquirySplash = await prisonApi.checkSplashScreenStatus('OIIIRSEN', prisonId)

    // If splash condition exists, warning screen is active
    const incidentCreationWarningActive = !!incidentCreationSplash
    const incidentEnquiryWarningActive = !!incidentEnquirySplash
    // Check within splash condition for if NOMIS screen is blocked. If splash does not exist, screen is not blocked
    const incidentCreationBlocked = incidentCreationSplash?.blockAccess || false
    const incidentEnquiryBlocked = incidentEnquirySplash?.blockAccess || false

    // Gather notification banner entries if they exist
    const banners = req.flash()
    res.render('pages/admin/index', {
      prisonId,
      prisonActive,
      incidentCreationWarningActive,
      incidentEnquiryWarningActive,
      incidentCreationBlocked,
      incidentEnquiryBlocked,
      banners,
    })
  })

  return router
}

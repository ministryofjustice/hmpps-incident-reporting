import { Router } from 'express'

export default function prisonServiceConfiguration(): Router {
  const router = Router({ mergeParams: true })

  router.get('/', async (req, res) => {
    const { prisonId } = req.params
    res.render('pages/admin/index', { prisonId })
  })

  return router
}

import { Router } from 'express'

export default function switchPrisonStatus(): Router {
  const router = Router({ mergeParams: true })

  router.get('/', async (req, res) => {
    const { prisonId } = req.params
    res.render('pages/admin/switchStatus/index', { prisonId })
  })

  return router
}

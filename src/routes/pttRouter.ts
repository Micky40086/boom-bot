import { Router, Request, Response } from 'express'

const router: Router = Router()

router.get('/publish', async (_req: Request, res: Response) => {
  res.sendStatus(200)
})

export default router

import { Router, Request, Response } from 'express'

const router: Router = Router()

router.get('/', (_req: Request, res: Response) => {
  res.json({ status: 200 })
})

export default router

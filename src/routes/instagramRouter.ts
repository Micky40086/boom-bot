import { Router, Request, Response } from 'express'
import { runInstagram } from '../api/instagram/crawler'

const router: Router = Router()

router.get('/publish', (_req: Request, res: Response) => {
  runInstagram()
  res.sendStatus(200)
})

export default router

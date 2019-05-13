import { Router, Request, Response } from 'express'
import { runPtt } from '../api/ptt/crawler'

const router: Router = Router()

router.get('/publish', (_req: Request, res: Response) => {
  runPtt()
  res.sendStatus(200)
})

export default router

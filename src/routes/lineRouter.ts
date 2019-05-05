import { handleEvent } from '../api/line/callback'
import * as Line from '@line/bot-sdk'
import { Request, Response, Router } from 'express'

const router: Router = Router()

router.post('/', (req: Request, res: Response) => {
  req.body.events.forEach((event: Line.WebhookEvent) => {
    handleEvent(event)
  })
  res.sendStatus(200)
})

export default router

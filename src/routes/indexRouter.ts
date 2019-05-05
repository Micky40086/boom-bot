import { Router, Request, Response } from 'express'
import { query } from '../../db/mysql'

const router: Router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const values = [['Bomi'], ['Haru']]
  const result = await query('INSERT users(name) VALUES ?', values)
  res.status(200).send(result)
})

export default router

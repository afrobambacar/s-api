import { Router } from 'express'
import { create, count } from './controller'

const router = new Router()

router.post('/', create)
router.get('/count', count)

export default router

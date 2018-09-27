import { Router } from 'express'
import { create, getUser } from './controller'

const router = new Router()

router.post('/', create)
router.get('/:id', getUser)

export default router

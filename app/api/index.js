import { Router } from 'express'
import users from 'api/users'

const router = new Router()

router.use('/users', users)

export default router
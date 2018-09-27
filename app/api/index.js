import { Router } from 'express'
import users from 'api/users'
import email from 'api/email'
import likes from 'api/likes'

const router = new Router()

router.use('/users', users)
router.use('/email', email)
router.use('/likes', likes)

router.get('/', (req, res) => {
  res.jsend.success({ hello: 'world' })
})

router.all('/*', (req, res) => {
  res.status(404).end()
})

export default router

import errorHandler from 'errorhandler'
import { Router } from 'express'
import api from 'api'
import email from 'controllers/email'
import likes from 'controllers/likes'


export default {
  set: app => {
    app.use(api)
    
    const router = Router({})

    /* email for landing */
    router.post('/email', email.create)

    /* likes for landing */
    router.post('/likes', likes.create)
    router.get('/likes/count', likes.count)

    router.get('/', (req, res) => {
      res.jsend.success({ hello: 'world' })
    })

    app.use(router)

    // All undefined asset or api routes should return a 404
    app.all('/*', (req, res) => {
      res.status(404).end()
    })

    // Error handler - has to be last
    app.use(errorHandler())
  }
}

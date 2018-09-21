import errorHandler from 'errorhandler'
import { Router } from 'express'

import email from 'controllers/email'
import likes from 'controllers/likes'
import kitty from 'controllers/kitty'

export default {
  set: app => {
    const router = Router({})

    /* email */
    router.post('/email', email.create)

    /* likes */
    router.post('/likes', likes.create)
    router.get('/likes/count', likes.count)

    /* kitty test */
    router.post('/kitty', kitty.createKitty)
    router.get('/kitty/:id', kitty.getKitty)

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

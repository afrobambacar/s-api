import errorHandler from 'errorhandler';
import { Router } from 'express';
import kitty from 'controllers/kitty';

export default {
  set: app => {
    const router = Router({});

    router.post('/kitty', kitty.createKitty);
    router.get('/kitty/:id', kitty.getKitty);

    router.get('/', (req, res) => {
      res.jsend.success({ hello: 'world' });
    });

    app.use(router);

    // All undefined asset or api routes should return a 404
    app.all('/*', (req, res) => {
      res.status(404).end();
    });

    // Error handler - has to be last
    app.use(errorHandler());
  },
};

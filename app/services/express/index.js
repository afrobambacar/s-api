import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import jsend from 'jsend'
import { env } from 'config'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import errorHandler from 'errorhandler'

export default (apiRoot, routes) => {
  const app = express()

  // app.set('tmp', `${root}/tmp`);
  // app.set('views',`${root}/app/views`);
  // app.set('view engine', 'pug');

  /* istanbul ignore next */
  if (env === 'production' || env === 'development') {
    app.use(cors())
    app.use(compression())
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(cookieParser());
  app.use(jsend.middleware);
  app.use(apiRoot, routes)
  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())
  app.use(errorHandler)

  return app
}

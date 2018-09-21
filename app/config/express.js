import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import jsend from 'jsend';
import cookieParser from 'cookie-parser';
import config from 'config/environment';

module.exports = function(app) {
  const env = app.get('env');
  
  app.set('tmp', `${config.root}/tmp`);
  app.set('views',`${config.root}/app/views`);
  app.set('view engine', 'pug');
  app.use(compression());
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(jsend.middleware);
  
  if (env === 'production') {
    app.use(morgan('dev'));
  }

  if (env === 'development' || env === 'test') {
    app.use(morgan('dev'));
  }
};
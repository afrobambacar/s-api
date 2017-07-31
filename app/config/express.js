'use strict';

var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var config = require('./environment');
var passport = require('passport');

module.exports = function(app) {
  var env = app.get('env');
  
  app.set('tmp', config.root + '/tmp');
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'pug');
  app.use(compression());
  // app.use(bodyParser.urlencoded({ extended: false }));
  // app.use(bodyParser.json());
  // file size 제한
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  
  if ('production' === env) {
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
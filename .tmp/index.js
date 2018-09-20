'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('app-module-path/register');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const env = process.env.NODE_ENV;

if (env === 'development' || env === 'test') {}

exports['default'] = { app: _app2['default'] };
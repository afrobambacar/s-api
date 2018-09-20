// require('babel-polyfill');
import 'app-module-path/register';
import app from './app';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const env = process.env.NODE_ENV;

if (env === 'development' || env === 'test') {
  // Register the Babel require hook
  // require('babel-core/register');
}

// Export the application
export default { app };
// exports = module.exports = require('./app');

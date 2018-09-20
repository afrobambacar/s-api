'use strict';

const auth = require('./controllers/auth');
const accounts = require('./controllers/accounts');
const users = require('./controllers/users');

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.status(200).json({
      status: 'success',
      data: {
        message: 'api.wouzoo.com'
      }
    });
  });
};
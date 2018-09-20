'use strict';

var _ = require('lodash');

function ErrorException(message, code) {
  this.message = message || 'no message';
  this.code = code || 500;
}

module.exports = {
  exception: function (message, code) {
    throw new ErrorException(message, code);
  },
  handleError: function (res, statusCode) {
    return function (err) {
      console.log('handleError: ', err);
      statusCode = err.code || 500;
      res.status(statusCode).json({
        status: 'error',
        error: err
      });
    };
  },
  validationError: function (res, statusCode) {
    statusCode = statusCode || 422;
    return function (err) {
      res.status(statusCode).json({
        status: 'error',
        error: err
      });
    };
  },
  validate: function (res, error, statusCode) {
    statusCode = statusCode || 422;
    return res.status(statusCode).json({
      status: 'error',
      error: error
    });
  }
};
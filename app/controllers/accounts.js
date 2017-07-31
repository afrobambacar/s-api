'use strict';

const config = require('../config/environment');
const auth = require('./auth');
const User = require('../models/user');
const $ = require('../utils');
const _ = require('lodash');

/**
 * Creates a new user
 * 
 * POST /accounts/create
 * - name (string): required
 * - email (string): required
 * - password (string): required
 */
exports.create = function (req, res, next) {
  let newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save()
    .then(function (user) {
      req.user = user || {};
      next();
    })
    .catch($.handleError(res));
};

/**
 * Update my information
 * 
 * POST /users/me/update
 * - name (string): optional
 * - email (string): optional
 * - phone (string): optional
 * - provider (string): optional
 * - emailNotify (boolean): optional
 * - smsNotify (boolean): optional
 * - role (string): optional - user | admin
 * 
 */
exports.updateSettings = function (req, res, next) {
  let userId = req.user._id;
  let body = req.body;
  let promise = User.findById(userId).exec();
  promise.then(function (user) {
    _.extend(user, body);
    return user.save();
  }).then(function (user) {
    return User.findById(user._id).select('-salt -password').exec();
  }).then(function (user) {
    return res.status(200).json({
      status: 'success',
      data: user
    });
  })
  .catch($.handleError(res));
};

/**
 * Change a users password
 * 
 * POST /users/me/update_password
 * - oldPassword (string): required
 * - newPassword (string): required
 */
exports.changePassword = function(req, res, next) {
  let userId = req.user._id;
  let oldPass = String(req.body.oldPassword);
  let newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return $.validate(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * GET /accounts/verify_email
 * - email (required)
 */
exports.verifyEmail = function (req, res, next) {
  let email = req.query.email;
  
  if (!email) {
    return res.status(200).json({
      status: 'error',
      data: {
        message: 'email is required'
      }
    });
  }

  User.findOne({ email: email }, function (err, user) {
    if (err) $.handleError(res);
    if (!user) {
      return res.status(200).json({
        status: 'success',
        data: {
          in_use: false 
        }
      });
    }
    if (user) {
      return res.status(200).json({
        status: 'success',
        data: {
          in_use: true
        }
      });
    }
  });
};
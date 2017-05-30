'use strict';

var User = require('../models/user');
var config = require('../config/environment');
var auth = require('./auth');
var jwt = require('jsonwebtoken');
var sharp = require('sharp');
var crypto = require('crypto');
var AWS = require('aws-sdk');
var fs = require('fs');
var $ = require('../utils');
var _ = require('lodash');
AWS.config.update({
  accessKeyId: config.aws.accessKeyId, 
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
  setPromisesDependency: null
});
var s3 = new AWS.S3();

/**
 * Get list of users
 *
 * GET /users
 * - start (string): optional
 * - count (string): optional
 */
exports.index = function (req, res) {
  var items = [];
  var start = parseInt(req.query.start) || 0;
  var count = parseInt(req.query.count) || 10;
  var promise = User.find({}, '-salt -password')
    .sort({_id: -1})
    .skip(start)
    .limit(count)
    .exec();

  promise.then(function (users) {
    items = users;
    return User.count({}).exec();
  }).then(function (total) {
    return res.status(200).json({
      status: 'success',
      data: {
        items: items,
        start: start,
        count: count,
        total: total
      }
    });
  })
  .catch($.handleError(res));
};

/**
 * GET /users/me
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  // var userId = req.query.userId;
  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(function (user) {
      if (!user) return $.exception('no user', 204);
      return res.status(200).json({
        status: 'success',
        data: user.me
      });
    })
    .catch($.handleError(res));
};

/**
 * GET /users/profile/:id
 * 
 * Get a single user
 */
exports.profile = function (req, res, next) {
  var id = req.params.id;
  var promise = User.findById(id).
    select('-salt -password').
    exec();

  promise.then(function (user) {
    if (!user) return $.exception('user was not found', 404);
    return res.status(200).json({
      status: 'success',
      data: user
    });
  })
  .catch($.handleError(res));
};

function resize (params) {
  var versions = [200, 100, 50];
  var tasks = versions.map(function (version) {
    return new Promise(function (resolve, reject) {
      sharp(params.Body)
        .resize(version, version)
        .jpeg()
        .quality(95)
        .toBuffer(function (err, buffer, info) {
          if (err) {
            reject(err);
          } else {
            resolve({
              Bucket: params.Bucket,
              Key: [params.Key.replace('__path', version), info.format].join('.'),
              Body: buffer,
              ContentEncoding: 'base64',
              ContentType: 'image/jpeg'          
            });
          }
        });
    });
  });
  return Promise.all(tasks);
}

function putObject (params) {
  var tasks = params.map(function (param) {
    return new Promise(function (resolve, reject) {
      s3.putObject(param, function (err, data) {
        if (err) { 
          reject(err);
        } else {
          resolve(data);
        }
      })
    });  
  });
  return Promise.all(tasks);
}

/**
 * POST /users/profile_image/update
 * - image (required)
 * 1. 이미지를 받는다.
 * 2. 이미지를 리사이즈 한다. -> 100x100
 * 3. 이미지를 s3에 업로드 한다.
 * 4. users 데이터베이스에 업데이트 한다. (?) (true, false만 하자.)
 */
exports.updateProfileImage = function (req, res) {
  var userId = req.user._id;
  var image = req.body.image;
  var bucket = config.aws.s3Bucket;
  var profileImageKeyPrefix = 'images/profile/__path';
  var body = new Buffer(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  var hash = crypto.createHash('md5').update(body).digest('hex');
  var key = [profileImageKeyPrefix, hash].join('/');
  var params = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };

  Promise.resolve(params)
    .then(resize)
    .then(putObject)
    .then(function (data) {
      if (!data) throw $.exception('image doesn\'t save!', 500);
      return User.findById(userId).exec();
    }).then(function (user) {
      if (!user) throw $.exception('user not found', 404);
      _.extend(user, { profile_image: hash });
      return user.save();
    }).then(function (user) {
      return res.status(200).json({
        status: 'success',
        data: user.profile
      });
    }).then(null, function (err) {
      console.log(err);
      throw $.exception('Something went wrong.', 500);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

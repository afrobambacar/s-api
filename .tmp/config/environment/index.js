'use strict';

const path = require('path');
const _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

let all = {
  env: process.env.NODE_ENV,

  root: path.normalize(__dirname + '/../../..'),

  port: process.env.PORT || 9090,

  ip: process.env.IP || '0.0.0.0',

  secrets: {
    session: 'secret'
  },

  userRoles: ['guest', 'user', 'admin'],

  mongo: {},

  facebook: {
    clientID: process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  aws: {
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    s3Bucket: ''
  }
};

module.exports = _.merge(all, require('./' + process.env.NODE_ENV + '.js') || {});
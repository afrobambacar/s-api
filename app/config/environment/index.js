import path from 'path';

const all = {
  env: process.env.NODE_ENV || 'development',
  
  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Server port
  port: process.env.PORT || 9090,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'secret',
  },

  // MongoDB connection options
  mongo: {},

  facebook: {
    clientID:     process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  aws: {
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    s3Bucket: '',
  },
};

export default {
  ...all,
  ...(require(`./${process.env.NODE_ENV}.js`) || {}),
};
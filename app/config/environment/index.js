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
  mongo: {
    uri: 'mongodb://172.21.0.3:27017/api-dev',
    options: {
      useNewUrlParser: true,
      autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    }
  },

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
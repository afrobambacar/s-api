import path from 'path'
import merge from 'lodash/merge'

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.normalize(`${__dirname}/../../..`),
    port: process.env.PORT || 9090,
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '',
    secrets: {
      session: 'secret',
    },
    // You have to find docker ip to connect mongodb.
    // Type below command.
    // `docker inspect --format="{{.NetworkSettings.Networks.compose_default.IPAddress}}" mongo`
    mongo: {
      uri: 'mongodb://172.21.0.2:27017/api-dev',
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
      callbackURL: `${(process.env.DOMAIN || '')}/auth/facebook/callback`
    },
    aws: {
      accessKeyId: '',
      secretAccessKey: '',
      region: '',
      s3Bucket: '',
    },
  },
  test: {
    env: 'test',
    port: 9999,
    mongo: {
      uri: 'mongodb://127.0.0.1:27017/api-dev',
    }
  },
  development: {},
  production: {}
}

module.exports = merge(config.all, config[config.all.env])

export default module.exports
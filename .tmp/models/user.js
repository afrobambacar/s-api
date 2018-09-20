'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');
const crypto = require('crypto');
const config = require('../config/environment');
const authTypes = ['github', 'twitter', 'facebook', 'google'];
mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  name: { type: String, 'default': '' },
  email: { type: String, lowercase: true, 'default': '' },
  profile_image: { type: String, 'default': null },
  bio: { type: String, 'default': '' },
  role: { type: String, 'default': 'user' },
  password: String,
  provider: String,
  salt: String,
  facebook: {},
  created_at: { type: Date, 'default': Date.now }
});

UserSchema.virtual('me').get(function () {
  return {
    '_id': this._id,
    'name': this.name,
    'email': this.email,
    'bio': this.bio,
    'pictures': this.getProfileImageUrls()
  };
});

UserSchema.virtual('profile').get(function () {
  return {
    '_id': this._id,
    'name': this.name,
    'email': this.email,
    'bio': this.bio,
    'pictures': this.getProfileImageUrls()
  };
});

UserSchema.virtual('token').get(function () {
  return {
    '_id': this._id,
    'role': this.role
  };
});

UserSchema.path('name').validate(function (name) {
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('password').validate(function (password) {
  if (authTypes.indexOf(this.provider) !== -1) {
    return true;
  }
  return password.length;
}, 'Password cannot be blank');

UserSchema.path('email').validate(function (value, respond) {
  var self = this;
  return this.constructor.findOne({ email: value }).exec().then(function (user) {
    if (user) {
      if (self.id === user.id) {
        return respond(true);
      }
      return respond(false);
    }
    return respond(true);
  })['catch'](err => {
    throw err;
  });
}, 'The specified email address is already in use.');

const validatePresenceOf = function (value) {
  return value && value.length;
};

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
    return next(new Error('Invalid password'));
  }

  this.makeSalt((saltErr, salt) => {
    if (saltErr) {
      return next(saltErr);
    }
    this.salt = salt;
    this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
      if (encryptErr) {
        return next(encryptErr);
      }
      this.password = hashedPassword;
      next();
    });
  });
});

UserSchema.methods = {
  getProfileImageUrls() {
    let host = '//' + config.aws.s3Bucket;
    let path = '/images/profile';
    let basePath = host + path;
    let images = [];
    let file;

    if (!this.profile_image) {
      file = 'bfb3c11b8c1e5ff3a28b80ac5993acd7.jpeg';
    } else {
      file = this.profile_image + '.jpeg';
    }

    _.each([50, 100, 200], function (size) {
      images.push({
        width: size,
        height: size,
        url: [basePath, size, file].join('/')
      });
    });

    return images;
  },

  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  },

  makeSalt(byteSize, callback) {
    const defaultByteSize = 16;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    if (!callback) {
      return crypto.randomBytes(byteSize).toString('base64');
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        callback(err);
      } else {
        callback(null, salt.toString('base64'));
      }
    });
  },

  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      return null;
    }

    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength).toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
      if (err) {
        callback(err);
      } else {
        callback(null, key.toString('base64'));
      }
    });
  }
};

module.exports = mongoose.model('User', UserSchema);
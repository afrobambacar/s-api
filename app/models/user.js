import mongoose, { Shcema } from 'mongoose'
import _ from 'lodash'
import crypto from 'crypto'
import { env } from 'config'

const authTypes = ['github', 'twitter', 'facebook', 'google'];

const UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, lowercase: true, default: '' },
  profileImage: { type: String, default: null },
  bio: { type: String, default: '' },
  role: { type: String, default: 'user' },
  password: String,
  provider: String,
  salt: String,
  facebook: {},
  created: { type : Date, default : Date.now }
});

/**
 * Virtuals
 */

UserSchema
  .virtual('me')
  .get(function () {
    return {
      '_id': this._id,
      'name': this.name,
      'email': this.email,
      'bio': this.bio,
      'pictures': this.getProfileImageUrls()
    };
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    return {
      '_id': this._id,
      'name': this.name,
      'email': this.email,
      'bio': this.bio,
      'pictures': this.getProfileImageUrls()
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      '_id': this._id,
      'role': this.role
    };
  });


/**
 * Validations
 * return true is pass, false is not.
 */
UserSchema
  .path('name')
  .validate(function (name) {
    // console.log(`mongoose error object is ${mongoose.Error.ValidationError}`);
    return name.length;
  }, 'Name cannot be blank');

UserSchema
  .path('email')
  .validate(function (email) {
    return email.length;
  }, 'Email cannot be blank');

// UserSchema
//   .path('phone')
//   .validate(function (phone) {
//     return phone.length;
//   }, 'Phone number cannot be blank');

UserSchema
  .path('password')
  .validate(function (password) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function (value, respond) {
    var self = this;
    return this.constructor.findOne({ email: value }).exec()
      .then(function (user) {
        if (user) {
          if (self.id === user.id) {
            return respond(true);
          }
          return respond(false);
        }
        return respond(true);
      })
      .catch((err) => {
        throw err;
      });
  }, 'The specified email address is already in use.');

const validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
    // Handle new/update passwords
    if (!this.isModified('password')) {
      return next();
    }

    if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
      return next(new Error('Invalid password'));
    }

    // Make salt with a callback
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

/**
 * Methods
 */
UserSchema.methods = {
  getProfileImageUrls () {
    let host = '//' + env.aws.s3Bucket;
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
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate (password, callback) {
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

  /**
   * Make salt
   *
   * @param {Number} byteSize Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt (byteSize, callback) {
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

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword (password, callback) {
    if (!password || !this.salt) {
      return null;
    }

    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                   .toString('base64');
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

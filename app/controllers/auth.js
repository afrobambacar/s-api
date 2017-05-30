'use strict';

const config = require('../config/environment');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const compose = require('composable-middleware');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const validateJwt = expressJwt({	
	secret: config.secrets.session,
	requestProperty: 'user'
	// credentialsRequired: false 
});
const $ = require('../utils');
const User = require('../models/user');
const Token = require('../models/token');
const TOKENTIME = 60 * 60 * 2;

passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function (email, password, done) {
			let promise = User.findOne({ email: email.toLowerCase() }).exec();

			promise.then(function (user) {
				if (!user) {
					return done(null, false, { 
						status: 'error', 
						message: 'This email is not registered.' 
					});	
				}

				if (!user.authenticate(password)) {
					return done(null, false, { 
						status: 'error',
						message: 'This password is not correct.' 
					});
				}

				return done(null, user);
			})
			.catch(new Error('invalid user'));
		}));


function signToken (id, clientId) {
  return jwt.sign({ 
    _id: id,
    clientId: clientId 
  }, config.secrets.session, { 
    expiresIn: TOKENTIME
  });
}

exports.isAuthenticated = function () {
  return compose()
    .use(function(req, res, next) {
    	// 토큰 암복호화일 뿐임. user._id는 데이터베이스를 통해 확인하는 것이 아니라,
    	// 그저 _id와 clientId를 암호화 했을 뿐임.
      validateJwt(req, res, next);
    })
    .use(function(err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        return res.status(err.status).json({
          status: 'error',
          data: err
        });
      }

      // 여기까지는 안오는데?
      console.log('check_point_1');
      User.findById(req.user._id, function (err, user) {
      	console.log('check_point_2');
        if (err) return next(err);
        if (!user) return res.status(401).send('Unauthorized');

        req.user = user;
        next();
      });
    });
}

/**
 * POST /account/login/facebook
 * - id (string): required
 * - name (string): required
 * - email (string): required
 */
exports.facebook = function (req, res, next) {
  let id = req.body.id || '';
  let name = req.body.name;
  let email = req.body.email;
  let promise = User.findOne({ 'facebook.id': id }).exec();
  
  promise.then(function (user) {
  	if (!user) {
  		user = new User({
  			name: name,
  			email: email,
  			provider: 'facebook',
  			facebook: {
  				id: id,
  				name: name,
  				email: email
  			}
  		});
  		return user.save();
  	}
  	return user;
  }).then(function (user) {
  	req.user = user || {};
    next();
  })
  .catch($.handleError(res));
};

exports.serializeUser = function (req, res, next) {
	passport.authenticate('local', {
		session: false,
		scope: []
	}, function (err, user, info) {
		if (err) return res.status(401).json(err);
		if (!user) return res.status(404).json(info);

		req.user = user;
		next();
	})(req, res, next);
};

exports.serializeClient = function (req, res, next) {
	let token = new Token({ user: req.user._id });
	token.save()
		.then(function (client) {
			req.user.client_id = client._id;
			next();
		})
		.catch($.handleError(res));
};

/**
 * refresh_token required
 */
exports.validateRefreshToken = function (req, res, next) {
	if (!req.body.refresh_token) {
		return next(new Error('invalid token'));
	}

	let promise = Token.findOne({ refresh_token: req.body.refresh_token }).exec();
	promise.then(function (client) {
		req.user = req.user || {};
		req.user._id = client.user;
		req.user.client_id = client._id;
		next();
	})
	.catch($.handleError(res));
};

exports.generateAccessToken = function (req, res, next) {
	req.token = req.token || {};
	req.token.access_token = signToken(req.user._id, req.user.client_id);

	next();
};

exports.generateRefreshToken = function (req, res, next) {
	let refreshToken = req.user.client_id.toString() + '.' + crypto.randomBytes(10).toString('hex');

	Token.findByIdAndUpdate(req.user.client_id, {
		refresh_token: refreshToken
	}, {
		new: true
	}, function (err, data) {
		if (err) res.status(500).json(err);
		req.token.refresh_token = data.refresh_token;
		next();		
	});
};

/**
 * POST /auth/reject
 * 
 * - refresh_token required
 */
exports.rejectToken = function (req, res, next) {
	Token.remove({
		refresh_token: req.body.refresh_token
	}, function (err, response) {
		if (err) res.status(500).json(err);
		next();
	});
};

exports.respondAuth = function (req, res) {
	return res.status(200).json({
		status: 'success',
		data: {
			access_token: req.token.access_token,
			refresh_token: req.token.refresh_token
		}
	});
};

exports.respondToken = function (req, res) {
	return res.status(200).json({
		status: 'success',
		data: {
			access_token: req.token.access_token,
			refresh_token: req.body.refresh_token
		}
	});
};

exports.respondReject = function (req, res) {
	return res.status(204).end();
};

exports.signToken = signToken;
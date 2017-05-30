/**
 * oauth 2.0 strategy
 * 
 * ref. 
 * https://blog.hyphe.me/token-based-authentication-with-node/
 * https://blog.hyphe.me/using-refresh-tokens-for-permanent-user-sessions-in-node/
 */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
mongoose.Promise = global.Promise;

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refresh_token: { type: String },
  created_at: { type : Date, default : Date.now }
});

module.exports = mongoose.model('Token', TokenSchema);
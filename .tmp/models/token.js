

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
mongoose.Promise = global.Promise;

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refresh_token: { type: String },
  created_at: { type: Date, 'default': Date.now }
});

module.exports = mongoose.model('Token', TokenSchema);
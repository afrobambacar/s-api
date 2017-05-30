'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');
mongoose.Promise = global.Promise;

var PageSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  active: { type: Boolean, default: true },
  created_at: { type : Date, default : Date.now }
});

module.exports = mongoose.model('Page', PageSchema);
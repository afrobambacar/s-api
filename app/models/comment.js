'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const CommentSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  quote: { type: Schema.Types.ObjectId, ref: 'Quote' },
  comment: { type: String, default: '' },
  created_at: { type : Date, default : Date.now }
});

CommentSchema
	.virtual('withProfile')
	.get(function () {
		return _.defaults({
			from: this.from.profile
		}, this._doc);
	});

module.exports = mongoose.model('Comment', CommentSchema);
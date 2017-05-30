'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const QuoteSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	project: { type: Schema.Types.ObjectId, ref: 'Project' },
	cost: { type: Number, default: 0 },
	content: { type: String, default: '' },
	picked: { type: Boolean, default: false },
	created_at: { type : Date, default : Date.now }
});

QuoteSchema
	.virtual('withProfile')
	.get(function () {
		return _.defaults({
			user: this.user.profile
		}, this._doc);
	});

module.exports = mongoose.model('Quote', QuoteSchema);
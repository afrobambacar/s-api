'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const ProjectSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	content: [],
	category: { type: String, default: '' },
	zipcode: { type: Number },
	visible: { type: Boolean, default: true },
	active: { type: Boolean, default: true },
	quotes: [{
		quote: { type: Schema.Types.ObjectId, ref: 'Quote' },
		user: { type: Schema.Types.ObjectId, ref: 'User' },
		created_at: { type: Date, default: Date.now }
	}],
	created_at: { type : Date, default : Date.now }
});

ProjectSchema
	.virtual('withProfile')
	.get(function () {
		return _.defaults({
			user: this.user.profile
		}, this._doc)
	});
/** 
 * visible value decides if project shows on the list or not.
 * 
 * writing message should always avaliable.
 * so if someone has picked a quote, writing message can available.
 * they have to know each other's contact information.
 */

module.exports = mongoose.model('Project', ProjectSchema);
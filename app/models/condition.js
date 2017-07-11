'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const ConditionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  conditions: [{
    category: { type: String, default: '' },
    zipcode: { type: Number }
  }]
});

module.exports = mongoose.model('Condition', ConditionSchema);
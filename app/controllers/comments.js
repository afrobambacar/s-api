'use strict';

const $ = require('../utils');
const _ = require('lodash');
const Comment = require('../models/comment');

/**
 * POST /comments/create
 * - id: quote (*)
 * - content (*)
 */
function create (req, res) {
	let userId = req.user._id;
	let quote = req.body.quote;
	let content = req.body.comment;
	let comment = new Comment({
		from: userId,
		quote: quote,
		comment: content
	});

	comment.save().then(function (comment) {
		var options = {
			path: 'from',
			select: '-password -salt'
		};
		return Comment.populate(comment, options);
	}).then(function (comment) {
		return res.status(200).json({
			status: 'success',
			data: comment.withProfile
		});
	}).catch($.handleError(res));
};

/**
 * GET /comments/quote/:id
 * - id: quote (*)
 * - start
 * - count
 */
function comments (req, res) {
	let items = [];
	let start = parseInt(req.query.start, 10) || 0;
	let count = parseInt(req.query.count, 10) || 10;
	let conditions = { 'quote': req.params.id };
	let promise = Comment.find(conditions)
		.populate('from', '-password -salt')
		.sort({ _id: -1 })
		.skip(start)
		.limit(count)
		.exec();
	
	promise.then(function (comments) {
		_.each(comments, function (comment) {
			items.push(comment.withProfile);
		});
		return Comment.count(conditions).exec();
	}).then(function (total) {
		return res.status(200).json({
			status: 'success',
			data: {
				items: items,
				start: start,
				count: count,
				total: total
			}
		});
	}).catch($.handleError(res));
};

/**
 * GET /comments/sent
 * - from
 * - start
 * - count
 */
function sent (req, res) {
	// var userId = req.query.from;
	var userId = req.user._id;
	var items = [];
	var start = parseInt(req.query.start, 10) || 0;
	var count = parseInt(req.query.count, 10) || 10;
	var conditions = { from: userId };
	var promise = Comment.find(conditions)
		.populate('from to', '-password -salt')
		.sort({ _id: -1 })
		.skip(start)
		.limit(count)
		.exec();
	promise.then(function (comments) {
		items = comments;
		return Comment.count(conditions).exec();
	}).then(function (total) {
		return res.status(200).json({
			status: 'success',
			data: {
				items: items,
				start: start,
				count: count,
				total: total
			}
		});
	}).catch($.handleError(res));
};

/**
 * GET /comments/:id
 */
function comment (req, res) {
	var _id = req.params.id;
	var conditions = { _id: _id };
	var promise = Message.findOne(conditions)
		.populate('from to', '-password -salt')
		.exec();
	promise.then(function (message) {
		if (!message) return $.exception('No content', 204);
		return res.status(200).json({
			status: 'success',
			data: message
		});
	}).catch($.handleError(res));
};

exports.create = create;
exports.comments = comments;
// exports.sent = sent;
// exports.comment = comment;
'use strict';

const _ = require('lodash');
const $ = require('../utils');
const Project = require('../models/project');
const Quote = require('../models/quote');

/**
 * POST /quotes/create
 * - project: required
 * - cost: required
 * - content: required
 */
function create (req, res) {
	let doc;
	let userId = req.user._id;
	let data = req.body;
	_.extend(data, { user: userId });
	let quote = new Quote(data);

	quote.save()
		.then(function (quote) {
			doc = quote;
			return Project.findById(quote.project).exec();
		})
		.then(function (project) {
			let subDoc = {
				quote: doc._id,
				user: userId
			};
			project.quotes.push(subDoc);
			project.save();
			return res.status(200).json({
				status: 'success',
				data: doc
			});
		})
		.catch($.handleError(res));
}

/**
 * POST /quotes/pick
 * - id: quote's id (*)
 */
function pick (req, res) {
	let doc;
	let id = req.body.id;
	let promise = Quote.findById(id).exec();

	promise.then(function (quote) {
		quote.picked = true;
		return quote.save();
	}).then(function (quote) {
		let projectId = quote.project;
		doc = quote;
		return Project.findById(projectId).exec();
	}).then(function (project) {
		project.visible = false;
		project.save();
		return res.status(200).json({
			status: 'success',
			data: doc
		})
	}).catch($.handleError(res));
}

/**
 * GET /quotes/my
 * - start (optional)
 * - count (optional)
 */
function my (req, res) {
	let items = [];
	let userId = req.user._id;
	let condition = { user: userId };
	let start = parseInt(req.query.start, 10) || 0;
	let count = parseInt(req.query.count, 10) || 10;
	let promise = Quote.find(condition)
		.populate('project')
		.sort({ created_at: -1 })
		.skip(start)
		.limit(count)
		.exec();

	promise.then(function (quotes) {
		items = quotes;
		return Quote.count(condition).exec();
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
}

/** 
 * GET /quotes/my/:id
 * - id: quote_id
 */
function myQuote (req, res) {
	let userId = req.user._id;
	let id = req.params.id;
	let condition = { _id: id, user: userId };
	let promise = Quote.findOne(condition)
		.populate('project')
		.exec();

	promise.then(function (quote) {
		return res.status(200).json({
			status: 'success',
			data: quote
		});
	}).catch($.handleError(res));
}

/**
 * GET /quotes/:id
 * - id: quote_id
 */
function detail (req, res) {
	let userId = req.user._id;
	let id = req.params.id;
	let promise = Quote.findById(id)
		.populate('user')
		.populate('project', 'user')
		.exec();

	promise.then(function (quote) {
		if (quote.project.user.toString() !== userId) {
			return $.exception('permission denied', 401);
		}
		return res.status(200).json({
			status: 'success',
			data: quote.withProfile
		});
	}).catch($.handleError(res));
}

exports.create = create;
exports.my = my;
exports.myQuote = myQuote;
exports.detail = detail;
exports.pick = pick;
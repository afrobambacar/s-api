'use strict';

var $ = require('../utils');
var _ = require('lodash');
var Page = require('../models/page');

/**
 * Get my pages
 *
 * GET /pages/me
 * - start
 * - count
 */
exports.index = function (req, res) {
	// var admin = req.query.admin;
	// var admin = req.user._id;
	var items = [];
	var start = parseInt(req.query.start) || 0;
	var count = parseInt(req.query.count) || 10;	
	var conditions = {
		admin: req.user._id,
		active: true
	};
	var promise = Page.find(conditions)
		.populate('admin', '-password -salt')
		.sort({ '_id': -1 })
		.skip(start)
		.limit(count)
		.exec();
	
	promise.then(function (pages) {
		items = pages;
		return Page.count(conditions).exec();
	}).then(function (total) {
		res.status(200).json({
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
 * Get a single page
 * 
 * GET /pages/:id
 */
exports.page = function (req, res) {
	var _id = req.params.id;
	var promise = Page.findById(_id)
		.populate('admin', '-password -salt')
		.exec()

	promise.then(function (page) {
		if (!page) return $.exception('page doesn\'t exist', 404);
		return res.status(200).json({
			status: 'success',
			data: page
		});
	}).catch($.handleError(res));
};

/**
 * Create page
 *
 * POST /pages/create
 * - title
 * - content
 */
exports.create = function (req, res) {
	var page = new Page({
		admin: req.user._id,
		title: req.body.title,
		content: req.body.content
	});

	page.save().then(function (page) {
		var options = {
			path: 'admin',
			select: '-password -salt'
		};
		return Page.populate(page, options);
	}).then(function (page) {
		return res.status(200).json({
			status: 'success',
			data: page
		});
	}).catch($.handleError(res));
};

/**
 * Update a page
 * 
 * POST /pages/update
 * - id
 * - title
 * - content
 * - active
 */
exports.update = function (req, res) {
	var conditions = {
		_id: req.body.id,
		admin: req.user._id
	};
	var promise = Page.findById(conditions).exec();
	promise.then(function (page) {
		if (!page) return $.exception('page doesn\'t exist', 404);
		_.extend(page, req.body);
		return page.save();
	}).then(function (page) {
		var options = {
			path: 'admin',
			select: '-password -salt'
		};
		return Page.populate(page, options);
	}).then(function (page) {
		return res.status(200).json({
			status: 'success',
			data: page
		});
	}).catch($.handleError(res));	
};
'use strict';

const Project = require('../models/project');
const Quote = require('../models/quote');
const $ = require('../utils');
const _ = require('lodash');

/**
 * POST /projects/create
 */
function create (req, res) {
  let category = 'Web Development';
  let userId = req.user._id;
  let content = req.body.data;
  let project = new Project({
    category: category,
    user: userId,
    content: content
  });
  project.save()
    .then(function (project) {
      let options = {
        path: 'user',
        select: '-password -salt'
      };
      return Project.populate(project, options);
    })
    .then(function (project) {
      return res.status(200).json({
        status: 'success',
        data: project
      });
    })
    .catch($.handleError(res));
}

/**
 * GET /projects/my
 */
function my (req, res) {
  let items = [];
  let userId = req.user._id;
  let condition = { user: userId };
  let start = parseInt(req.query.start, 10) || 0;
  let count = parseInt(req.query.count, 10) || 10;
  let promise = Project.find(condition)
    .populate('user', '-password -salt')
    .populate('quotes.user')
    .sort({ _id: -1 })
    .skip(start)
    .limit(count)
    .exec();
  
  promise.then(function (projects) {
    items = projects;
    return Project.count(condition).exec();
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
 * GET /projects/:id
 * - id: project's id (*)
 */
function detail (req, res) {
  let doc;
  let id = req.params.id;
  let promise = Project.findById(id)
    .populate('quotes.quote')
    .populate('quotes.user')
    .exec();
  
  promise.then(function (project) {
    return res.status(200).json({
      status: 'success',
      data: project
    });
  })
  .catch($.handleError(res));
}

/**
 * POST /projects/inactive
 * - id: project's id (*)
 */
function inactive (req, res) {
  let userId = req.user._id;
  let id = req.body.id;
  let promise = Project.findById(id).exec();

  promise.then(function (project) {
    if (userId !== project.user.toString()) {
      return $.exception('permission denied', 401);
    }
    project.visible = false;
    project.active = false;
    return project.save();
  })
  .then(function (project) {
    return res.status(200).json({
      status: 'success',
      data: project
    });
  })
  .catch($.handleError(res));
}

/**
 * GET /project/:id/quotes
 */
function quotes (req, res) {
  let items = [];
  let id = req.params.id;
  let start = parseInt(req.query.start, 10) || 0;
  let count = parseInt(req.query.count, 10) || 10;
  let condition = { project: id };
  let promise = Quote.find(condition)
    .populate('user', '-password -salt')
    .sort({ _id: -1 })
    .skip(start)
    .limit(count)
    .exec();

  promise.then(function (quotes) {
    _.each(quotes, function (quote) {
      items.push(quote.withProfile);
    });
    return Quote.count(condition).exec();
  })
  .then(function (total) {
    res.status(200).json({
      status: 'success',
      data: {
        items: items,
        start: start,
        count: count,
        total: total
      }
    });
  })
  .catch($.handleError(res));
}

exports.create = create;
exports.my = my;
exports.detail = detail;
exports.inactive = inactive;
exports.quotes = quotes;
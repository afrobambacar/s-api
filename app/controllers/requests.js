'use strict';

const _ = require('lodash');
const Project = require('../models/project');
const $ = require('../utils');

function me (req, res) {
  let items = [];
  let userId = req.user._id;
  let condition = { active: true };
  let start = parseInt(req.query.start, 10) || 0;
  let count = parseInt(req.query.count, 10) || 10;
  let promise = Project.find(condition)
    .populate('user', '-password -salt')
    .sort({ _id: -1 })
    .skip(start)
    .limit(count)
    .exec();
  
  promise.then(function (projects) {
    _.each(projects, function (project) {
      items.push(project.withProfile);
    });
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

exports.me = me;
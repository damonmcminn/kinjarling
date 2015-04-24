'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _groups = require('parse-config');

var _express = require('express');

var _express2 = _interopRequireWildcard(_express);

var _json = require('body-parser');

var _io = require('./io');

var _io2 = _interopRequireWildcard(_io);

function log(data) {
  console.log(JSON.stringify(data));
}

var api = _express2['default']();

exports['default'] = api;

api.use(_json.json());
api.post('/:group', function (req, res) {
  var group = req.params.group;

  var data = req.body;

  var token = req.headers.token;

  // check token; payload includes providerId, exp
  // check if group matches allowed groups

  var deny = !token || _groups.groups.indexOf(group) === -1;

  if (deny) return res.sendStatus(403);
  log({ timestamp: new Date(), event: 'API call', group: group, data: data });

  _io2['default'].to(group).emit('broadcast', data);
  res.sendStatus(200);
});
module.exports = exports['default'];
//# sourceMappingURL=api.js.map
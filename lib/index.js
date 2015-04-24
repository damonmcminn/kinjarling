'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _install = require('source-map-support');

var _socketIO = require('socket.io');

var _socketIO2 = _interopRequireWildcard(_socketIO);

var _path$groups = require('parse-config');

var _express = require('express');

var _express2 = _interopRequireWildcard(_express);

var _json = require('body-parser');

_install.install();

function log(data) {
  console.log(JSON.stringify(data));
}

var api = _express2['default']();

var io = _socketIO2['default']({ path: _path$groups.path });

exports['default'] = { io: io, api: api };

api.use(_json.json());
api.post('/:group', function (req, res) {
  var group = req.params.group;

  var data = req.body;

  var token = req.headers.token;

  // check token; payload includes providerId, exp
  // check if group matches allowed groups

  var deny = !token || _path$groups.groups.indexOf(group) === -1;

  if (deny) return res.sendStatus(403);
  log({ timestamp: new Date(), event: 'API call', group: group, data: data });

  io.to(group).emit('broadcast', data);
  res.sendStatus(200);
});

io.on('connection', function (socket) {
  var _socket$handshake$query = socket.handshake.query;
  var user = _socket$handshake$query.user;
  var group = _socket$handshake$query.group;

  log({ timestamp: new Date(), event: 'Client connection', user: user, group: group });
  socket.join(group);

  socket.on('broadcast', function (data) {
    log({ timestamp: new Date(), event: 'Client broadcast', group: group, data: data, user: user });
    io.to(group).emit('broadcast', data);
  });
});

io.set('authorization', function (handshake, callback) {
  var _handshake$_query = handshake._query;
  var group = _handshake$_query.group;
  var user = _handshake$_query.user;

  var deny = _path$groups.groups.indexOf(group) === -1;

  if (deny) {
    log({ timestamp: new Date(), event: 'DENY', group: group, user: user });
    callback(new Error('DENY'));
  } else {
    callback(null, true);
  }
});
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
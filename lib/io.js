'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _socketIO = require('socket.io');

var _socketIO2 = _interopRequireWildcard(_socketIO);

var _path$groups = require('parse-config');

function log(data) {
  console.log(JSON.stringify(data));
}

var io = _socketIO2['default']({ path: _path$groups.path });

exports['default'] = io;

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
//# sourceMappingURL=io.js.map
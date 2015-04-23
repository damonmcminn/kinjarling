'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _install = require('source-map-support');

var _socketIO = require('socket.io');

var _socketIO2 = _interopRequireWildcard(_socketIO);

var _path$groups = require('parse-config');

_install.install();

var io = _socketIO2['default']({ path: _path$groups.path });

exports['default'] = io;

io.on('connection', function (socket) {
  var _socket$handshake$query = socket.handshake.query;
  var client = _socket$handshake$query.client;
  var group = _socket$handshake$query.group;

  socket.join(group);

  socket.on('broadcast', function (data) {
    io.to(group).emit('broadcast', data);
  });
});

io.set('authorization', function (handshake, callback) {
  var group = handshake._query.group;

  var deny = _path$groups.groups.indexOf(group) === -1;

  if (deny) {
    callback(new Error('DENY'));
  } else {
    callback(null, true);
  }
});
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _socketIO = require('socket.io');

var _socketIO2 = _interopRequireWildcard(_socketIO);

var io = _socketIO2['default']();

exports['default'] = io;

io.on('connection', function (socket) {

  console.log(socket.request.url);
  console.log(socket.handshake.query);

  var _socket$request$url = socket.request.url;
  var client = _socket$request$url.client;
  var group = _socket$request$url.group;

  socket.join(group);

  socket.on(function (data) {
    console.log(data);
  });
});

//io.to(group).emit('updateCal', req.params);

/* Authenticate client and join them to the room associated to their client_id */

// middleware
//io.use(function(socket, next) {
/* socket.request._query holds query data
 * https://github.com/Automattic/engine.io/pull/245
 * Official response is params should be parsed from socket.request.url
 * Alternative is to use socket.handshake.query
 * https://github.com/Automattic/socket.io/issues/1612
 * Someone else's issues and solutions for migrating to 1.0
 * http://blog.seafuj.com/migrating-to-socketio-1-0
 */
module.exports = exports['default'];
//# sourceMappingURL=app.js.map
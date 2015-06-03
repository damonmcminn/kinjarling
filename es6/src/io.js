import SocketIO from 'socket.io';
import {Client} from './db';
import http from 'http';
import _ from 'lodash';
import {path, origins} from '../config';

// wrap websocket server in httpServer instance
const server = http.createServer((req, res) => {
  res.end();
});
const io = new SocketIO(server, {
  path,
  serveClient: false,
  transports: ['websocket'],
  origins
});

// client ids -> socket ids; for private messaging etc
const clients = {};

function validateGroup(group) {
  return _.includes(this._groups, group);
}

io.on('connection', socket => {
  let {group} = socket.handshake.query;

  socket.join(group);

  socket.on('broadcast', data => {
    io.to(group).emit('broadcast', data);
  });

  socket.on('private', event => {
    io.to(event.receiver).emit('private', event.message);
  });

});

io.use(function(socket, next) {

  let {group, user} = socket.handshake.query;

  Client.findOne({_id: user, groups: group}, (err, client) => {
    if (err || !client) {
      next(err || new Error('DENY'));
    } else {

      // add client to hashmap, going to grow large fast
      // need to prune when clients disconnect (or are idle for long time?)
      clients[user] = {socketId: socket.id, timestamp: new Date()};

      // attach allowed groups to socket and provide validation method
      socket._groups = client.groups;
      socket.validateGroup = validateGroup;
      next();
    }

  });

});

export default {server, io};

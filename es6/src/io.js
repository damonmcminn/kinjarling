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

function validateGroup(group) {
  return _.includes(this._groups, group);
}

io.on('connection', socket => {
  let {group} = socket.handshake.query;

  socket.join(group);

  socket.on('broadcast', data => {
    io.to(group).emit('broadcast', data);
  });

});

io.use(function(socket, next) {


  let {group, user} = socket.handshake.query;

  Client.findOne({_id: user, groups: group}, (err, client) => {
    if (err || !client) {
      // give socket enough time to receive DENY, then disconnect
      // io.nsps['/'] shows clients, rooms etc
      setTimeout(function() {
        socket.disconnect();
      }, 200);
      next(err || new Error('DENY'));
    } else {
      // attach allowed groups to socket and provide validation method
      socket._groups = client.groups;
      socket.validateGroup = validateGroup;
      next();
    }

  });

});

export default {server, io};

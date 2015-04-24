import socketIO from 'socket.io';
import {path, groups} from 'parse-config';

function log(data) {
  console.log(JSON.stringify(data));
}

const io = socketIO({path});

export default io;

io.on('connection', socket => {
  let {user, group} = socket.handshake.query
  
  log({timestamp: new Date(), event: 'Client connection', user, group})
  socket.join(group);

  socket.on('broadcast', data => {
    log({timestamp: new Date(), event: 'Client broadcast', group, data, user})
    io.to(group).emit('broadcast', data);
  });

});

io.set('authorization', (handshake, callback) => {

  let {group, user} = handshake._query;

  let deny = groups.indexOf(group) === -1;

  if (deny) {
    log({timestamp: new Date(), event: 'DENY', group, user})
    callback(new Error('DENY'));
  } else {
    callback(null, true);
  }

});

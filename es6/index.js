import {install} from 'source-map-support';
install();

import socketIO from 'socket.io';
import {path, groups} from 'parse-config';
import express from 'express';
import {json} from 'body-parser';

function log(data) {
  console.log(JSON.stringify(data));
}

const api = express();

const io = socketIO({path});

export default {io, api}

api.use(json());
api.post('/:group', (req, res) => {

  let {group} = req.params;
  let data = req.body;

  let {token} = req.headers;
  // check token; payload includes providerId, exp
  // check if group matches allowed groups

  let deny = (!token || groups.indexOf(group) === -1);

  if (deny) return res.sendStatus(403);
  log({timestamp: new Date(), event: 'API call', group, data})

  io.to(group).emit('broadcast', data);
  res.sendStatus(200);

});

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

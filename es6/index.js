import {install} from 'source-map-support';
install();

import socketIO from 'socket.io';
import {path, groups} from 'parse-config';
import express from 'express';
import {json} from 'body-parser';

const api = express();

const io = socketIO({path});

export default {io, api}

api.use(json());
api.post('/:group', (req, res) => {

  let {group} = req.params;
  let data = req.body;

  console.log(group, data);

  let deny = groups.indexOf(group) === -1;

  if (deny) return res.sendStatus(403);

  io.to(group).emit('broadcast', data);
  res.sendStatus(200);

});

io.on('connection', socket => {
  let {client, group} = socket.handshake.query
  
  socket.join(group);

  socket.on('broadcast', data => {
    io.to(group).emit('broadcast', data);
  });

});


io.set('authorization', (handshake, callback) => {

  let {group} = handshake._query;

  let deny = groups.indexOf(group) === -1;

  if (deny) {
    callback(new Error('DENY'));
  } else {
    callback(null, true);
  }

});

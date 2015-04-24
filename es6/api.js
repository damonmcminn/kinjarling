import {groups} from 'parse-config';
import express from 'express';
import {json} from 'body-parser';
import io from './io';

function log(data) {
  console.log(JSON.stringify(data));
}

const api = express();

export default api;

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

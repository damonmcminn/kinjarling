import {io} from '../io';
import _ from 'lodash';

function broadcast(req, res) {
  let {group} = req.params;
  let event = req.body || {};

  if (_.includes(this.groups, group)) {
    io.to(group).emit('broadcast', {name: event.name, data: event.data});
    return res.sendStatus(200);
  } else {
    return res.status(404).json({message: 'Group not found'});
  }
}

export default broadcast;

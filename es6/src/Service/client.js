import {Client} from '../db';
import generateId from './generateId';
import _ from 'lodash';
import deleted from './deleted';

function ClientFactory() {}

ClientFactory.prototype = {
  create (req, res) {
    let client = new Client(_.assign({_id: generateId(), service: req.service.id}, req.body));
    client.save((err, doc) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.json({client: doc._id});
      }
    });
  },

  remove (req, res) {
    Client.remove({_id: req.params.id}, (err, done) => {
      if (err) {
        return res.status(400).json(err);
      }

      let {status, response} = deleted(req.params.id, done.result.ok);

      return res.status(status).json(response);
    });
  }
};

export default ClientFactory;

import {Client} from '../db';
import generateId from './generateId';
import _ from 'lodash';

function ClientFactory() {}

ClientFactory.prototype = {
  create (req, res) {
    let client = new Client(_.assign({_id: generateId()}, req.body));
    client.save((err, doc) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.json({client: doc._id});
      }
    });
  },

  remove (req, res) {
    Client.remove({_id: req.params.id}, (err, doc) => {
      let status = err ? 400 : 200;
      res.status(status).json(err || doc.result);
    });
  }
};

export default ClientFactory;

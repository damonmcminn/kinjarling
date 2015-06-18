import {Client} from '../db';
import generateId from './generateId';
import _ from 'lodash';
import deleted from './deleted';

function ClientFactory() {}

ClientFactory.prototype = {
  create (req, res) {
    // check group is in req.service.groups()
    let client = new Client(_.assign({
      _id: generateId(),
      service: req.service.id,
      secret: generateId(24)
    }, req.body));
    client.save((err, doc) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.json({client: doc._id, secret: doc.secret});
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
  },

  update (req, res) {
    let secret = generateId(24);
    Client.update({_id: req.params.id}, {$set: {secret: secret}}, (err) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json({
          client: req.params.id,
          secret: secret
        });
      }
    });
  }

};

export default ClientFactory;

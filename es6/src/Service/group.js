import {Service} from '../db';
import generateId from './generateId';
import deleted from './deleted';

function Group(id) {
  this.id = id;
}

Group.prototype = {
  create (req, res) {
    let group = generateId();
    Service.findByIdAndUpdate(
      this.id,
      {$addToSet: {groups: group}},
      {new: true}
    )
    .exec((err) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.json({group});
      }
    });
  },

  remove(req, res) {
    Service.update({_id: this.id}, {$pull: {groups: req.params.id}}, (err, result) => {

      if (err) {
        return res.status(400).json(err);
      }

      let {status, response} = deleted(req.params.id, result.nModified);

      return res.status(status).json(response);

    });
  }
};

export default Group;

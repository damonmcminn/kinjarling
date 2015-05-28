import {Service} from '../db';
import generateId from './generateId';

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
      let status = err ? 400 : 200;
      res.status(status).json(err || result);
    });
  }
};

export default Group;

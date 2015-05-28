

function Collection(Model, req, data, callback) {

  return {

    _Model: Model,
    create () {
      // URL safe base64: necessary as id's are used as path identifiers
      data._id = randomBytes(12).toString('base64').replace('+', '-').replace('/', '_');
      // seems a little circular?
      data.service = req.service.id;
      Model(data).save(callback);
    },

    remove () {
      Model.findOneAndRemove({_id: req.params.id}, callback);
    }

  };

}

function Client(Model, req, data, callback) {
  let obj = Collection.apply(null, arguments);
  obj.addGroup = function() {
    // is data.groups in req.service.groups ?
    Model.findByIdAndUpdate(req.params.id,
      {$addToSet: {groups: data.groups}},
      {new: true},
      callback
    )
  }
  return obj;
}

export default {
  Collection,
  Client,
}

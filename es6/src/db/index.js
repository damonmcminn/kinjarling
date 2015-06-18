import mongoose from 'mongoose';
import {mongoURI} from '../../config';
const Schema = mongoose.Schema;
const Model = mongoose.model;

const required = {type: String, required: true};

const _connection = mongoose.connect(mongoURI);

const GroupSchema = mongoose.Schema({
  _id: required,
  serviceGroupId: required,
  service: required,
});

const ClientSchema = mongoose.Schema({
  _id: required,
  groups: [String],
  service: required,
  secret: required
});

const ServiceSchema = mongoose.Schema({
  _id: required,
  groups: [String],
  apiKey: String,
});

const Service = mongoose.model('Service', ServiceSchema);
const Group = mongoose.model('Group', GroupSchema);
const Client = mongoose.model('Client', ClientSchema);

export default {Service, Group, Client, _connection};

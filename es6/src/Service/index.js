import Group from './group';
import Client from './client';
import broadcast from './broadcast';

function Service(service) {
  this.id = service._id;
  this.groups = service.groups;

  this.group = new Group(this.id);
  this.client = new Client();
  this.broadcast = broadcast;
}

export default Service;

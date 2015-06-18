import IO from 'socket.io-client';
import {path} from '../config';

function Kinjarling(options) {
  let {clientId, group, events, host, secret} = options;
  this._group = group;

  // default to same domain if no host provided
  this.socket = new IO(host || location.host, {
    path,
    // secret must be passed in query string as is WebSocket, cannot use headers
    query: `group=${group}&clientId=${clientId}&secret=${secret}`,
    transports: ['websocket'],
    multiplex: false
  });

  this.events = events;

  this.socket.on('broadcast', message => {
    let {name, client, data} = message;

    if (this.getSocketId() !== client) {
      // execute mapped function
      this.execute(name, data);
    }
  });
}

Kinjarling.prototype = {
  broadcast (name, data) {
    let message = {name, data, client: this.getSocketId()};
    let validEvent = !!this.events[name];
    let connected = this.isConnected();

    if (validEvent && connected) {
      return this.socket.emit('broadcast', message);
    } else {
      return { validEvent, connected };
    }
  },
  isConnected () {
    return this.socket.connected;
  },
  isSecure () {
    return this.socket.io.engine.secure;
  },
  getSocketId () {
    return this.socket.id;
  },
  getGroup () {
    return this._group;
  },
  execute (name, data) {
    let fn = this.events[name];
    if (fn) {
      fn(data);
    }
  }
};

export default Kinjarling;

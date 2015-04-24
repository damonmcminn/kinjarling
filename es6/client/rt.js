let rt = ((options) => {

  let {user, group, events, uri} = options;

  if (!user || !group) {
    return 'Missing user and/or group';
  }

  if (!uri) {
    uri = 'https://damonmcminn.com/rt';
  }

  let path = /\/\w+$/i.exec(uri).pop();

  let [host] = uri.split(path);

  let socket = io(host, {
    path: `${path}`,
    query: `group=${group}&user=${user}`
  });

  // build hash map of events
  let eventMap = {};
  events.forEach(event => {
    eventMap[event.name] = event.fn;
  });

  socket.on('broadcast', message => {
    let {name, client, data} = message;

    // find the event
    if (socket.id !== client) {
      // execute mapped function
      eventMap[name](data);
    }
  });

  return function(event) {

    let {name, data} = event;

    if (!name) {
      name = event;
    }
    
    let {connected, id} = socket;

    let message = {name, data, client: id};

    let validEvent = eventMap[name];

    if (validEvent && connected) {
      socket.emit('broadcast', message);
      return `Broadcasted event: ${name}`;
    } else if (!validEvent) {
      return `Invalid event: ${name}`;
    } else {
      return `No connection. Is group '${group}' correct?`;
    }
  }
});

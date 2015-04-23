let rt = ((group, uri, events) => {

  let path = /\/\w+$/i.exec(uri).pop();

  let [host] = uri.split(path);

  let socket = io(host, {
    path: `${path}`,
    query: `group=${group}`
  });

  // build hash map of events
  let eventMap = {};
  events.forEach(event => {
    eventMap[event.name] = event.fn;
  });

  socket.on('broadcast', data => {
    // find the event
    if (socket.id !== data.client) {
      // execute mapped function
      eventMap[data.name]();
    }
  });

  return function(event) {
    
    let {connected} = socket;

    let data = {
      name: event,
      client: socket.id
    };

    let validEvent = eventMap[event];

    if (validEvent && connected) {
      socket.emit('broadcast', data);
      return `Broadcasted event: ${event}`;
    } else if (!validEvent) {
      return `Invalid event: ${event}`;
    } else {
      return `No connection. Is group '${group}' correct?`;
    }
  }
});

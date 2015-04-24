'use strict';

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var rt = function rt(options) {
  var user = options.user;
  var group = options.group;
  var events = options.events;
  var uri = options.uri;

  if (!user || !group) {
    return 'Missing user and/or group';
  }

  if (!uri) {
    uri = 'https://damonmcminn.com/rt';
  }

  var path = /\/\w+$/i.exec(uri).pop();

  var _uri$split = uri.split(path);

  var _uri$split2 = _slicedToArray(_uri$split, 1);

  var host = _uri$split2[0];

  var socket = io(host, {
    path: '' + path,
    query: 'group=' + group
  });

  // build hash map of events
  var eventMap = {};
  events.forEach(function (event) {
    eventMap[event.name] = event.fn;
  });

  socket.on('broadcast', function (message) {
    var name = message.name;
    var client = message.client;
    var data = message.data;

    // find the event
    if (socket.id !== client) {
      // execute mapped function
      eventMap[name](data);
    }
  });

  return function (event) {
    var name = event.name;
    var data = event.data;

    if (!name) {
      name = event;
    }

    var connected = socket.connected;
    var id = socket.id;

    var message = { name: name, data: data, client: id };

    var validEvent = eventMap[name];

    if (validEvent && connected) {
      socket.emit('broadcast', message);
      return 'Broadcasted event: ' + name;
    } else if (!validEvent) {
      return 'Invalid event: ' + name;
    } else {
      return 'No connection. Is group \'' + group + '\' correct?';
    }
  };
};
//# sourceMappingURL=rt.js.map
'use strict';

var Kinjarling = require('../../es6/client/Kinjarling');
var socketPort = require('../../es6/config').socketPort;
var host = 'localhost:' + socketPort;
// var host = 'api.dev';

describe('Kinjarling', function() {

  var client = new Kinjarling({
    clientId: 'foo',
    group: 'test',
    secret: 'bar',
    host: host,
    events: {
      'foo': function(data) {
        client.received = data;
      }
    }
  });

  it('should instantiate new client objects', function() {
    expect(client.getGroup()).toBe('test');
    setTimeout(function() {
      expect(client.isSecure()).toBe(false);
    }, 200);
  });

  it('should broadcast events', function(done) {
    setTimeout(function() {
      expect(client.broadcast('invalid').validEvent).toBe(false);
      expect(client.broadcast('foo').validEvent).toBeUndefined();
      done();
    }, 1000);

  });

  it('should respond to broadcasted events', function(done) {
    setTimeout(function() {
      client.broadcast('foo', 'bar');
      // act as a different client
      client.socket.id = 'bar';
    }, 500);
    setTimeout(function() {
      expect(client.received).toBe('bar');
      done();
    }, 1000);
  });

});

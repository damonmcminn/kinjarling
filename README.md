## Why Kinjarling?
You want a standalone service to provide authenticated pub/sub for one or more applications.
Supports WebSockets **only**.

Kinjarling has been developed as a pub/sub replacement for polling the database for changes from within a Drupal application. The application has discrete groups with members sharing a single calendar where knowing the up-to-date status of the calendar is critical for avoiding scheduling conflicts.

## What does Kinjarling mean?
Kinjarling is the [Noongar](http://www.noongarculture.org.au/) for place of rain.

## Requirements
- Node.js
- MongoDB
- Python
- pymongo
- Babel

If you wish to run tests, you also need `mocha`.

## Installation
- Install dependencies with `npm install`
- Transpile source with `npm run babel`
- Write minified build to `static/kinjarling.min.js` with `npm run browser-build`. Approx ~67KB, most of which is the `socket.io-client` library.

If you require a `require('able')` -- ah-ha! -- module, you can find a single file at `client/Kinjarling.js` in `es6` or `lib` (once transpiled). Depends upon `socket.io.client` and the path declared in `config`.

## Config
One, many or all options can be overridden by setting a KINJARLING environment variable with JSON.
#### `socketPort: 9100`
- socket server port

#### `apiPort: 9101`
- HTTP API port

#### `path: kinjarling`
- path for routing socket connections
- `npm run browser-build` uses this for appending `path` to `host`

#### `mongoURI: mongodb://localhost:27017/kinjarling`
- MongoDB URI connection string

#### `origins: *:*`
- Allowed origins


## Browser usage
#### Instantiate a client
```javascript
// assumes Kinjarling available in namespace

var client = new Kinjarling({
  user: 'clientId',
  group: 'groupId',
  host: 'host.com', // if undefined, defaults to location.host
  events: {
    foo: function(bar) {
      console.log(bar);
    }
  }
});
```

#### Public methods and properties
#### `#broadcast(name, [data])`
- `name` is event identifier e.g. `client.broadcast('foo', 'bar') // bar`
- `data` is optional e.g. `client.broadcast('foo') // undefined`

#### `#isConnected()`
- returns `true` or `false`

#### `#isSecure()`
- returns `true` or `false`
- relevant only if using WSS from an HTTP application (but not sure why you'd be doing this...)

#### `#getSocketId()`
- returns `String` of `socket.io` session id

#### `#socket`
- the underlying `socket.io` instance

The `client` will only receive events broadcasted to the `group` it has authenticated against and will ignore any events to which it is not subscribed. This allow the server to be agnostic about events and just be a middleman for group broadcasts.

## Deployment
If serving from the same (sub) domain as your application/s you'll need to proxy requests to the socket server e.g. `domain.com/kinjarling => localhost:9100`. Here is my local NGINX setup as an example:

```
upstream socket_server {
    server 127.0.0.1:9100;
}

upstream api_server {
    server 127.0.0.1:9101;
}

server {
  listen 80;
  server_name web.dev;

  location /kinjarling/ {
      proxy_pass http://socket_server;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
  }

  location / {
    proxy_pass http://api_server;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }
}
```

## Command-line tool: `service-manage.sh`
Options
#### `--uri`
- Optional. MongoDB URI connection string (without `mongodb://`). Defaults to `localhost:27017/kinjarling`.

#### `--name`
- Required. The name with which you wish to identify an individual service (i.e. discrete application). Must be unique.

#### `--save` *OR* `--new-key`
- Required. Save a new service or generate a new api key for an existing service.


## Service HTTP API
All routes require header `Authorization: Bearer foobar` where `foobar` is an API key generated by the `service-manager.sh` CLI tool

####`POST /group`
Returns JSON with unique group ID
```javascript
{
  "group": "ItrAKCMehPMHOrhgQ7UzrjJR"
}
```

####`DELETE /group/:id`
Returns JSON with outcome
```javascript
// group exists, 200
{
  "deleted": "ItrAKCMehPMHOrhgQ7UzrjJR"
}

// group does not exist, 404
{
  "id": "not_a_group",
  "message": "Not found"
}
```

####`POST /broadcast/:groupId --data={"name":"foo","data":"any valid JSON data"}`
Returns `200 OK` on success and `404 {"message":"Group not found"}` on failure.
Neither 'name' nor `data` are required (though not supplying an event `name` means the broadcast will "fail" silently).

####`POST /client --data={"groups":["foo"]}`
Returns JSON with unique client ID
Requires `groups` (Array of group ids)

```javascript
{
  "client": "R_0EnjM6di89FTXPBtAL4i7E"
}
```

####`DELETE /client/:id`
```javascript
// client exists, 200
{
  "deleted": "R_0EnjM6di89FTXPBtAL4i7E"
}

// client does not exist, 404
{
  "id": "not_a_client",
  "message": "Not found"
}
```

## Debugging
#### Browser
`Kinjarling#socket` fully exposes the underlying underlying `socket.io` instance.

#### Server
Use environment variable `DEBUG=socket.io*` to get `stdout` logs

## Scaling
Designed for use in an environment where a single server is sufficient. Plan to implement optional use of Redis with [socket.io-redis](https://github.com/Automattic/socket.io-redis)

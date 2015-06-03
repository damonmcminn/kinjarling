### What this application is for
authenticated pub/sub for clients in groups
e.g. an appointment calendar shared across devices
- for use with multiple services i.e. applications
- groups are for isolation within services e.g. the CalendarApplication service has a Customer group. Clients can connect to that group and all will receive the same broadcasts. Finer grained isolation can be achieved with creating more groups e.g. the Customer group requires role based pub/sub for AdminUsers and GeneralUsers; as the group ids are unique these isolate each other. Kinjarling doesn't care whether AdminUsers and GeneralUsers are "sub-groups" of Customer; they are all treated the same server side. Their association with with the CalendarApplication service. Managing sub groups etc is entirely left up to individual applications, Kinjarling just provides cryptographically secure ids.

Private messages to single clients can be achieved by used client.sendPrivate(id, data)

### Prereqs
MongoDB
Node.js (es5?)
Python
pymongo

### Security model
- clients are pre-authed via the server API and provided with unique client and group id's which are required to connect to the Kinjarling server

### Browser
WS protocol matches HTTP protocol by default and won't allow insecure websocket connections from a secure origin.

If, for some reason, you are running your app over HTTP you and wish to force a secure websocket connection, you can use `wss://hostname` otherwise the above stands.

options: user, group, host, events


### Build
##### Server
- Transpile source with `npm run babel`
##### Browser
- Transpile source with `npm run babel`
- Write minified build to `static/kinjarling.min.js` with `npm run browser-build`
If you require a `require('able')` -- ah-ha! -- module, you can find a single file at `client/Kinjarling.js` in `es6` or `lib` (once transpiled). Depends upon 'lodash' and 'socket.io.client' and the path declared in `config`.

### Config
defaults are:

JSON in the KINJARLING environment variable overrides this i.e. either use the defaults or provide them in environment variable KINJARLING.

### Webserver
- Written to be application independent (so can't use from within an existing Node.js app without further development -- sorry!)
- If serving from the same sub/domain as your application/s you'll need to proxy requests to the socket server e.g. `domain.com/kinjarling => localhost:9100`. Here is my local NGINX setup as an example:

### Command-line tool
- Written in Python with a dependency on `pymongo`
- execute `./service-manager.sh`
- `--uri` option to change host, port, db, etc. Defaults to `localhost:27017/kinjarling`
- create new services with --save --name [name]
- create a new API key with --new-key --name [name]

### Scaling
Designed for use on a single server so scaling not yet implemented
Planned: optional Redis

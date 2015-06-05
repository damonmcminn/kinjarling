const ENV = JSON.parse(process.env.KINJARLING || '{}');

export default {
  // port on which to serve websocket server
  socketPort: ENV.socketPort || 9100,
  // port on which to server API server
  apiPort: ENV.apiPort || 9101,
  // arbitrary path where engine.io is served
  // http://socket.io/docs/server-api/#server#path(v:string):server
  path: '/' + (ENV.path || 'kinjarling'),
  mongoURI: ENV.mongoURI || 'mongodb://localhost:27017/kinjarling',
  origins: ENV.origins || '*:*'
};

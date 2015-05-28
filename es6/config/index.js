const DEFAULT_CONFIG = {
  // port on which to serve websocket server
  socketPort: 9100,
  // port on which to server API server
  apiPort: 9101,
  // arbitrary path where engine.io is served
  // http://socket.io/docs/server-api/#server#path(v:string):server
  path: "/kinjarling",
  mongoURI: "mongodb://localhost:27017/kinjarling",
  origins: '*:*'
};

const ENV = process.env.KINJARLING;

export default ENV ? JSON.parse(ENV) : DEFAULT_CONFIG;

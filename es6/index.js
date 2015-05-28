import {install} from 'source-map-support';
install();

import {server} from './src/io';
import api from './src/api';
import {socketPort, apiPort} from './config';

server.listen(socketPort, () => {
  console.log(`WebSocket server listening on ${socketPort}`);
});
api.listen(apiPort, () => {
  console.log(`API server listening on ${apiPort}`);
});

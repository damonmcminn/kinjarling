'use strict';

const server = require('./lib');
const PORT = require('parse-config').socketPort;

server.listen(PORT);

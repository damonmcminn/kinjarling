'use strict';

const rt = require('./lib');

const CONFIG = require('parse-config');
const SOCKET_PORT = CONFIG.socketPort;
const API_PORT = CONFIG.apiPort;


rt.io.listen(SOCKET_PORT);
rt.api.listen(API_PORT);

'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _install = require('source-map-support');

var _io = require('./io');

var _io2 = _interopRequireWildcard(_io);

var _api = require('./api');

var _api2 = _interopRequireWildcard(_api);

var _socketPort$apiPort = require('parse-config');

_install.install();

_io2['default'].listen(_socketPort$apiPort.socketPort);
_api2['default'].listen(_socketPort$apiPort.apiPort);
//# sourceMappingURL=index.js.map
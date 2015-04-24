import {install} from 'source-map-support';
install();

import io from './io';
import api from './api';
import {socketPort, apiPort} from 'parse-config';

io.listen(socketPort);
api.listen(apiPort);

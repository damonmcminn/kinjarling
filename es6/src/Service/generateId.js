import {randomBytes} from 'crypto';

function generateId(len) {
  // URL safe base64: necessary as id's are used as path identifiers
  return randomBytes(len || 18).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

export default generateId;

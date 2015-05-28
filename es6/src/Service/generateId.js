import {randomBytes} from 'crypto';

function generateId() {
  // URL safe base64: necessary as id's are used as path identifiers
  return randomBytes(12).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

export default generateId;

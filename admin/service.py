from pymongo import errors
from os import urandom
from base64 import b64encode

class Service(object):
    def __init__(self, name, db):
        self.name = name
        self.db = db

    def generate_api_key(self):
        # len % 0 == 0 means no trailing =
        # websafe
        return b64encode(urandom(30)).replace('+', '-').replace('/', '_')

    def save(self):
        key = self.generate_api_key()
        try:
            self.db.insert_one({
                '_id': self.name,
                'apiKey': key
            })
            return 'Name: %s\nAPI Key: %s' % (self.name, key)
        except errors.DuplicateKeyError:
            return 'A service already exists with name: %s' % self.name

    def new_api_key(self):
        new_key = self.generate_api_key()
        success = self.db.find_one_and_update(
            {'_id': self.name},
            {'$set': {'apiKey': new_key}})

        if not success:
            return 'Service does not exist: %s' % self.name
        else:
            return 'Name: %s\nAPI Key: %s' % (self.name, new_key)

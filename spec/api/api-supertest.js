/*eslint new-cap: 0 */
'use strict';

var api = require('../../lib/src/api');
var agent = require('supertest').agent(api);
var db = require('../../lib/src/db');
var Service = db.Service;
var auth = {'Authorization': 'Bearer test'};

describe('Server API', function() {

  before('Create test service', function() {
    Service({_id: '___kinjarling_test', apiKey: 'test', groups: ['test']}).save();
  });

  after('Delete test service', function() {
    Service.remove({_id: '___kinjarling_test'}).exec();
  });

  describe('any method, any route', function() {
    it('return 401 Unauthorized if no API key', function(done) {
      agent.get('/client/test')
      .expect(401, done);
    });
  });

  describe('/group', function() {

    var group;

    it('should return a unique group id', function(done) {
      agent.post('/group')
      .set(auth)
      .expect(function(res) {
        group = res.body.group;
      })
      .expect(/"group":/, done);
    });

    it('should remove groups from services', function(done) {
      agent.delete('/group/' + group)
      .set(auth)
      .expect(200, {deleted: group}, done);
    });

    it('should return 404 if group does not exist', function(done) {
      agent.delete('/group/' + 'not_a_group')
      .set(auth)
      .expect(404, {id: 'not_a_group', message: 'Not found'}, done);
    });

  });

  describe('/broadcast', function() {

    it('should return 404 if group/client not found', function(done) {
      agent.post('/broadcast/invalidgroup')
      .set(auth)
      .expect(/Group not found/)
      .expect(404, done);
    });

    it('should return 200 on success', function(done) {
      agent.post('/broadcast/test')
      .set(auth)
      .expect(200, done);
    });

  });

  describe('/client', function() {

    var clientId;
    var secret;

    it('should return a unique client', function(done) {
      agent.post('/client')
      .set(auth)
      .send({groups: ['test']})
      .expect(function(res) {
        clientId = res.body.client;
        secret = res.body.secret;
        if (!res.body.secret) {
          throw new Error('No secret');
        }
      })
      .expect(/client":/, done);
    });

    it('should return 404 if group not found', function(done) {
      agent.post('/client')
      .set(auth)
      .send({groups: ['not a group']})
      .expect(404, done);
    });

    it('should remove clients', function(done) {
      agent.delete('/client/' + clientId)
      .set(auth)
      .expect(200, {deleted: clientId}, done);
    });

    it('should change the client api key', function(done) {
      agent.put('/client/' + clientId)
      .set(auth)
      .expect(function(res) {
        if (!res.body.secret || secret === res.body.secret) {
          throw new Error('secret not changed');
        }
      })
      .end(done);
    });

  });

  // delete group/:id

});

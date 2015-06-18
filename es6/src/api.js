import express from 'express';
import {json} from 'body-parser';
import passport from 'passport';
import auth from './auth';

const api = express();

export default api;

api.use(json());
api.use(passport.authenticate('bearer', {session: false}), auth);

api.post('/broadcast/:group', (req, res) => {
  req.service.broadcast(req, res);
});

api.post('/group', (req, res) => {
  req.service.group.create(req, res);
});

api.delete('/group/:id', (req, res) => {
  req.service.group.remove(req, res);
});

api.post('/client', (req, res) => {
  req.service.client.create(req, res);
});

api.delete('/client/:id', (req, res) => {
  req.service.client.remove(req, res);
});

api.put('/client/:id', (req, res) => {
  req.service.client.update(req, res);
});

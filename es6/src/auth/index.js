import {Service} from '../db';
import ServiceFactory from '../Service';
import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';

passport.use(new BearerStrategy(
  function(key, done) {
    Service.findOne({ apiKey: key }, function (err, service) {
      if (err) { return done(err); }
      if (!service) { return done(null, false); }
      return done(null, service, { scope: 'all' });
    });
  }
));

module.exports = function(req, res, next) {
  req.service = new ServiceFactory(req.user);
  next();
};

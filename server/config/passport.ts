import * as passportJwt from 'passport-jwt';

// load up the user model
import { User } from './../models/User';
import { config } from './database'; // get db config file

export const passwordConfig = (passport: any) => {
  var opts = {} as any;
  opts.jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secret;

  passport.use(new passportJwt.Strategy(opts, function (jwt_payload, done) {

    User.findOne({ id: jwt_payload.id }, (err: any, user: any) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));
};
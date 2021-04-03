"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordConfig = void 0;
const passportJwt = require("passport-jwt");
// load up the user model
const User_1 = require("./../models/User");
const database_1 = require("./database"); // get db config file
exports.passwordConfig = (passport) => {
    var opts = {};
    opts.jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = database_1.config.secret;
    passport.use(new passportJwt.Strategy(opts, function (jwt_payload, done) {
        User_1.User.findOne({ id: jwt_payload.id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            }
            else {
                done(null, false);
            }
        });
    }));
};
//# sourceMappingURL=passport.js.map
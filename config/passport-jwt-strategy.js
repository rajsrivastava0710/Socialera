const passport = require('passport');

const JWTStrategy = require('passport-jwt').Strategy;//importing strategy

const ExtractJWT = require('passport-jwt').ExtractJwt;//importing module to extract jwt from header

const User = require('../models/user');

const env = require('./environment');

var opts = {
	jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey : env.jwt_secret
}

passport.use(new JWTStrategy(opts, function(jwtPayload, done) {
    User.findById(jwtPayload._id, function(err, user) {
        if (err) {
        	console.log(`Error finding user from JWT:${err}`);
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

module.exports = passport;
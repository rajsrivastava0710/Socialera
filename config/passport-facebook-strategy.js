const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;

const crypto = require('crypto');
const User = require('../models/user');


passport.use(new facebookStrategy({
clientID:"xxx",
clientSecret:"xxx",
callbackURL:"http://localhost:8000/users/auth/facebook/callback"

},function(accessToken , refreshToken , profile , done){
	User.findOne({email:profile.emails[0].value}).exec(function(err,user){
		if(err){
			console.log(`Error in passport google ${err}`);
			return;
		}
		console.log(profile);
		console.log(accessToken,refreshToken);
		if(user){
			return done(null,user);
		}else{
			User.create({
				name: profile.displayName,
				email: profile.emails[0].value,
				password: crypto.randomBytes(20).toString('hex'),
				isValid:true
			},function(err,user){
				if(err){
				console.log(`Error in creating user : passport facebook ${err}`);
				return;
				}
				return done(null,user);
			});
		}
	})
}

))

module.exports = passport;
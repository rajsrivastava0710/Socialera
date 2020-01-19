const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


passport.use(new googleStrategy({
clientID:"1008554580419-pooa4o466nmsjuqdqdsvdvcner2910sj.apps.googleusercontent.com",
clientSecret:"fleXEGG9qGluMYrnq28BwdPM",
callbackURL:"http://localhost:8000/users/auth/google/callback"

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
				name: profile.DisplayName,
				email: profile.emails[0].value,
				password: crypto.randomBytes(20).toString('hex')
			},function(err,user){
				if(err){
				console.log(`Error in creating user : passport google ${err}`);
				return;
				}
				return done(null,user);
			});
		}
	})
}

))

module.exports = passport;
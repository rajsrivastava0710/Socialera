const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const newUserMailer = require('../mailers/new_user_mailer');


passport.use(new googleStrategy({
clientID:"1062128411018-28svnet4lk4c3un619klibvv0t2pg3nt.apps.googleusercontent.com",
clientSecret:"IesopoFyMrldK2JpEf8LnZkw",
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
				name: profile.displayName,
				email: profile.emails[0].value,
				password: crypto.randomBytes(20).toString('hex'),
				isValid:true
			},function(err,user){
				if(err){
				console.log(`Error in creating user : passport google ${err}`);
				return;
				}
				newUserMailer.newUser(user);
				return done(null,user);
			});
		}
	})
}

))

module.exports = passport;
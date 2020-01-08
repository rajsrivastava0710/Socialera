const User = require("../models/user");

module.exports.profile = function(req,res){
			return res.render('profile',{
			title:'ProfilePage'
		});
	}
module.exports.login = function(req,res){
	return res.render('login',{
		title:'LoginPage'
	});
}
module.exports.signup = function(req,res){
	return res.render('signup',{
		title:'SignUpPage'
	});
}

// get signup data
module.exports.create = function(req,res){
	
}

// signin and create session for user
module.exports.createSession = function(req,res){
	

}

module.exports.removeSession = function(req,res){
	
}
const User = require("../models/user");

module.exports.profile = function(req,res){
			return res.render('profile',{
			title:'ProfilePage'
		});
	}
module.exports.login = function(req,res){
	if(req.isAuthenticated()){
		return res.redirect('/users/profile');
	}
	return res.render('login',{
		title:'LoginPage'
	});
}
module.exports.signup = function(req,res){
	if(req.isAuthenticated()){
		return res.redirect('/users/profile');
	}
	return res.render('signup',{
		title:'SignUpPage'
	});
}

// get signup data
module.exports.create = function(req,res){
	if(req.body.password != req.body.confirm_password){
		return res.redirect('back');
	}
	User.findOne({email: req.body.email},function(err, user){
		if(err){console.log("Error in finding user in signup"); return;}
		if(!user){
			User.create(req.body,function(err,user){
				if(err){console.log("Error in creating user in signup"); return;}
				return res.redirect('/users/login');
			})
		}else{
			return(res.redirect('back'));
		}
	})
}

// signin and create session for user
module.exports.createSession = function(req,res){
	return res.redirect('/');
}

module.exports.removeSession = function(req,res){
	req.logout();
	return res.redirect('/');
}
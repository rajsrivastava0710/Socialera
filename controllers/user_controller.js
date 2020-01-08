const User = require("../models/user");

module.exports.profile = function(req,res){
	if(req.cookies.user_id){
	User.findById(req.cookies.user_id,function(err,user){
		if(err){console.log('Error in getting the user profile'); return;}
		if(user){
			return res.render('profile',{
			title:'ProfilePage',
			user:user
		});
		}
			return res.redirect('/users/login');
		});
		}else{
		return res.redirect('/users/login');
		}
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
	//Find user
	User.findOne({email:req.body.email},function(err,user){
		if(err){console.log("Error in finding user in login"); return;}
		//user found

		if(user){
			//password mis-match
			if(user.password != req.body.password){
				console.log('Password incorrect')
				return res.redirect('back');
			}

			//session cookie

			res.cookie('user_id',user.id);

			console.log(`User.id= ${user.id}`);
			console.log(`User._id= ${user._id}`);
			console.log('User logged in successfully')

			res.redirect('/users/profile');


		}else{
			//no user found
			console.log('No such user found');
			return res.redirect('back');
		}

	})

}

module.exports.removeSession = function(req,res){
	if(req.cookies.user_id){
		res.clearCookie('user_id');
		return res.redirect('/users/login')
	}
	else{
	return res.redirect('/users/login');
}
}
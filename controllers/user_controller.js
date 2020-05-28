const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Friend = require('../models/friend');
const Reset = require("../models/reset_password");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const newUserMailer = require('../mailers/new_user_mailer');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const deleteUserMailer = require('../mailers/delete_user_mailer');


module.exports.profile = async function(req,res){
	
		let user = await User.findById(req.params.id)
		.populate({
			path: 'friends',
			populate:{
			path: 'from_user',
			}
		})
		.populate({
			path: 'friends',
			populate:{
			path: 'to_user',
			}
		});
		return res.render('profile',{
			title:'Socialera/Profile',
			profile_user: user
		});	
}

module.exports.modify = function(req,res){
	if(req.params.id == req.user.id){
	User.findById(req.params.id,function(err,user){
		return res.render('updateUser',{
			title:'Socialera/Profile/Update',
			profile_user: user
		});
	});	
	}else{
		req.flash('error',"Don't even try dude :p");
		return res.redirect(`/users/profile/${req.params.id}`);
	}
}

module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err) {
                	console.log('Multer Error: ', err);
                	req.flash('error','Oops! Some error encountered while updation!')
                	return res.redirect('back');}
                
                user.email = req.user.email;//this hould never change
                user.password = req.user.password; //this should also not change from here
                //changeable properties
                user.name = req.body.name;
                
               
                console.log(req.body)
                if (req.file){//if user is uploading a file
                		
                	let AVATAR_PATH = path.join(__dirname,'..',user.avatar);
                	let tempPath = User.avatarPath + '/' + req.file.filename;
               		let INAPPROPRIATE_FILE_PATH = path.join(__dirname,'..',tempPath);

                	if(req.file.mimetype.split('/')[0] != 'image' || req.file.size >1024*500 ){

                		//deleting the image that got stored but did not qualify the above rule
                		fs.unlinkSync(INAPPROPRIATE_FILE_PATH);

                		req.flash('error','The selected file is inappropriate..');
                		return res.redirect('back');
                	}

                	// let DEFAULT_AVATAR_PATH = path.join(__dirname,'../uploads/users/default-avatar/avatar.jpg');

                    if ( ! user.defaultPic ){ //if(it had other than default avatar)
                    	if(fs.existsSync(AVATAR_PATH)){ //if(that file exist in avatars folder)
                        	fs.unlinkSync(AVATAR_PATH); //delete old file
                    	}
                    }
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                    user.defaultPic = false;
                }
                user.save();
                console.log(req.file);
				req.flash('success','User Profile Updated Successfully !');
				return res.redirect(`/users/profile/${req.params.id}`);
            });

        }catch(err){
		console.log('error in updation',err);
		req.flash('error','Oops! Some error occured..');
		return res.redirect('back');
	}
	}else{
		req.flash('success','Mr. Hacker , You are unauthorised to perform such stuffs !')
		return res.status(401).send('Unauthorised');
	}
}

module.exports.deleteUser = async function(req,res){
	if(req.user.id == req.params.id){
	try{
		
		let user = await User.findById(req.params.id);
		let user_ = user;

		let AVATAR_PATH = path.join(__dirname,'..',user.avatar);
  		// let DEFAULT_AVATAR_PATH = path.join(__dirname,'../uploads/users/default-avatar/avatar.jpg');

		if ( ! user.defaultPic){  //if it had other than default avatar
        	if(fs.existsSync(AVATAR_PATH)){ //if(that file exist in avatars folder)
            	fs.unlinkSync(AVATAR_PATH); //delete old file
        	}
        }
        

        let posts = await Post.find({user:req.params.id})
        for(post of posts){
        	await Comment.deleteMany({post:post._id});
        }
        await Post.deleteMany({user:req.params.id});

        let comments = await Comment.find({user:req.params.id});
        for(comment of comments){

        await Post.findByIdAndUpdate(comment.post, { $pull: {comments: comment._id}});

        }
        await Comment.deleteMany({user:req.params.id});
        //delete reset password token
        await Reset.findOneAndDelete({user:user.id});

		await User.findByIdAndDelete(req.params.id);

		//Nodemailer Mail

		deleteUserMailer.deleteUser(user);

		//

		req.flash("success","Your Profile has been deleted successfully !");
		return res.redirect('/');
	}catch(err){
		console.log(err);
		req.flash('error','Oops! Error deleting your Profile..');
		return res.redirect('back');
	}
	}else{
		req.flash('success','Mr. Hacker , You are unauthorised to perform such stuffs !')
		return res.status(401).send('Unauthorised');
	}
	
}

module.exports.addFriend = async function(req,res){
	try{

		if(req.params.id == req.user._id){
			req.flash('error','You look to be suffering from multi-identity disorder!');
			return res.redirect('back');
		}
		let addedFriend = false;
		let exist_1 = await Friend.findOne({
			from_user:req.user._id,
			to_user:req.params.id
		});
		let exist_2 = await Friend.findOne({
			to_user:req.user._id,
			from_user:req.params.id
		});

		let user_1 = await User.findById(req.params.id);
			
		let user_2 = await User.findById(req.user._id);

		if(!exist_1 && !exist_2){
			let newFriend = await Friend.create({
				from_user:req.user._id,
				to_user:req.params.id
			});
			user_1.friends.push(newFriend.id);
			user_2.friends.push(newFriend.id);
			user_1.save();
			user_2.save();
			addedFriend = true;
		}else{
			let del_friend = exist_1 || exist_2;
			del_friend.remove();
			user_1.friends.pull(del_friend._id);
			user_2.friends.pull(del_friend._id);
			user_1.save();
			user_2.save();
		}

		return res.status(200).json({
			data:{
				addedFriend : addedFriend
			}
		});
		// return res.redirect('back');

	}catch(err){
		console.log('Error adding friend',err);
		return;
	}
}

module.exports.login = function(req,res){
	if(req.isAuthenticated()){
		return res.redirect(`/users/profile/${req.user.id}`);
	}
	return res.render('login',{
		title:'Login'
	});
}
module.exports.signup = function(req,res){
	if(req.isAuthenticated()){
		return res.redirect(`/users/profile/${req.user.id}`);
	}
	return res.render('signup',{
		title:'SignUp'
	});
}

// get signup data
module.exports.create = function(req,res){
	if(req.body.password != req.body.confirm_password){
		req.flash('error','Passwords do not match!')
		return res.redirect('back');
	}
	User.findOne({email: req.body.email},function(err, user){
		if(err){
			console.log("Error in finding user in signup"); 
			req.flash('error','Oops ! Some error occured..');
			return res.redirect('back');
		}
		if(!user){

			User.create(req.body,function(err,user){
				if(err){
					console.log("Error in creating user in signup"); 
					req.flash('error','Oops ! Some error occured..');
					return res.redirect('back');
				}
				user.activationKey = crypto.randomBytes(10).toString('hex');
				user.save();
				
				//Nodemailer Mail
				newUserMailer.newUser(user);
				//

				req.flash('success','User Signup Successful !');
				console.log(user);
				req.flash('long','We are sending account activation link to your E-Mail Id');		
				return res.redirect('/users/login');
			})
		}else{
			req.flash('error','User with this E-Mail Id already exists!');
			return(res.redirect('back'));
		}
	})
}

// signin and create session for user
module.exports.createSession = function(req,res){
	req.flash('success','Logged in successfully!');
	return res.redirect('/');
}

module.exports.removeSession = function(req,res){
	req.logout();
	res.clearCookie('cookie_1');
	req.flash('success','Logged out successfully..');
	return res.redirect('/');
}

module.exports.confirmAccount = async function(req,res){
	try{
	let user = await User.findOne({activationKey:req.params.id});
	if(user.isValid){
	return res.send('We have already authenticated you!');
	}
	user.isValid=true;
	user.activationKey = crypto.randomBytes(10).toString('hex');
	user.save();//just for future safety purpose -maybe
	req.flash('long','You have been authenticated successfully ! You can login now..')
	return res.redirect('/users/login');

	}catch(err){
		return res.status(403).json({
			message:'This token has expired now!'
		})
		console.log(err);
		return;
	}
}

module.exports.resetPasswordPage = async function(req,res){
	let reset = await Reset.findOne({token:req.params.id});
	console.log(reset)
	if(reset.isValid == true){
		return res.render('resetPassword',{
		resetToken : req.params.id,
		title:'Socialera/Reset Password'
	})
	}else{
		return res.status(403).json({
			message:'Your token has expired'
		})
	}
	
}

module.exports.resetPassword = async function(req,res){
	try{
		let reset = await Reset.findOne({token:req.params.id});
		if(req.body.password == req.body.confirm_password){
			if(reset){
				reset = await reset.populate('user').execPopulate();

				if (reset.isValid) {
					let user = await User.findById(reset.user);
					user.password = req.body.password;
					user.save();
					// await reset.remove();
					reset.isValid = false;
					reset.save();
					req.flash('success','Password Reset done successfully !')
					return res.redirect('/users/login');
				
				}else{
					return res.status(403).json({
					message:'Your token has expired.Generate a new token again'
					})
				}
			
			}else{
				return res.status(403).json({
					message:'Your token does not exist'
				})
			}
		}else{
			// if(reset){
			// 	reset.isValid = false;
			// 	reset.save();
			// }
			return res.send('Passwords do not match !');
		}
	}catch(err){
		console.log('Reset Password Error',err);
		return ;
	}
}


module.exports.resetToken = async function(req,res){
	try{
		let user = await User.findOne({email:req.body.email});
		if(user){
			let reset = await Reset.findOne({user:user.id});
			
			if(!reset){
				await Reset.create({
				token:crypto.randomBytes(10).toString('hex'),
				user:user.id,
				isValid:true
			});
				reset = await Reset.findOne({user:user.id});
			}
			reset.isValid = true;
			reset.save();
			
			
			reset = await reset.populate('user').execPopulate();

			//Nodemailer Mail
			resetPasswordMailer.resetLink(reset);
			//
			
			req.flash('long','We have sent the password reset link to this E-Mail Id !')
			return res.redirect('back');
		}else{
			req.flash('error','This E-Mail Id does not exist in our database');
			return res.redirect('back');
		}
	}catch(err){
		console.log('Reset Token Error',err);
		return ;
	}
}

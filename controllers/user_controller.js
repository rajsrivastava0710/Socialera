const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req,res){
	
		User.findById(req.params.id,function(err,user){
		return res.render('profile',{
			title:'ProfilePage',
			profile_user: user
			});
		});	
}

module.exports.modify = function(req,res){
	if(req.params.id == req.user.id){
	User.findById(req.params.id,function(err,user){
		return res.render('updateUser',{
			title:'UpdateProfilePage',
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
                
                user.name = req.body.name;
                user.email = req.body.email;
               
                if (req.file){//if user is uploading a file

                	if(req.file.mimetype.split('/')[0] != 'image' || req.file.size >1024*200 ){
                		req.flash('error','The seclected file is inappropriate..');
                		return res.redirect('back');
                	}

                	let AVATAR_PATH = path.join(__dirname,'..',user.avatar);
                	let DEFAULT_AVATAR_PATH = path.join(__dirname,'../uploads/users/default-avatar/avatar.jpg');
                    if ( AVATAR_PATH != DEFAULT_AVATAR_PATH ){ //if(it had other than default avatar)
                    	if(fs.existsSync(AVATAR_PATH)){ //if(that file exist in avatars folder)
                        	fs.unlinkSync(AVATAR_PATH); //delete old file
                    	}
                    }
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
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
		let AVATAR_PATH = path.join(__dirname,'..',user.avatar);
        let DEFAULT_AVATAR_PATH = path.join(__dirname,'../uploads/users/default-avatar/avatar.jpg');
		if (AVATAR_PATH != DEFAULT_AVATAR_PATH){  //if it had other than default avatar
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

		await User.findByIdAndDelete(req.params.id);


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

module.exports.login = function(req,res){
	if(req.isAuthenticated()){
		return res.redirect(`/users/profile/${req.user.id}`);
	}
	return res.render('login',{
		title:'LoginPage'
	});
}
module.exports.signup = function(req,res){
	if(req.isAuthenticated()){
		return res.redirect(`/users/profile/${req.user.id}`);
	}
	return res.render('signup',{
		title:'SignUpPage'
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
				req.flash('success','User Signup Successful !');
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
	req.flash('success','Logged out successfully..');
	return res.redirect('/');
}
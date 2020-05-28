const User = require('../models/user')

const Post = require('../models/post')

const path = require('path');

// <%= moment(Date.now()).diff(moment(post.createdAt),'minutes'); %>
// To get minutes from creation of post till present:

module.exports.home = async function(req,res){  
	try{
		let posts = await Post.find({})
		.sort('-createdAt')
		.populate({
			path:'user'
		})
		.populate({
			path:'likes'
		})
		//nested prepopulating
		.populate({
			path: 'comments',
			populate:{
			path: 'user'
			}
		})
		.populate({
			path: 'comments',
			populate:{
			path: 'likes'
			}
		});

		// let users = await User.find({});
		//when i added isValid field in between , then i set isValid field of existing users to true
		// await User.updateMany({},{isValid:true}); //upsert an multi
		let user = undefined;
		if(req.user){
			user = await User.findById(req.user.id)
			.populate({
				path:'friends',
				populate:{
					path:'from_user to_user'
				}
			});
		}
		console.log('Posts:',posts, '***' , 'USer' , user)
		return res.render('home',{
			title:'Socialera:Home',
			posts: posts,
			curr_user: user
		});	
	
	}catch(err){
		console.log(`Error in loading posts/users:${err}`);
		return ;
	}
	
}

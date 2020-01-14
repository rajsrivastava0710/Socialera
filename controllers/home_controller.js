const User = require('../models/user')

const Post = require('../models/post')

module.exports.home = async function(req,res){  
	try{
		let posts = await Post.find({})
		.sort('-createdAt')
		.populate({
			path:'user'
		})
		//nested prepopulating
		.populate(
		{
			path: 'comments',
			populate:{
			path: 'user'
			}
		});

		let users = await User.find({});
		
		console.log(posts);
		return res.render('home',{
			title:'fakebook:Home',
			posts: posts,
			all_users: users
		});	
	
	}catch(err){
		console.log(`Error in loading posts/users:${err}`);
		return;
	}
	
}

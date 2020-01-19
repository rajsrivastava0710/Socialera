Post = require('../../../models/post.js');
Comment = require('../../../models/comment.js');


module.exports.index = async function(req,res){
	
	let posts = await Post.find({})
		.sort('-createdAt')
		.populate({
			path:'user',
			select: '-password'
		})
		//nested prepopulating
		.populate(
		{
			path: 'comments',
			populate:{
			path: 'user',
			select: '-password'
			}
		});


	return res.status(200).json({
		message:'List of posts',
		posts:posts
	});
}

module.exports.destroy = async function(req,res){
	try{
		let post = await Post.findById(req.params.id);
		if(post.user == req.user.id){
			post.remove();

			await Comment.deleteMany({post:req.params.id});

			return res.status(200).json({
				message:'Post and associated comments deleted!'
			});
		}else{
			return res.status(401).json({
				message:'You can not delete this post'
			});
		}

	}catch(err){
		console.log(err);
		return res.status(500).json({
			message:'Internal Server Error'
		});
	}
	
}
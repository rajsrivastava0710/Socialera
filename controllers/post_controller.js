const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.post = function(req,res){
	Post.create({
		content:req.body.content,
		user:req.user.id
		},function(err,post){
		if(err){
			req.flash('err','Error creating post !');
			res.redirect('back');
		}
		req.flash('success','New Post Created');
		res.redirect('back');
	})
}

module.exports.destroy = async function(req,res){
	try{
		let post = await Post.findById(req.params.id);

		if(post.user == req.user.id){
			post.remove();

			await Comment.deleteMany({post:req.params.id});

			req.flash('success','Post and associated comments deleted !')
			return res.redirect('back');

		}else{
			return res.redirect('back');
		}
	}catch(err){
		req.flash('err','Error deleting this post');
		res.redirect('back');
	}
	
}
const Comment = require('../models/comment');

const Post = require('../models/post');

const Like = require('../models/like');

const commentsMailer = require('../mailers/comments_mailer');

module.exports.create = async function(req,res){
	try{
		let post = await Post.findById(req.body.post);

		if(post){
			let comment = await Comment.create({
				content: req.body.content,
				post: req.body.post,
				user: req.user._id
			});
				
			post.comments.unshift(comment);
			post.save();

			comment = await comment.populate('user', 'name email').execPopulate();
			console.log(comment);

			// for nodemailer Mail
			// commentsMailer.newComment(comment);

			if (req.xhr){
			// Similar for comments to fetch the user's id!
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }
			
			res.redirect('/');
			}
	}catch(err){
		console.log(`Error creating comments: ${err}`);
	}
}


module.exports.destroy = async function(req,res){
	try{
		let comment = await Comment.findById(req.params.id);
		
		if(comment.user == req.user.id){

			let postId = comment.post;

			await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

			comment.remove();

			let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
			
			// send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }

			
			return res.redirect('back');
			
		}else{
			return res.redirect('back');
		}
	}catch(err){
		console.log(`Error deleting comment : ${err}`);
	}
}
	
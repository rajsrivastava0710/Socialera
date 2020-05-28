const Post = require('../models/post');
const Comment = require('../models/comment');

const User = require('../models/user');
const Like = require('../models/like');


module.exports.post = function(req,res){
	Post.uploadedPic(req, res, function(err){
		if(err){
            console.log('Multer Error: )', err);
          	req.flash('error','Oops! Some error encountered while uploading pic!');
           	return res.redirect('back');
        }
		Post.create({
			content:req.body.content,
			user:req.user.id
		},function(err,post){
			Post.populate(post,{path:'user',select:'-password'},function(err,post){
			if(req.file){
				post.pic = Post.picPath+'/'+req.file.filename;
				post.save();
			}
			console.log('post:',post);
			console.log('req.file:',req.file);
			
			if(req.xhr){
					return res.status(200).json({
					data: {post:post},
					message: "Post Created !"
					});
		
			}else{
				return res.redirect('back');
			}
		});
	})
	})
}



module.exports.destroy = async function(req,res){
	try{
		let post = await Post.findById(req.params.id);

		if(post.user == req.user.id){

			//delete likes on post and comments
			await Like.deleteMany({likeable: post._id, onModel: 'Post'});
            await Like.deleteMany({likeable: {$in: post.comments}});
            //

            await Comment.deleteMany({post:req.params.id});

            post.remove();
			  if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

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
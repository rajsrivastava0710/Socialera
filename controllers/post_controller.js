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
		// },function(err,post){
		}).populate('user').exec(function(err,post){// await is not workking here ?no 
			if(req.file){
				post.pic = Post.picPath+'/'+req.file.filename;
				post.save();
			}
			console.log('post:',post);
			console.log('req.file:',req.file);
			// Post.findById(post._id).populate('user').exec(function(err,populatedPost){
			// console.log('populatedpost:',populatedPost)

			if(req.xhr){

					return res.status(200).json({
					data: {post:post},
					message: "Post Created !"
					});
		
			}else{
			return res.redirect('back');
		}
	// });
		});
	})
}

module.exports.posta = async function(req,res){
	try{
		let post = await Post.create({
		content:req.body.content,
		user:req.user.id
		})
		console.log(req.body,req.file);
		

		// if(req.file){

		// 	post.pic = Post.picPath+'/'+req.file.filename;
		// 	post.save();
		// }
		//
//jaise ye conytroller fn h ye vaisa hi h jaisa bataya gya tha video me isme bhi to humne jab bhi xhr
//request ho rhi h to populate kr rhe h create ke baad hi

		console.log('post:',post,'**',req.file)
		//jo abhi console me undefined tha vo ye req.file ka value tha aur jo chrome pe error tha vo isliye ki user populate nhi hua h
		// receiving data through ajax 
		if(req.xhr){
			// post = post.populate('user');
			 // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
			post = post.populate('user').execPopulate();//is line pe jo poulate kr rhe h ye ho nhi rhA H ISLIYE ajax call me jab post.user._id ka value nikal rhe h to error aa rha h
						return res.status(200).json({
				data:{
					post:post
				},
				message:"Post Created !"
			});
		}
		req.flash('success','New Post Created');
		return res.redirect('back');
	}catch(err){
		console.log(err);
		return res.redirect('back')
	}
	
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
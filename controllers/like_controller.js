const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req,res){
	try{

		let likeable;
		let deleted = false;

		if(req.query.type=='Post'){
			likeable = await Post.findById(req.query.id).populate('likes');
		} else {
			likeable = await Comment.findById(req.query.id).populate('likes');
		}

		let existingLike = await Like.findOne({
			likeable:req.query.id,
			onModel:req.query.type,
			user:req.user._id
		})

		if(existingLike){
			likeable.likes.pull(existingLike._id);
			likeable.save();
			existingLike.remove();
			deleted=true;
		} else {
			let newLike = await Like.create({
				user:req.user._id,
				likeable:req.query.id,
				onModel:req.query.type
			})

			likeable.likes.push(newLike._id);
			likeable.save();
			
		}

		return res.status(200).json({
			data:{
				deleted:deleted
			}
		})

	}catch(err){
		console.log(err);
		return res.status(500).json({
			message:'Internal Server Error' 
		})
	}
}
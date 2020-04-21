const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({

	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	//object id of liked object
	likeable:{
		type: mongoose.Schema.Types.ObjectId,
		required:true,
		refPath:'onModel'
	},
	//defining type of liked object
	onModel:{
		type:String,
		required:true,
		enum:['Post','Comment']
	}
},{
	timestamps: true
});

const Like = mongoose.model('Like',likeSchema);

module.exports = Like;
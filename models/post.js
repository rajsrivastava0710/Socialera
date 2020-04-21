const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const PIC_PATH = path.join('/uploads/posts/pics');

const postSchema = new mongoose.Schema({
	content:{
		type: String,
		required: true
	},
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	pic:{
		type:String
		// default:null  
	},
	likes:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:'Like'
		}
	],
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:'Comment'
		}
	]
},{
	timestamps: true
});

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'..',PIC_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
})

//Static functions

postSchema.statics.uploadedPic = multer({ storage: storage }).single('pic');
postSchema.statics.picPath = PIC_PATH;

const Post = mongoose.model('Post',postSchema);

module.exports = Post;
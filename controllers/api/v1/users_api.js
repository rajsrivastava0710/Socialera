User = require('../../../models/user.js');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req,res){
	try{
		let user = await User.findOne({email:req.body.email});

		if(!user || user.password != req.body.password){
			return res.status(422).json({
				message:"Invalid username/password"
			});
		}
		return res.status(200).json({
			message:'Sign in successful,keep your token safe!',
			data:{
				token:jwt.sign(user.toJSON(),'raj',{expiresIn:'200000'})
			}
		});
	}catch(err){
		console.log(err);
		return res.status(500).json({
			message:'Internal Server Error'
		});
	}
}

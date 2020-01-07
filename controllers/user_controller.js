module.exports.profile = function(req,res){
	return res.render('profile',{
		title:'ProfilePage'
	});
}
module.exports.new = function(req,res){
	return res.render('newUser',{
		title:'NewUserPage'
	});
}
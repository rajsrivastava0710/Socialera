const nodeMailer = require('../config/nodemailer');
//new way to export like module.exports = 
exports.newComment = (comment) => {
	nodeMailer.transport.sendMail({
		from: 'rajsriv.14@gmail.com',
		to: comment.user.email,
		subject: "New Comment Published !",
		html: '<h1>Hey, You just commented</h1>'
	},(err,info) => {
		if(err){
			console.log(`Error sending mail : ${err}`);
			return;
		}
		console.log('Message has been sent',info);
		return;
	});
}
const nodeMailer = require('../config/nodemailer');
//new way to export like module.exports = 
exports.deleteUser = (user) => {
	let htmlString = nodeMailer.renderTemplate({user:user},'/users/delete_user.ejs');
	nodeMailer.transporter.sendMail({
		from: 'rajsriv.14@gmail.com',
		to: user.email,
		subject:'Socialera Account Deleted !',
		html: htmlString
	},(err,info) => {
		if(err){
			console.log(`Error sending mail : ${err}`);
			return;
		}
		console.log('Message has been sent',info);
		return;
	});
}

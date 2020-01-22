let email = $('#email');
let password = $('#password');
let warning = $('.warning');
warning.hide();
email.on('focus',function(){
	$(warning[0]).slideDown(1000);
});
password.on('focus',function(){
	$(warning[1]).slideDown(1000);
});
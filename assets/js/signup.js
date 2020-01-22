let warning = $('.warning');
let password = $('#password');
let confirm_pass = $('#confirm_pass');
let placeholder = $('.placeholder');
confirm_pass.hide();
warning.hide();
placeholder.hide();
let input = $('#new-form input');
for(let i=0;i<input.length-1;i++){
	if(i==3){ continue; }
	input.eq(i).on('focus',function(){
		placeholder.eq(i).slideDown(1000);
	});
}

password.on('focus',function(e){
	warning.slideDown(1000);
});
password.on('change',function(e){
	if($(this).val().length<5){
		let len = $(this).val().length;
		$(this).val('');
		new Noty({
				theme:'relax',
				text: `Your password had only ${len} characters`,
				type:'error',
				layout:'topCenter',
				timeout: 3000,
		}).show();
	}else{
	confirm_pass.fadeIn(1000);
	warning.fadeOut(1000,function(){
		placeholder.eq(3).fadeIn(1000);
	});
	}
});
confirm_pass.on('change',function(){
	if($(this).val()!=password.val()){
		$(this).val('');
		new Noty({
				theme:'relax',
				text: "Passwords do not match !",
				type:'error',
				layout:'topCenter',
				timeout: 3000,
		}).show();
	}
})
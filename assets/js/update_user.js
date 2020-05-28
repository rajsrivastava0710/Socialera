let imageFile = $('input[type=file]');
let input = $('#new-form input');
let placeholder = $('.placeholder');
placeholder.hide();
for(let i=0;i<input.length-1;i++){
	input.eq(i).on('focus',function(){
		placeholder.eq(i).fadeIn(1500);
	})
}

imageFile.on('change',function(event){
	console.log(event)
	let value = $(this).val();
	let arr = value.split('.');
	let last = arr.length-1;
	if(arr[last]=='jpg'||arr[last]=='jpeg'||arr[last]=='png'||arr[last]=='bmp'||arr[last]=='gif'){
	console.log(imageFile);
	console.log(imageFile.val());
	}else{
		console.log(imageFile);
		console.log(imageFile.val());
		imageFile.val('');
		new Noty({
				theme:'relax',
				text: "This file can not be accepted !",
				type:'error',
				layout:'topCenter',
				timeout: 3000,
		}).show();
	}
})
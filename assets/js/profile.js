	let delete_ = $('#delete');
	let yes_ = $('#yes');
	let no_ = $('#no');
	let confirm_ = $('#confirm');

	confirm_.hide();
	delete_.on('click',function(e){
		e.preventDefault();
		confirm_.fadeIn(1000);
	});
	no_.on('click',function(e){
		confirm_.fadeOut(500);
	})

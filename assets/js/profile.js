	let delete_ = $('#delete');
	let yes_ = $('#yes');
	let no_ = $('#no');
	let confirm_ = $('#confirm');
	let dp = $('#dp');
	let loader = $('#load-container');
	confirm_.hide();
	confirm_.css('visibility','visible')
	delete_.on('click',function(e){
		e.preventDefault();
		confirm_.fadeIn(1000);
	});
	no_.on('click',function(e){
		confirm_.fadeOut(500);
	})
	// $('body').click(function(){
	// 	loader.hide();
	// 	dp.fadeIn(400);
	// })
	// dp.hide();
	// loader.hide();
	// $(dp).load(function(){
	// 	loader.hide();
	// 	dp.show();
	// })
	// window.onload = function(){
	// 	document.querySelector()
	// }
document.onreadystatechange = function() {
	if(document.readyState != 'complete' && document.readyState != 'interactive'){
		document.querySelector('body').setAttribute(
			"style","visibility:hidden;height:100%;overflow:hidden;");
		document.querySelector('#load-container').setAttribute(
			"style","visibility:visible");
	}else{
		document.querySelector('#load-container').style.visibility = 'hidden';
		document.querySelector('body').setAttribute(
			"style","visibility:visible;height:auto;overflow:visible;");
	}
}

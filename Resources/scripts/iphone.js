/**
 * @author brian
 */
if(window.innerWidth && window.innerWidth <=480){	
	$(document).ready(function(){
		//alert('dc is ready');
		$('#header ul').addClass('hide');	
	});
	
	$('#header ul').toggleClass('hide');
	$('#header .leftButton').toggleClass('pressed');

}

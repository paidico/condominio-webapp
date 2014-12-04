define([
    'utils', 
    'jquery',
    'login', 
    'signup', 
    'moradores'], function(
	u, 
	$,
	login,
	signup,
	moradores) {
	[
	    {
		bind: function() {
		    $('#btn-sair').click(function() {
			u.overlayPage('#login-page');
			$('form').each(function() { this.reset(); });
			$('#img-morador-thumb').attr('src', 'images/picture.png');
			localStorage.clear();
		    });
		}
	    }, login, signup, moradores
	].forEach(function(fn) { fn.bind(); });
    });					     

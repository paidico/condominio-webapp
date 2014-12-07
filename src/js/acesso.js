define([
    'utils', 
    'jquery',
    'login', 
    'signup', 
    'moradores',
    'funcionarios'], function(
	u, 
	$,
	login,
	signup,
	moradores,
	funcionarios) {
	[
	    {
		bind: function() {
		    $('#btn-sair').click(function() {
			u.overlayPage('#login-page');
			$('form').each(function() { this.reset(); });
			$('img.img-thumb').each(function() { this.src = 'images/picture.png'; });
			localStorage.clear();
		    });
		}
	    }, login, signup, moradores, funcionarios
	].forEach(function(fn) { fn.bind(); });
    });					     

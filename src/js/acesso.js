define([
    'utils', 
    'login', 
    'signup', 
    'moradores'], function(
	u, 
	login,
	signup,
	moradores) {
	[
	    {
		bind: function() {
		    $('#btn-sair').click(function() {
			u.overlayPage('#login-page');
			localStorage.clear();
		    });
		}
	    }, login, signup, moradores
	].forEach(function(fn) { fn.bind(); });
    });					     

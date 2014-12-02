define([
    'utils', 
    'login', 
    'signup', 
    'moradores'], function(
	u, 
	login,
	signup,
	moradores) {
	var sair = {
	    bind: function() {
		$('#btn-sair').click(function() {
		    u.overlayPage('#login-page');
		    localStorage.clear();
		});
	    }
	};
	[
	    sair, login, signup, moradores
	].forEach(function(fn) { fn.bind(); });
    });					     

define([
    'utils', 
    'jquery',
    'login', 
    'signup', 
    'usuarios', 
    'moradores',
    'funcionarios',
    'autorizadas',
    'reclamacoes'], function(
	u, 
	$,
	login,
	signup,
	usuarios,
	moradores,
	funcionarios,
	autorizadas,
	reclamacoes) {
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
	    }, login, signup, moradores, usuarios, funcionarios, autorizadas, reclamacoes
	].forEach(function(fn) { fn.bind(); });
    });					     

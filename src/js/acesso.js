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
			$('img.img-thumb').each(function() { this.setAttribute('src', 'images/picture.png'); });
			u['POST']('api/logout',
				  { 
				      usuario: { 
					  id: localStorage.getItem('chaveUsuario').split(',')[0] 
				      }
				  });
			localStorage.clear();
		    });
		}
	    }, login, signup, moradores, usuarios, funcionarios, autorizadas, reclamacoes
	].forEach(function(fn) { fn.bind(); });
    });					     

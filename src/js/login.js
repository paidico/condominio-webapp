define(['utils', 'jquery'], function(u, $) {

    var entrar = function(user) {
	$('#lbl-user-presentation').html(user.username);

	u.applyFunctions([
	    { fn: u.showTabByName, param: ['home'] },
	    { fn: u.overlayPage, param: ['#main-page'] },
	    { 
		fn: function() {
		    localStorage.setItem(
			'chaveUsuario', 
			user.username + ',' + user.chave.codigo);
		}
	    }
	]);
    };

    return {
	bind: function() {
	    u.overlayPage('#login-page');

	    $('#login-page form').submit(function(e) {
		e.preventDefault();
		
		var param = { 
		    usuario: {
			username: $('#txt-username').val(),
			password: $('#txt-senha').val()
		    }
		};
		this.reset();
		u['POST']('api/login', 
			param, 
			function(retorno) {
			    if(retorno.sucesso && retorno.usuario) {
				entrar(retorno.usuario);
				return;
			    }
			    u.alert('warning', retorno.msg);
			},
			function() {
			    u.alert('danger', 'Falha no serviço de acesso');
			});
	    });
	},
	access: entrar
    };
});
define(['utils', 'jquery', 'login'], function(u, $, login) {
    return {
	bind: function() {
	    $('#btn-signup').click(function(e) {
		e.preventDefault();

		u.overlayPage('#signup-page');
		$('#signup-page form').submit(function(f) {
		    f.preventDefault();

		    var param = { 
			usuario: {
			    username: $('#txt-username-signup').val(),
			    password: $('#txt-senha-signup').val(),
			    tipo: $('#lst-user-type-signup').first(':selected').val()
			}
		    }

		    if(param.usuario.password !== $('#txt-senha2-signup').val()) {
			u.alert('warning', 'Confirmação de senha não confere');
			return;
		    }
		    this.reset();
		    u.aPost('api/signup',
			    param,
			    function(retorno) {
				if(retorno.sucesso && retorno.usuario) {
				    login.access(retorno.usuario);
				    return;
				}
				u.alert('warning', retorno.msg);
			    },
			    function() { 
				u.alert('danger', 'Falha no serviço de registro'); 
			    });

		});
	    });
	}
    };
});

define(['utils', 'jquery'], function(u, $) {
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

		    if(param.usuario.username.length < 4 || param.usuario.password.length < 4) {
			u.alert('danger', 'Nome de usuário ou senha não podem ter menos que 4 caracteres');
			return;
		    }
		    if(param.usuario.password !== $('#txt-senha2-signup').val()) {
			u.alert('danger', 'Confirmação de senha não confere');
			return;
		    }
		    this.reset();
		    u['POST']('api/signup',
			      param,
			      function(retorno) {
				  if(retorno.sucesso) {
				      u.overlayPage('#login-page');
				      u.alert('success', retorno.msg);
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

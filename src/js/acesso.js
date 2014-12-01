define(['utils'], function(u) {
    var selMain = '#main-page', 
    selLogin = '#login-page', 
    selSignup = '#signup-page', 
    selBtnSair = '#btn-sair',
    selBtnSignup = '#btn-signup',
    selUserPresent = "#lbl-user-presentation",
    _sair = function() {
	u.overlayPage(selLogin);
	localStorage.clear();
    },
    _bindBtnSair = function() {
	$(selBtnSair).click(_sair);
    },
    _entrar = function(user) {
	$(selUserPresent).html(user.username);
	u.applyFunctions([
	    { fn: _bindBtnSair },
	    { fn: u.showTabByName, param: ['home'] },
	    { fn: u.overlayPage, param: [selMain] },
	    { 
		fn: function() {
		    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			$('#field-alert').html('');
		    });
		    localStorage.setItem('chaveUsuario', user.username + ',' + user.chave.codigo);
		}
	    }
	]);
    };
    return {
	sair: _sair,
	bind: function() {
	    u.overlayPage.call(null, selLogin);
	    // login
	    $(selLogin + ' > form').submit(function(e) {
		e.preventDefault();
		
		var param = { 
		    usuario: {
			username: $('#txt-username').val(),
			password: $('#txt-senha').val()
		    }
		};
		this.reset();
		u.aPost('api/login', 
			param, 
			function(retorno) {
			    if(retorno.sucesso && retorno.usuario) {
				_entrar(retorno.usuario);
				return;
			    }
			    u.alert('warning', retorno.msg);
			},
			function() {
			    u.alert('danger', 'Falha no serviço de acesso');
			});
	    });
	    // signup
	    $(selBtnSignup).click(function(e) {
		e.preventDefault();

		u.overlayPage.call(null, selSignup);
		$(selSignup + ' > form').submit(function(ev) {
		    ev.preventDefault();

		    var param = { 
			"usuario": {
			    "username": $('#txt-username-signup').val(),
			    "password": $('#txt-senha-signup').val(),
			    "tipo": $('#lst-user-type-signup').first(':selected').val()
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
				    _entrar(retorno.usuario);
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

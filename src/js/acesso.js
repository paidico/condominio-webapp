define(['utils'], function(u) {
    var selMain = '#main-page', 
    selLogin = '#login-page', 
    selSignup = '#signup-page', 
    selBtnSair = '#btn-sair',
    selBtnSignup = '#btn-signup',
    selUserPresent = "#lbl-user-presentation",
    selPanelMoradores = "#panel-moradores",
    selSearchMoradores = '#search-moradores',
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
	    $(selLogin + ' form').submit(function(e) {
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
		$(selSignup + ' form').submit(function(ev) {
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
	    // moradores
	    $('a[href="#moradores"]').click(function() {
		var listaMoradores = [];
		u.clearTableMoradores();

		$(selPanelMoradores + ' form').submit(function(e) {
		    e.preventDefault();
		    console.log($(selSearchMoradores).val());
		});

		u.aGet('api/moradores',
		       null,
		       function(retorno) {
			   if(retorno.sucesso 
			      && retorno.moradores 
			      && retorno.moradores instanceof Array) {
			       (listaMoradores = retorno.moradores.slice())
				   .forEach(u.populateMorador);
			       return;
			   }
			   u.alert('warning', retorno.msg);
		       },
		       function() {
			   u.alert('danger', retorno.msg);
		       });	
	    });
	}
    };
});					     

define(['jquery', 'utils'], function(jq, u) {
    var selMain = '#main-page', selLogin = '#login-page', selBtn = '#btn-sair';
    var _sair = function() {
	u.toggleHide.apply(null, [selLogin, selMain]);
	localStorage.clear();
    };
    var _bindBtnSair = function() {
	jq(selBtn).click(_sair);
    };
    return {
	bindBtnSair: _bindBtnSair,
	sair: _sair,
	entrar: function() {
	    u.toggleHide.call(null, selLogin);
	    jq(selLogin + ' > form').submit(function(e) {
		e.preventDefault();
		[
		    { fn: _bindBtnSair },
		    { fn: u.showTabByName, params: ['home'] },
		    { fn: u.toggleHide, params: [selMain, selLogin] }
		].forEach(function(a) { 
		    a.fn.apply(null, a.params || []); 
		});
	    });
	}
    };
});					     

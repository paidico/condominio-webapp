define(['jquery', 'utils'], function(jq, u) {
    var selMain = '#main-page', selLogin = '#login-page', selBtn = '#btn-sair';
    var _sair = function() {
	u.toggleHide.call(null, selLogin)
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
		    { fn: u.showTabByName, param: 'home' },
		    { fn: u.toggleHide, param: selMain }
		].forEach(function(a) { 
		    a.fn.call(null, a.param)
		});
	    });
	}
    };
});					     

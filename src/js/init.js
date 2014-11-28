define(['jquery'], function(jq) {
    jq(document).ready(function() {
	acessar.call(this, jq);
    });
});

function acessar(jq) {
    if(localStorage.getItem('chaveAcesso')) {
	var chave = JSON.parse(localStorage.getItem('chaveAcesso'));
	if(new Date().getTime() < chave.expiraTimestamp) {
	    jq('#main-page').removeClass('hidden');
	    return;
	}
    }
    jq('#login-page').removeClass('hidden');
    jq('#login-page > form').submit(function(e) {
	e.preventDefault();
	jq('#login-page').addClass('hidden');
	jq('#main-page').removeClass('hidden');
	jq('#btn-sair').on('click', null, jq, sair);
    });
}

function sair(e) {
    var jq = e.data;
    jq('#main-page').addClass('hidden');
    jq('#login-page').removeClass('hidden');
    localStorage.clear();
}

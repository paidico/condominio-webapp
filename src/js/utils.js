define([], function() {
    var selAlertField = '#field-alert div',
    selMoradorTable = '#panel-moradores-table > table tbody',
    protocol = 'http',
    domain = 'localhost',
    port = '8086',
    prefixo = protocol + '://' + domain + ':' + port + '/';
    $.ajaxSetup({
	statusCode: {
	    404: function() {
		console.log('Conteúdo não encontrado');
	    }
	},
	contentType: 'application/json; charset=UTF-8',
	dataType: 'json',
	beforeSend: function(jqxhr, settings) {
	    settings.url = prefixo + settings.url;
            jqxhr.setRequestHeader('x-chave-usuario', localStorage.getItem('chaveUsuario') || '');
	}
    });
    return {
	overlayPage: function(pag) { 
	    [
		'#main-page', '#login-page', '#signup-page'
	    ].forEach(function(p) {
		$(p).addClass('hidden');
	    });
	    $(selAlertField).html('');
	    $(pag).removeClass('hidden');
	},
	showTabByName: function(n) {
	    $('ul[role="tablist"] a[href="#' + n + '"]').tab('show');
	},
	alert: function(tipo, msg) {
	    var tituloEnum = { 
		"danger": "Erro!",
		"warning": "Aviso!"
	    };

	    $(selAlertField)
		.html($('<div>')
		      .addClass('alert alert-' + tipo + ' alert-dismissible fade in')
		      .attr('role', 'alert')
		      .html($('<button>')
			    .addClass('close')
			    .attr({ 'type': 'button', 'data-dismiss': 'alert' })
			    .html($('<span>')
				  .attr('aria-hidden', 'true')
				  .html('&times;'))
			    .append($('<span>')
				    .addClass('sr-only')
				    .html('Fechar')))
		      .append($('<strong>')
			      .html(tituloEnum[tipo]))
		      .append('&nbsp;' + msg));

	    $(selAlertField + ' > .alert').alert();
	},
	applyFunctions: function(funcArray) {
	    // função: fn
	    // parâmetro: [param]
	    funcArray.forEach(function(a) { 
		a.fn.apply(null, a.param ? a.param : []); 
	    });
	},
	clearTableMoradores: function() {
	    $(selMoradorTable).empty();
	},
	populateMorador: function(morador) {
	    $(selMoradorTable)
		.append($('<tr>')
			// nome
			.html($('<td>').html(morador.nome))
			// cpf
			.append($('<td>').html(morador.cpf))
			// bloco
			.append($('<td>').html(morador.bloco))
			// apto
			.append($('<td>').html(morador.apto)));
	},
	aPost: function(url, param, success, fail) {
	    $.ajax(url, { 
		type: 'POST', 
		data: JSON.stringify(param), 
		success: success, 
		error: fail 
	    });
	},
	aGet: function(url, param, success, fail) {
	    $.ajax(url, {
		type: 'GET',
		data: param,
		success: success,
		error: fail
	    });
	},
	aPut: function(url, param, success, fail) {
	    (url, {
		type: 'PUT',
		data: JSON.stringify(param),
		success: success,
		error: fail
	    });
	},
	aDelete: function(url, param, success, fail) {
	    $.ajax(url, {
		type: 'DELETE',
		data: JSON.stringify(param),
		success: success,
		error: fail
	    });
	}
    };
});

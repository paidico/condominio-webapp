define([], function() {
    var selAlertField = '#field-alert div',
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
	    var content = '<div class="alert alert-' + tipo + ' alert-dismissible fade in" role="alert">'
		+ '<button type="button" class="close" data-dismiss="alert">'
		+ '<span aria-hidden="true">&times;</span>'
		+ '<span class="sr-only">Fechar</span>'
		+ '</button><strong>' + tituloEnum[tipo] + '</strong>&nbsp;' + msg + '</div>';

	    $(selAlertField).html(content);
	    $(selAlertField + ' > .alert').alert();
	},
	applyFunctions: function(funcArray) {
	    // função: fn
	    // parâmetro: [param]
	    funcArray.forEach(function(a) { 
		a.fn.apply(null, a.param ? a.param : []); 
	    });
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

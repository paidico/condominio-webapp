define([], function() {
    var protocol = 'http',
    domain = 'localhost',
    port = '8086',
    prefixo = protocol + '://' + domain + ':' + port + '/',
    objectExtension = function(base, extensao) {
	for(var p in extensao) {
	    if(extensao.hasOwnProperty(p)) {
		base[p] = extensao[p];
	    }
	}
    },
    ajaxBase = {
	statusCode: {
	    404: function() {
		console.log('Conteúdo não encontrado');
	    }
	},
	contentType: 'application/json; charset=UTF-8',
	dataType: 'json'
    };
    return {
	overlayPage: function(pag) { 
	    [
		'#main-page', '#login-page', '#signup-page'
	    ].forEach(function(p) {
		$(p).addClass('hidden');
	    });
	    $('#field-alert').html('');
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

	    $('#field-alert').html(content);
	    $('#field-alert > .alert').alert();
	},
	applyFunctions: function(funcArray) {
	    // função: fn
	    // parâmetro: [param]
	    funcArray.forEach(function(a) { 
		a.fn.apply(null, a.param ? a.param : []); 
	    });
	},
	aPost: function(url, param, success, fail) {
	    objectExtension(ajaxBase, {
		type: 'POST',
		url: prefixo + url,
		data: JSON.stringify(param),
		success: success,
		error: fail
	    });

	    $.ajax(ajaxBase);
	},
	aGet: function(url, param, success, fail) {
	    objectExtension(ajaxBase, {
		type: 'GET',
		url: prefixo + url,
		data: JSON.stringify(param),
		success: success,
		error: fail
	    });

	    $.ajax(ajaxBase);
	},
	aPut: function(url, param, success, fail) {
	    objectExtension(ajaxBase, {
		type: 'PUT',
		url: prefixo + url,
		data: JSON.stringify(param),
		success: success,
		error: fail
	    });

	    $.ajax(ajaxBase);
	},
	aDelete: function(url, param, success, fail) {
	    objectExtension(ajaxBase, {
		type: 'DELETE',
		url: prefixo + url,
		data: JSON.stringify(param),
		success: success,
		error: fail
	    });

	    $.ajax(ajaxBase);
	}
    };
});

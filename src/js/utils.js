define(['jquery', 'alert', 'tab'], function($) {

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
    }),
    alert = function(tipo, msg) {
	var tituloEnum = { 
	    "danger": "Erro!",
	    "warning": "Aviso!",
	    "success": "Ok!"
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
    validateImagem = function(campo, callback) {
	if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
	    alert('danger', 'Navegador não suporta recurso solicitado');
	    return;
	}    
	if(!campo.value) {            
	    return;
	}
	var img = campo.files[0];
	var fsize = img.size;
	var ftype = img.type;       

	switch(ftype) {
	case 'image/png': 
	case 'image/gif': 
	case 'image/jpeg': 
	case 'image/pjpeg':
	    // fallthrough proposital
	    break;
	default:
	    alert('danger', 'Tipo de arquivo não suportado');
	    return;
	}
	
	// limite
	if(fsize > 1048576) {
	    alert('danger', 'Tamanho da imagem excede o limite');
	    return;
	}

	callback(img);
    };
    return {
	handleImagem: function(campo) {
	    validateImagem(campo, function(img) {
		var reader = new FileReader();
		reader.addEventListener('load', function(ev) {
		    document.querySelector(campo['data-target-thumb']).src = ev.target.result;
		});
		reader.readAsDataURL(img);
	    });
	},
	getImagem: function(campo, callback) {
	    validateImagem(campo, function(img) {
		var reader = new FileReader();
		reader.addEventListener('load', function(ev) {
		    callback(ev.target.result);
		});
		reader.readAsBinaryString(img);
	    });
	},
	overlayPage: function(pag) { 
	    [
		'#main-page', '#login-page', '#signup-page'
	    ].forEach(function(p) {
		$(p).addClass('hidden');
	    });
	    $(selAlertField + ' > .alert').alert('close');
	    $(pag).removeClass('hidden');
	},
	showTabByName: function(n) {
	    $('ul[role="tablist"] a[href="#' + n + '"]').tab('show');
	},
	alert: alert,
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
		data: param,
		success: success,
		error: fail
	    });
	}
    };
});

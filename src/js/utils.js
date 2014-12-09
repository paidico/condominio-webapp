define(['condominio-modal', 'jquery', 'alert', 'tab', 'datepicker'], function(cModal, $) {

    var selAlertField = '#field-alert div',
    busy = { 
	isVisible: false,
	modal: null,
	show: function() {
	    var self = this;
	    if(!self.isVisible) {
		self.modal = new cModal.Modal({ 
		    content: document.querySelector("#condominio-busy-modal .condominio-busy-overlay"), 
		    btnClose: false, 
		    maxWidth: 100,
		    minWidth: 0,
		    onClose: function() { self.isVisible = false; }
		});
		self.modal.open();
		self.isVisible = true;
	    }
	},
	hide: function() {
	    var self = this;
	    if(self.isVisible) {
		self.modal.close();
	    }
	}
    },
    timeoutId = null,
    protocol = 'http',
    domain = 'localhost',
    port = '8086',
    prefixo = protocol + '://' + domain + ':' + port + '/';
    $.ajaxSetup({
	contentType: 'application/json; charset=UTF-8',
	dataType: 'json',
	xhrFields: { withCredentials: true },
	beforeSend: function(jqxhr, settings) {
	    timeoutId = setTimeout(function() { busy.show(); }, 555);
	    settings.url = prefixo + settings.url;
            jqxhr.setRequestHeader('x-chave-usuario', localStorage.getItem('chaveUsuario') || '');
	},
	complete: function() { 
	    clearTimeout(timeoutId);
	    setTimeout(function() { busy.hide(); }, 555);
	}
    }),
    ajaxError = function(retorno, callback) { 
	alert('danger', retorno.msg); 
	if(callback && typeof callback === 'function') {
	    callback(retorno);
	}
    },
    ajaxSuccess = function(retorno, callback) {
	if(!retorno) {
	    alert('danger', 'Serviço não retornou informação');
	    return;
	}
	if(retorno.sucesso) {
	    alert('success', retorno.msg);
	    if(callback && typeof callback === 'function') {
		callback(retorno);
	    }
	    return;
	}
	alert('warning', retorno.msg);
    },
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
	if (!(window.File 
	      && window.FileReader 
	      && window.FileList 
	      && window.Blob)) {
	    alert('danger', 'Navegador não suporta recurso solicitado');
	    return;
	}    
	if(!campo.value) {            
	    alert('danger', 'Foto não encontrada');
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
	thumbImagem: function(campo) {
	    validateImagem(campo, function(img) {
		var reader = new FileReader();
		reader.addEventListener('load', function(ev) {
		    document.querySelector(campo.getAttribute('data-target-thumb'))
			.setAttribute('src', ev.target.result);
		});
		reader.readAsDataURL(img);
	    });
	},
	busy: busy,
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
	reformatDate: function(dtstr, pattern) {
	    var $d = $.datepicker;
	    pattern = pattern || $d.ISO_8601;

            return $d.formatDate(pattern, 
				 $d.parseDate($d.ISO_8601, 
					      dtstr.replace(/T[\d.:+-]+Z/, '')));
	},
	POST: function(url, param, success, fail) {
	    $.ajax(url, { 
		type: 'POST', 
		data: JSON.stringify(param), 
		success: function(r) { ajaxSuccess(r, success); },
		error: function(r) { ajaxError(r, fail); }
	    });
	},
	GET: function(url, param, success, fail, replaceSucess) {
	    $.ajax(url, {
		type: 'GET',
		data: param,
		success: replaceSucess || function(r) { ajaxSuccess(r, success); },
		error: function(r) { ajaxError(r, fail); }
	    });
	},
	PUT: function(url, param, success, fail) {
	    $.ajax(url, {
		type: 'PUT',
		data: JSON.stringify(param),
		success: function(r) { ajaxSuccess(r, success); },
		error: function(r) { ajaxError(r, fail); }
	    });
	},
	DELETE: function(url, param, success, fail) {
	    $.ajax(url, {
		type: 'DELETE',
		data: param,
		success: function(r) { ajaxSuccess(r, success); },
		error: function(r) { ajaxError(r, fail); }
	    });
	}
    };
});

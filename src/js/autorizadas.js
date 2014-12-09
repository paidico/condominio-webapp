define(['utils', 'jquery', 'datepicker'], function(u, $) {
    var enumVerb = {
	PUT: { keepId: true },
	POST: { url: 'api/autorizadas' }
    };

    var saveAutorizada = function(action) {
	if(!enumVerb[action]) {
	    u.alert('danger', 'Ação desconhecida a ser enviada para o serviço');
	    return;
	}

	setTimeout(function() { 
	    enumVerb['PUT'].url = 'api/autorizadas/' + $('#txt-autorizada-id').val();
	}, 800);
	clearForm(action, enumVerb[action].keepId);

	$('#autorizada-form-panel').removeClass('hidden');

    };
    var removeAutorizada = function(id, callback, callthis) {

	u['DELETE']('api/autorizadas/' + id,
		    null,
		    function() {
			if(callback && typeof callback === 'function') {
			    callback.call(callthis);
			}
		    });	
    };

    var clearForm = function(action, id) {
	$('#autorizada-form-panel').addClass('hidden');

	$('#autorizada-form-panel form').attr('action', action);
	$('#txt-autorizada-id').val(id);
    };

    var fillForm = function(autorizada) {
	$('#autorizada-form-panel').removeClass('hidden');
	$('#txt-autorizada-id').val(autorizada._id);
	$('#txt-autorizada-nome').val(autorizada.nome);
	$('#txt-autorizada-cpf').val(autorizada.cpf);
	$('#txt-autorizada-cel').val(autorizada.celular);
	if(autorizada.dtInicial) {
	    $('#txt-autorizada-dtini').val(u.reformatDate(autorizada.dtInicial, 'dd/mm/yy'));
	}
	if(autorizada.dtFinal) {
	    $('#txt-autorizada-dtfim').val(u.reformatDate(autorizada.dtFinal, 'dd/mm/yy'));
	}
	$('#txt-autorizada-apto').val(autorizada.apto);
	$('#txt-autorizada-bloco').val(autorizada.bloco);
	$('#txt-autorizada-autorizador').val(autorizada.autorizador);
	$('#txt-autorizada-contato').val(autorizada.contato);
    };

    var populateAutorizada = function(autorizada) {

	$('#panel-autorizadas-table > table tbody')
	    .append($('<tr>')
		    // nome
		    .html($('<td>').html(autorizada.nome))
		    // cpf
		    .append($('<td>').html(autorizada.cpf))
		    // inicial
		    .append($('<td>')
			    .html(autorizada.dtInicial
				  ? u.reformatDate(autorizada.dtInicial, "dd-M-yy")
				  : ''))
		    // final
		    .append($('<td>')
			    .html(autorizada.dtFinal
				  ? u.reformatDate(autorizada.dtFinal, "dd-M-yy")
				  : ''))
		    // ações (editar / apagar)
		    .append($('<td>').html($('<div>')
					   .addClass('btn-group btn-group-xs pull-right')
					   .attr({ 'role': 'group', 'aria-label': '...' })
					   .html($('<button>')
						 .click(function() {
						     saveAutorizada('PUT');
						     fillForm(autorizada);
						     location.href = '#autorizados';
						 })
						 .addClass('btn btn-default')
						 .attr('type', 'button')
						 .html($('<i>').addClass('fa fa-pencil-square-o'))
						 .append('&nbsp;Editar'))
					   .append($('<button>')
						   .click(function() {
						       removeAutorizada(autorizada._id, 
									$(this).closest('tr').remove, 
									$(this).closest('tr'));
						   })
						   .addClass('btn btn-danger')
						   .attr('type', 'button')
						   .html($('<i>').addClass('fa fa-trash-o'))
						   .append('&nbsp;Excluir')))));
    };
    var listaAutorizadas = function() {

	$('#panel-autorizadas-table > table tbody').empty();

	u['GET']('api/autorizadas',
		 null, // param
		 null, // success
		 null, // fail
		 function(retorno) {
		     if(!retorno) {
	    		 u.alert('danger', 'Serviço não retornou informação');
			 return;
		     }
		     if(retorno.sucesso 
			&& retorno.autorizadas 
			&& retorno.autorizadas instanceof Array) {
			 retorno.autorizadas.slice().forEach(populateAutorizada);
			 return;
		     }
		     u.alert('warning', retorno.msg);
		 });	
    };
    return {
	bind: function() {
	    // search
	    $('#panel-autorizadas form').submit(function(e) {
		e.preventDefault();

		u['POST']('api/autorizadas/search',
			  { termo: $('#search-autorizadas').val() },
			  function(retorno) {
			      if(retorno.autorizadas 
				 && retorno.autorizadas instanceof Array
				 && retorno.autorizadas.length) {
				  $('#panel-autorizadas-table > table tbody').empty();
				  retorno.autorizadas.slice().forEach(populateAutorizada);
				  location.href = '#panel-autorizadas-table';
			      } else {
				  u.alert('warning', 'Busca não retornou resultados');
			      }
			  });
	    });

	    // form
	    $('#txt-autorizada-dtini').datepicker();
	    $('#txt-autorizada-dtfim').datepicker();

	    $('#autorizada-form-eraser').click(function() {
		clearForm($('#autorizada-form-panel form').attr('action'), 
			  $('#txt-autorizada-id').val() 
			  && $('#txt-autorizada-id').val().length
			  ? $('#txt-autorizada-id').val() : null);
	    });
	    // form submit
	    $('#autorizada-form-panel form').submit(function(e) {
		e.preventDefault();
		var param = {
		    autorizada: {
			nome: $('#txt-autorizada-nome').val(),
			cpf: $('#txt-autorizada-cpf').val(),
			celular: $('#txt-autorizada-cel').val(),
			dtInicial: $('#txt-autorizada-dtini').datepicker('getDate'),
			dtFinal: $('#txt-autorizada-dtfim').datepicker('getDate'),
			autorizador: $('#txt-autorizada-autorizador').val(),
			apto: $('#txt-autorizada-apto').val(),
			bloco: $('#txt-autorizada-bloco').val(),
			contato: $('#txt-autorizada-contato').val()
		    }
		};
		var action = $('#autorizada-form-panel form').attr('action');

		u[action](enumVerb[action].url,
	    		  param,
			  function() {
    			      listaAutorizadas();
	    		      clearForm();
			  });	
	    });
	    
	    // criar
	    $('#btn-new-autorizada').click(function() { saveAutorizada('POST'); });

	    // listar
	    $('a[href="#autorizados"]').click(listaAutorizadas);
	}
    };
});

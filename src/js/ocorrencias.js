define(['utils', 'jquery', 'datepicker'], function(u, $) {
    var enumVerb = {
	PUT: { keepId: true },
	POST: { url: 'api/ocorrencias' }
    };

    var saveOcorrencia = function(action) {
	if(!enumVerb[action]) {
	    u.alert('danger', 'Ação desconhecida a ser enviada para o serviço');
	    return;
	}

	setTimeout(function() { 
	    enumVerb['PUT'].url = 'api/ocorrencias/' + $('#txt-ocorrencia-id').val();
	}, 800);
	clearForm(action, enumVerb[action].keepId);

	$('#ocorrencia-form-panel').removeClass('hidden');

    };
    var removeOcorrencia = function(id, callback, callthis) {

	u['DELETE']('api/ocorrencias/' + id,
		    null,
		    function() {
			if(callback && typeof callback === 'function') {
			    callback.call(callthis);
			}
		    });	
    };

    var clearForm = function(action, id) {
	$('#ocorrencia-form-panel').addClass('hidden');

	$('#ocorrencia-form-panel form').attr('action', action);
	$('#txt-ocorrencia-id').val(id);
    };

    var fillForm = function(ocorrencia) {
	$('#ocorrencia-form-panel').removeClass('hidden');
	$('#txt-ocorrencia-id').val(ocorrencia._id);
	$('#txt-ocorrencia-abridor').val(ocorrencia.abridor);
	if(ocorrencia._funcionario) {
	    $('#lst-ocorrencia-fnc').val(ocorrencia._funcionario._id);
	}
	if(ocorrencia.dt) {
	    $('#txt-ocorrencia-dt').val(u.reformatDate(ocorrencia.dt, 'dd/mm/yy'));
	}
	$('#txt-ocorrencia-descricao').val(ocorrencia.descricao);
    };

    var populateOcorrencia = function(ocorrencia) {

	$('#panel-ocorrencias-table > table tbody')
	    .append($('<tr>')
		    // nome
		    .html($('<td>').html(ocorrencia.abridor))
		    // funcionário
		    .append($('<td>').html((ocorrencia._funcionario 
					    ? ocorrencia._funcionario.nome : '')))
		    // data
		    .append($('<td>')
			    .html(ocorrencia.dt
				  ? u.reformatDate(ocorrencia.dt, "dd-M-yy")
				  : ''))
		    // ações (editar / apagar)
		    .append($('<td>').html($('<div>')
					   .addClass('btn-group btn-group-xs pull-right')
					   .attr({ 'role': 'group', 'aria-label': '...' })
					   .html($('<button>')
						 .click(function() {
						     saveOcorrencia('PUT');
						     fillForm(ocorrencia);
						     location.href = '#ocorrencias';
						 })
						 .addClass('btn btn-default')
						 .attr('type', 'button')
						 .html($('<i>').addClass('fa fa-pencil-square-o'))
						 .append('&nbsp;Editar'))
					   .append($('<button>')
						   .click(function() {
						       removeOcorrencia(ocorrencia._id, 
									$(this).closest('tr').remove, 
									$(this).closest('tr'));
						   })
						   .addClass('btn btn-danger')
						   .attr('type', 'button')
						   .html($('<i>').addClass('fa fa-trash-o'))
						   .append('&nbsp;Excluir')))));
    };
    var listaOcorrencias = function() {

	$('#panel-ocorrencias-table > table tbody').empty();

	u['GET']('api/ocorrencias',
		 null, // param
		 null, // success
		 null, // fail
		 function(retorno) {
		     if(!retorno) {
	    		 u.alert('danger', 'Serviço não retornou informação');
			 return;
		     }
		     if(retorno.sucesso 
			&& retorno.ocorrencias 
			&& retorno.ocorrencias instanceof Array) {
			 retorno.ocorrencias.slice().forEach(populateOcorrencia);
			 return;
		     }
		     u.alert('warning', retorno.msg);
		 });	
    };
    return {
	bind: function() {

	    // form
	    $('#txt-ocorrencia-dt').datepicker();

	    $('#ocorrencia-form-eraser').click(function() {
		clearForm($('#ocorrencia-form-panel form').attr('action'), 
			  $('#txt-ocorrencia-id').val() 
			  && $('#txt-ocorrencia-id').val().length
			  ? $('#txt-ocorrencia-id').val() : null);
	    });
	    // form submit
	    $('#ocorrencia-form-panel form').submit(function(e) {
		e.preventDefault();
		var param = {
		    ocorrencia: {
			nome: $('#txt-ocorrencia-nome').val(),
			_funcionario: $('#lst-ocorrencia-fnc').first(':selected').val(),
			dt: $('#txt-ocorrencia-dt').datepicker('getDate'),
			descricao: $('#txt-ocorrencia-descricao').val()
		    }
		};
		var action = $('#ocorrencia-form-panel form').attr('action');

		u[action](enumVerb[action].url,
	    		  param,
			  function() {
    			      listaOcorrencias();
	    		      clearForm();
			  });	
	    });
	    
	    // criar
	    $('#btn-new-ocorrencia').click(function() { saveOcorrencia('POST'); });

	    // listar
	    $('a[href="#ocorrencias"]').click(function() {
		listaOcorrencias();

		// popular lista de funcionários
		u['GET']('api/funcionarios',
			 null, // param
			 null, // success
			 null, // fail
			 function(retorno) {
			     if(retorno
				&& retorno.sucesso 
				&& retorno.funcionarios 
				&& retorno.funcionarios instanceof Array) {
				 $('#lst-ocorrencia-fnc').empty();
				 retorno.funcionarios.slice().forEach(function(f) {
				     $('#lst-ocorrencia-fnc').append($('<option>')
								     .attr('value', f._id)
								     .html(f.nome));
				 });
			     }
			 });	
	    });
	}
    };
});

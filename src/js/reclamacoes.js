define(['utils', 'jquery', 'datepicker'], function(u, $) {
    var enumVerb = {
	PUT: { keepId: true },
	POST: { url: 'api/reclamacoes' }
    };

    var saveReclamacao = function(action) {
	if(!enumVerb[action]) {
	    u.alert('danger', 'Ação desconhecida a ser enviada para o serviço');
	    return;
	}

	setTimeout(function() { 
	    enumVerb['PUT'].url = 'api/reclamacoes/' + $('#txt-reclamacao-id').val();
	}, 800);
	clearForm(action, enumVerb[action].keepId);

	$('#reclamacao-form-panel').removeClass('hidden');

    };
    var removeReclamacao = function(id, callback, callthis) {

	u['DELETE']('api/reclamacoes/' + id,
		    null,
		    function() {
			if(callback && typeof callback === 'function') {
			    callback.call(callthis);
			}
		    });	
    };

    var clearForm = function(action, id) {

	$('#reclamacao-form-panel').addClass('hidden');
	$('#reclamacao-form-panel form')[0].reset();

	$('#reclamacao-form-panel form').attr('action', action);
	$('#txt-reclamacao-id').val(id);
    };

    var fillForm = function(reclamacao) {
	$('#reclamacao-form-panel').removeClass('hidden');
	$('#txt-reclamacao-id').val(reclamacao._id);
	$('#txt-reclamacao-nome').val(reclamacao.nome);
	$('#lst-reclamacao-situacao').val(reclamacao.situacao);
	$('#txt-reclamacao-apto').val(reclamacao.apto);
	if(reclamacao.dt) {
	    $('#txt-reclamacao-dt').val(u.reformatDate(reclamacao.dt, 'dd/mm/yy'));
	}
	$('#txt-reclamacao-bloco').val(reclamacao.bloco);
	$('#txt-reclamacao-resolvedor').val(reclamacao.resolvedor);
	$('#txt-reclamacao-descricao').val(reclamacao.descricao);
    };

    var populateReclamacao = function(reclamacao) {

	$('#panel-reclamacoes-table > table tbody')
	    .append($('<tr>')
		    // nome
		    .html($('<td>').html(reclamacao.nome))
		    // apto
		    .append($('<td>').html(reclamacao.apto))
		    // bloco
		    .append($('<td>').html(reclamacao.bloco))
		    // data
		    .append($('<td>')
			    .html(reclamacao.dt
				  ? u.reformatDate(reclamacao.dt, "dd-M-yy")
				  : ''))
		    // ações (editar / apagar)
		    .append($('<td>').html($('<div>')
					   .addClass('btn-group btn-group-xs pull-right')
					   .attr({ 'role': 'group', 'aria-label': '...' })
					   .html($('<button>')
						 .click(function() {
						     saveReclamacao('PUT');
						     fillForm(reclamacao);
						 })
						 .addClass('btn btn-default')
						 .attr('type', 'button')
						 .html($('<i>').addClass('fa fa-pencil-square-o'))
						 .append('&nbsp;Editar'))
					   .append($('<button>')
						   .click(function() {
						       removeReclamacao(reclamacao._id, 
									$(this).closest('tr').remove, 
									$(this).closest('tr'));
						   })
						   .addClass('btn btn-danger')
						   .attr('type', 'button')
						   .html($('<i>').addClass('fa fa-trash-o'))
						   .append('&nbsp;Excluir')))));
    };
    var listaReclamacoes = function() {

	$('#panel-reclamacoes-table > table tbody').empty();

	u['GET']('api/reclamacoes',
		 null, // param
		 null, // success
		 null, // fail
		 function(retorno) {
		     if(!retorno) {
	    		 u.alert('danger', 'Serviço não retornou informação');
			 return;
		     }
		     if(retorno.sucesso 
			&& retorno.reclamacoes 
			&& retorno.reclamacoes instanceof Array) {
			 retorno.reclamacoes.slice().forEach(populateReclamacao);
			 return;
		     }
		     u.alert('warning', retorno.msg);
		 });	
    };
    return {
	bind: function() {

	    // form
	    $('#txt-reclamacao-dt').datepicker();

	    $('#reclamacao-form-eraser').click(function() {
		clearForm($('#reclamacao-form-panel form').attr('action'), 
			  $('#txt-reclamacao-id').val() 
			  && $('#txt-reclamacao-id').val().length
			  ? $('#txt-reclamacao-id').val() : null);
	    });
	    // form submit
	    $('#reclamacao-form-panel form').submit(function(e) {
		e.preventDefault();
		var param = {
		    reclamacao: {
			nome: $('#txt-reclamacao-nome').val(),
			situacao: $('#lst-reclamacao-situacao').first(':selected').val(),
			apto: $('#txt-reclamacao-apto').val(),
			dt: $('#txt-reclamacao-dt').datepicker('getDate'),
			bloco: $('#txt-reclamacao-bloco').val(),
			resolvedor: $('#txt-reclamacao-resolvedor').val(),
			descricao: $('#txt-reclamacao-descricao').val()
		    }
		};
		var action = $('#reclamacao-form-panel form').attr('action');

		u[action](enumVerb[action].url,
	    		  param,
			  function() {
    			      listaReclamacoes();
	    		      clearForm();
			  });	
	    });
	    
	    // criar
	    $('#btn-new-reclamacao').click(function() { saveReclamacao('POST'); });

	    // listar
	    $('a[href="#autorizados"]').click(listaReclamacoes);
	}
    };
});

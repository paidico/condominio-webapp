define(['utils', 'jquery', 'datepicker'], function(u, $) {
    var enumVerb = {
	PUT: { keepId: true },
	POST: { url: 'api/funcionarios' }
    };

    var saveFuncionario = function(action) {
	if(!enumVerb[action]) {
	    u.alert('danger', 'Ação desconhecida a ser enviada para o serviço');
	    return;
	}

	setTimeout(function() { 
	    enumVerb['PUT'].url = 'api/funcionarios/' + $('#txt-funcionario-id').val();
	}, 800);
	clearForm(action, enumVerb[action].keepId);

	$('#funcionario-form-panel').removeClass('hidden');

    };
    var removeFuncionario = function(id, callback, callthis) {

	u['DELETE']('api/funcionarios/' + id,
		    null,
		    function() {
			if(callback && typeof callback === 'function') {
			    callback.call(callthis);
			}
		    });	
    };

    var clearForm = function(action, id) {

	$('#funcionario-form-panel').addClass('hidden');
	$('#funcionario-form-panel form')[0].reset();
	$('#img-funcionario-thumb').attr('src', 'images/picture.png');

	$('#funcionario-form-panel form').attr('action', action);
	$('#txt-funcionario-id').val(id);
    };

    var fillForm = function(funcionario) {
	$('#funcionario-form-panel').removeClass('hidden');
	$('#txt-funcionario-id').val(funcionario._id);
	$('#txt-funcionario-nome').val(funcionario.nome);
	$('#txt-funcionario-cpf').val(funcionario.cpf);
	$('#txt-funcionario-end').val(funcionario.endereco);
	if(funcionario.dtNascimento) {
	    $('#txt-funcionario-dtnasc').val(u.reformatDate(funcionario.dtNascimento, 'dd/mm/yy'));
	}
	if(funcionario.dtContratacao) {
	    $('#txt-funcionario-dtadmiss').val(u.reformatDate(funcionario.dtContratacao, 'dd/mm/yy'));
	}
	if(funcionario.dtDemissao) {
	    $('#txt-funcionario-dtdemiss').val(u.reformatDate(funcionario.dtDemissao, 'dd/mm/yy'));
	}
	if(funcionario.tel) {
	    $('#txt-funcionario-tel-res').val(funcionario.tel.residencial);
	    $('#txt-funcionario-tel-cel').val(funcionario.tel.movel);
	}
	$('#txt-funcionario-email').val(funcionario.email);
	$('#txt-funcionario-obs').val(funcionario.obs);
	$('#img-funcionario-thumb').attr('src', funcionario.foto || 'images/picture.png');
    };

    var populateFuncionario = function(funcionario) {

	$('#panel-funcionarios-table > table tbody')
	    .append($('<tr>')
		    // nome
		    .html($('<td>').html(funcionario.nome))
		    // cpf
		    .append($('<td>').html(funcionario.cpf))
		    // admissão
		    .append($('<td>')
			    .html(funcionario.dtContratacao 
				  ? u.reformatDate(funcionario.dtContratacao, "dd-M-yy")
				  : ''))
		    // demissão
		    .append($('<td>')
			    .html(funcionario.dtDemissao 
				  ? u.reformatDate(funcionario.dtDemissao, "dd-M-yy")
				  : ''))
		    // nascimento
		    .append($('<td>')
			    .html(funcionario.dtNascimento 
				  ? u.reformatDate(funcionario.dtNascimento, "dd-M-yy")
				  : ''))
		    // email
		    .append($('<td>').html($('<a>')
					   .attr('href', 'mailto:' + funcionario.email)
					   .html(funcionario.email)))
		    // ações (editar / apagar)
		    .append($('<td>').html($('<div>')
					   .addClass('btn-group btn-group-xs pull-right')
					   .attr({ 'role': 'group', 'aria-label': '...' })
					   .html($('<button>')
						 .click(function() {
						     saveFuncionario('PUT');
						     fillForm(funcionario);
						 })
						 .addClass('btn btn-default')
						 .attr('type', 'button')
						 .html($('<i>').addClass('fa fa-pencil-square-o'))
						 .append('&nbsp;Editar'))
					   .append($('<button>')
						   .click(function() {
						       removeFuncionario(funcionario._id, 
									 $(this).closest('tr').remove, 
									 $(this).closest('tr'));
						   })
						   .addClass('btn btn-danger')
						   .attr('type', 'button')
						   .html($('<i>').addClass('fa fa-trash-o'))
						   .append('&nbsp;Excluir')))));
    };
    var listaFuncionarios = function() {

	$('#panel-funcionarios-table > table tbody').empty();

	u['GET']('api/funcionarios',
		 null, // param
		 null, // success
		 null, // fail
		 function(retorno) {
		     if(!retorno) {
	    		 u.alert('danger', 'Serviço não retornou informação');
			 return;
		     }
		     if(retorno.sucesso 
			&& retorno.funcionarios 
			&& retorno.funcionarios instanceof Array) {
			 retorno.funcionarios.slice().forEach(populateFuncionario);
			 return;
		     }
		     u.alert('warning', retorno.msg);
		 });	
    };
    return {
	bind: function() {
	    // search
	    $('#panel-funcionarios form').submit(function(e) {
		e.preventDefault();

		u['POST']('api/funcionarios/search',
			  { termo: $('#search-funcionarios').val() },
			  function(retorno) {
			      if(retorno.funcionarios 
				 && retorno.funcionarios instanceof Array
				 && retorno.funcionarios.length) {
				  $('#panel-funcionarios-table > table tbody').empty();
				  retorno.funcionarios.slice().forEach(populateFuncionario);
			      } else {
				  u.alert('warning', 'Busca não retornou resultados');
			      }
			  });
	    });

	    // form
	    $('#txt-funcionario-dtnasc').datepicker();
	    $('#txt-funcionario-dtadmiss').datepicker();
	    $('#txt-funcionario-dtdemiss').datepicker();
	    $('#funcionario-form-eraser').click(function() {
		clearForm($('#funcionario-form-panel form').attr('action'), 
			  $('#txt-funcionario-id').val() 
			  && $('#txt-funcionario-id').val().length
			  ? $('#txt-funcionario-id').val() : null);
	    });
	    // form image
	    $('#img-funcionario').change(function() { u.thumbImagem(this); });
	    // form submit
	    $('#funcionario-form-panel form').submit(function(e) {
		e.preventDefault();
		var param = {
		    funcionario: {
			nome: $('#txt-funcionario-nome').val(),
			cpf: $('#txt-funcionario-cpf').val(),
			endereco: $('#txt-funcionario-end').val(),
			dtNascimento: $('#txt-funcionario-dtnasc').datepicker('getDate'),
			dtContratacao: $('#txt-funcionario-dtadmiss').datepicker('getDate'),
			dtDemissao: $('#txt-funcionario-dtdemiss').datepicker('getDate'),
			tel: {
			    residencial: $('#txt-funcionario-tel-res').val(),
			    movel: $('#txt-funcionario-tel-cel').val()
			},
			email: $('#txt-funcionario-email').val(),
			obs: $('#txt-funcionario-obs').val()
		    }
		};
		var foto = $('#img-funcionario-thumb').attr('src');
		var action = $('#funcionario-form-panel form').attr('action');
		param.funcionario.foto = /^data:image\//.test(foto) ? foto : null;

		u[action](enumVerb[action].url,
	    		  param,
			  function() {
    			      listaFuncionarios();
	    		      clearForm();
			  });	
	    });
	    
	    // criar
	    $('#btn-new-funcionario').click(function() { saveFuncionario('POST'); });

	    // listar
	    $('a[href="#funcionarios"]').click(listaFuncionarios);
	}
    };
});

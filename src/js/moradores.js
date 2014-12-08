define(['utils', 'jquery', 'datepicker'], function(u, $) {
    var enumVerb = {
	PUT: { keepId: true },
	POST: { url: 'api/moradores' }
    };

    var saveMorador = function(action) {
	if(!enumVerb[action]) {
	    u.alert('danger', 'Ação desconhecida a ser enviada para o serviço');
	    return;
	}

	setTimeout(function() { 
	    enumVerb['PUT'].url = 'api/moradores/' + $('#txt-morador-id').val();
	}, 800);
	clearForm(action, enumVerb[action].keepId);

	$('#morador-form-panel').removeClass('hidden');

    };
    var removeMorador = function(id, callback, callthis) {

	u['DELETE']('api/moradores/' + id,
		    null,
		    function() {
			if(callback && typeof callback === 'function') {
			    callback.call(callthis);
			}
		    });	
    };

    var clearForm = function(action, id) {

	$('#morador-form-panel').addClass('hidden');
	$('#morador-form-panel form')[0].reset();
	$('#img-morador-thumb').attr('src', 'images/picture.png');

	$('#morador-form-panel form').attr('action', action);
	$('#txt-morador-id').val(id);
    };

    var fillForm = function(morador) {
	$('#morador-form-panel').removeClass('hidden');
	$('#txt-morador-id').val(morador._id);
	$('#txt-morador-nome').val(morador.nome);
	$('#txt-morador-cpf').val(morador.cpf);
	$('#txt-morador-apto').val(morador.apto);
	$('#txt-morador-bloco').val(morador.bloco);
	if(morador.dtNascimento) {
	    $('#txt-morador-dtnasc').val(u.reformatDate(morador.dtNascimento, 'dd/mm/yy'));
	}
	if(morador.tel) {
	    $('#txt-morador-tel-res').val(morador.tel.residencial);
	    $('#txt-morador-tel-cel').val(morador.tel.movel);
	    $('#txt-morador-tel-com').val(morador.tel.comercial);
	}
	$('#txt-morador-email').val(morador.email);
	$('#txt-morador-obs').val(morador.obs);
	$('#img-morador-thumb').attr('src', morador.foto || 'images/picture.png');
    };

    var populateMorador = function(morador) {
	$('#panel-moradores-table > table tbody')
	    .append($('<tr>')
		    // nome
		    .html($('<td>').html(morador.nome))
		    // cpf
		    .append($('<td>').html(morador.cpf))
		    // bloco
		    .append($('<td>').html(morador.bloco))
		    // apto
		    .append($('<td>').html(morador.apto))
		    // nascimento
		    .append($('<td>')
			    .html(morador.dtNascimento 
				  ? u.reformatDate(morador.dtNascimento, "dd-M-yy")
				  : ''))
		    // email
		    .append($('<td>').html($('<a>')
					   .attr('href', 'mailto:' + morador.email)
					   .html(morador.email)))
		    // ações (editar / apagar)
		    .append($('<td>').html($('<div>')
					   .addClass('btn-group btn-group-xs pull-right')
					   .attr({ 'role': 'group', 'aria-label': '...' })
					   .html($('<button>')
						 .click(function() {
						     saveMorador('PUT');
						     fillForm(morador);
						     location.href = '#moradores';

						 })
						 .addClass('btn btn-default')
						 .attr('type', 'button')
						 .html($('<i>').addClass('fa fa-pencil-square-o'))
						 .append('&nbsp;Editar'))
					   .append($('<button>')
						   .click(function() {
						       removeMorador(morador._id, 
								     $(this).closest('tr').remove, 
								     $(this).closest('tr'));
						   })
						   .addClass('btn btn-danger')
						   .attr('type', 'button')
						   .html($('<i>').addClass('fa fa-trash-o'))
						   .append('&nbsp;Excluir')))));
    };
    var listaMoradores = function() {
	$('#panel-moradores-table > table tbody').empty();

	u['GET']('api/moradores',
		 null, // param
		 null, // success
		 null, // fail
		 function(retorno) {
		     if(!retorno) {
	    		 u.alert('danger', 'Serviço não retornou informação');
			 return;
		     }
		     if(retorno.sucesso 
			&& retorno.moradores 
			&& retorno.moradores instanceof Array) {
			 retorno.moradores.slice().forEach(populateMorador);
			 return;
		     }
		     u.alert('warning', retorno.msg);
		 });	
    };
    return {
	bind: function() {
	    // search
	    $('#panel-moradores form').submit(function(e) {
		e.preventDefault();

		u['POST']('api/moradores/search',
			  { termo: $('#search-moradores').val() },
			  function(retorno) {
			      if(retorno.moradores 
				 && retorno.moradores instanceof Array
				 && retorno.moradores.length) {
				  $('#panel-moradores-table > table tbody').empty();
				  retorno.moradores.slice().forEach(populateMorador);
				  location.href = '#panel-moradores-table';
			      } else {
				  u.alert('warning', 'Busca não retornou resultados');
			      }
			  });
	    });

	    // form
	    $('#txt-morador-dtnasc').datepicker();
	    $('#morador-form-eraser').click(function() {
		clearForm($('#morador-form-panel form').attr('action'), 
			  $('#txt-morador-id').val() 
			  && $('#txt-morador-id').val().length
			  ? $('#txt-morador-id').val() : null);
	    });
	    // form image
	    $('#img-morador').change(function() { u.thumbImagem(this); });
	    // form submit
	    $('#morador-form-panel form').submit(function(e) {
		e.preventDefault();

		var param = {
		    morador: {
			nome: $('#txt-morador-nome').val(),
			cpf: $('#txt-morador-cpf').val(),
			apto: $('#txt-morador-apto').val(),
			bloco: $('#txt-morador-bloco').val(),
			dtNascimento: $('#txt-morador-dtnasc').datepicker('getDate'),
			tel: {
			    residencial: $('#txt-morador-tel-res').val(),
			    movel: $('#txt-morador-tel-cel').val(),
			    comercial: $('#txt-morador-tel-com').val()
			},
			email: $('#txt-morador-email').val(),
			obs: $('#txt-morador-obs').val()
		    }
		};
		var foto = $('#img-morador-thumb').attr('src');
		var action = $('#morador-form-panel form').attr('action');
		param.morador.foto = /^data:image\//.test(foto) ? foto : null;

		u[action](enumVerb[action].url,
	    		  param,
			  function() {
    			      listaMoradores();
	    		      clearForm();
			  });	
		
	    });
	    
	    // criar
	    $('#btn-new-morador').click(function() { saveMorador('POST'); });

	    // listar
	    $('a[href="#moradores"]').click(listaMoradores);
	}
    };
});

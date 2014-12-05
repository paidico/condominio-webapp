define(['utils', 'jquery', 'datepicker'], function(u, $) {

    var saveMorador = function(action, callback) {
	var enumVerb = {
	    PUT: {
		url: 'api/moradores/' + $('#txt-morador-id').val(),
		keepId: true
	    },
	    POST: { url: 'api/moradores' }
	};
	if(!enumVerb[action]) {
	    u.alert('danger', 'Ação desconhecida a ser enviada para o serviço');
	    return;
	}

	clearForm(action, enumVerb[action].keepId);

	$('#morador-form-panel').removeClass('hidden');

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
			comercial: $('#txt-morador-tel-com').val(),
		    },
		    email: $('#txt-morador-email').val(),
		    obs: $('#txt-morador-obs').val()
		}
	    };
	    param.morador.foto = $('#img-morador-thumb').attr('src');
	    u[action](enumVerb[action].url,
	    	      param,
	    	      function(retorno) {
	    		  if(retorno.sucesso) {
	    		      clearForm();
	    		      u.alert('success', retorno.msg);
    			      listaMoradores();
	    		      if(callback && typeof callback === 'function') {
	    			  callback();
	    		      }
	    		      return;
	    		  }
	    		  u.alert('warning', retorno.msg);
	    	      },
	    	      function() {
	    		  u.alert('danger', retorno.msg);
	    	      });	
	});
    };
    var removeMorador = function(id, callback, callthis) {

	u['DELETE']('api/moradores/' + id,
		    null,
		    function(retorno) {
			if(retorno.sucesso) {
			    u.alert('success', retorno.msg);
			    if(callback && typeof callback === 'function') {
				callback.call(callthis);
			    }
			    return;
			}
			u.alert('warning', retorno.msg);
		    },
		    function() {
			u.alert('danger', retorno.msg);
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
	$('#txt-morador-dtnasc').val(u.reformatDate(morador.dtNascimento, 'dd/mm/yy'));
	if(morador.tel) {
	    $('#txt-morador-tel-res').val(morador.tel.residencial);
	    $('#txt-morador-tel-cel').val(morador.tel.movel);
	    $('#txt-morador-tel-com').val(morador.tel.comercial);
	}
	$('#txt-morador-email').val(morador.email);
	$('#txt-morador-obs').val(morador.obs);
	$('#img-morador-thumb').attr('src', morador.foto);
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
				  ? u.reformatDate(morador.dtNascimento, "dd-MM-yy")
				  : '----'))
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
		 null,
		 function(retorno) {
		     if(retorno.sucesso 
			&& retorno.moradores 
			&& retorno.moradores instanceof Array) {
			 retorno.moradores.slice().forEach(populateMorador);
			 return;
		     }
		     u.alert('warning', retorno.msg);
		 },
		 function() {
		     u.alert('danger', retorno.msg);
		 });	
    };
    return {
	bind: function() {
	    // search
	    $('#panel-moradores form').submit(function(e) {
		e.preventDefault();
		console.log($('#search-moradores').val());
	    });

	    // form
	    $('#txt-morador-dtnasc').datepicker();
	    $('#morador-form-eraser').click(function() {
		clearForm($('#morador-form-panel form').attr('action'), 
			  $('#txt-morador-id').val() && $('#txt-morador-id').val().length);
	    });
	    // form image
	    $('#img-morador').change(function() { u.thumbImagem(this); });
	    
	    // criar
	    $('#btn-new-morador').click(function() { saveMorador('POST'); });

	    // listar
	    $('a[href="#moradores"]').click(listaMoradores);
	}
    };
});

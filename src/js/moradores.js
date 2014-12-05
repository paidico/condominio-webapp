define(['utils', 'jquery', 'datepicker'], function(u, $) {

    var removeMorador = function(id, callback, callthis) {

	u.aDelete('api/moradores/' + id,
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

	u.aGet('api/moradores',
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
	    $('#morador-form-eraser').click(function(e) {
		e.preventDefault();
		$(this).closest('form')[0].reset();
		$('#img-morador-thumb').attr('src', 'images/picture.png');
	    });

	    // form image
	    $('#img-morador').change(function() { u.thumbImagem(this); });
	    
	    // criar
	    $('#btn-new-morador').click(function(e) {
		e.preventDefault();
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
		    u.serializeImagem(document.getElementById('img-morador'), function(blob) {
			param.morador.foto = blob;
			u.aPost('api/moradores',
				param,
				function(retorno) {
				    if(retorno.sucesso) {
					$('#morador-form-panel').addClass('hidden');
					$('#morador-form-panel form')[0].reset();
					$('#img-morador-thumb').attr('src', 'images/picture.png');
					u.alert('success', retorno.msg);
					listaMoradores();
					return;
				    }
				    u.alert('warning', retorno.msg);
				},
				function() {
				    u.alert('danger', retorno.msg);
				});	
		    });
		});
	    });

	    // listar
	    $('a[href="#moradores"]').click(listaMoradores);
	}
    };
});

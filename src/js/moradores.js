define(['utils', 'jquery', 'datepicker'], function(u, $) {

    var validateImagem = function(callback) {
	if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
	    u.alert('danger', 'Navegador não suporta recurso solicitado');
	    return;
	}    
	if( !$('#img-morador').val()) {            
	    return;
	}
	var img = $('#img-morador')[0].files[0];
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
	    u.alert('danger', 'Tipo de arquivo não suportado');
	    return;
	}
	
	// 4 MB eq 4.194.304
	if(fsize > 4194304) {
	    u.alert('danger', 'Tamanho da imagem excede o limite');
	    return;
	}

	callback(img);
    };

    var getImagem = function(callback) {
	validateImagem(function(img) {
	    var reader = new FileReader();
	    reader.addEventListener('load', function(ev) {
		callback(ev.target.result);
	    });
	    reader.readAsBinaryString(img);
	});
    };
    var handleImagem = function() {
	validateImagem(function(img) {
	    var reader = new FileReader();
	    reader.addEventListener('load', function(ev) {
		$('#img-morador-thumb').attr('src', ev.target.result);
	    });
	    reader.readAsDataURL(img);
	});
    };
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

	    // form image
	    $('#img-morador').change(handleImagem);
	    
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
			    email: $('#txt-morador-email').val()
			}
		    };
		    getImagem(function(blob) {
			param.morador.foto = blob;
			u.aPost('api/moradores',
				param,
				function(retorno) {
				    if(retorno.sucesso) {
					$('#morador-form-panel').addClass('hidden');
					$('#morador-form-panel form')[0].reset();
					$('#img-morador-thumb').attr('src', 'images/picture.png');
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
		    });
		});
	    });

	    // listar
	    $('a[href="#moradores"]').click(listaMoradores);
	}
    };
});

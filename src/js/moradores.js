define(['utils', 'jquery-ui'], function(u, jqui) {
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
    return {
	bind: function() {

	    // form
	    jqui('#txt-morador-dtnasc').datepicker();

	    // criar
	    $('#btn-new-morador').click(function(e) {
		e.preventDefault();
		$('#morador-form-panel').removeClass('hidden');
		$('#morador-form-panel form').submit(function(e) {
		    e.preventDefault();
		    u.alert('warning', 'Implementação ainda em andamento');
		});
	    });

	    // listar
	    $('a[href="#moradores"]').click(function() {
		var listaMoradores = [];
		$('#panel-moradores-table > table tbody').empty();


		$('#panel-moradores form').submit(function(e) {
		    e.preventDefault();
		    console.log($('#search-moradores').val());
		});

		u.aGet('api/moradores',
		       null,
		       function(retorno) {
			   if(retorno.sucesso 
			      && retorno.moradores 
			      && retorno.moradores instanceof Array) {
			       (listaMoradores = retorno.moradores.slice())
				   .forEach(populateMorador);
			       return;
			   }
			   u.alert('warning', retorno.msg);
		       },
		       function() {
			   u.alert('danger', retorno.msg);
		       });	
	    });
	}
    };
});
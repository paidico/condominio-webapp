define(['utils', 'jquery'], function(u, $) {

    var populateUsuario = function(usuario) {

	$('#panel-usuarios-table > table tbody')
	    .append($('<tr>')
		    // username
		    .html($('<td>').html(usuario.username))
		    // tipo
		    .append($('<td>').html(usuario.tipo))
		    // ativo
		    .append($('<td>').html((usuario.ativo ? 'SIM' : 'NÃO')))
		    // ações (ativar / desativar)
		    .append($('<td>').html($('<button>')
		    			   .click(function() {
		    			       usuario.ativo = !usuario.ativo;
		    			       var url = 'api/usuarios/' + usuario._id;
		    			       u['PUT'](url, { usuario: usuario }, listaUsuarios);
					   })
					   .addClass('btn btn-default')
					   .attr('type', 'button')
					   .html($('<i>')
		    				 .addClass('fa fa-toggle-' + (usuario.ativo ? 'off' : 'on'))))));

    };
    var listaUsuarios = function() {

	$('#panel-usuarios-table > table tbody').empty();

	u['GET']('api/usuarios',
		 null, // param
		 null, // success
		 null, // fail
		 function(retorno) {
		     if(!retorno) {
	    		 u.alert('danger', 'Serviço não retornou informação');
			 return;
		     }
		     if(retorno.sucesso 
			&& retorno.usuarios 
			&& retorno.usuarios instanceof Array) {
			 retorno.usuarios.slice().forEach(populateUsuario);
			 return;
		     }
		     u.alert('warning', retorno.msg);
		 });	
    };
    return {
	bind: function() {
	    // listar
	    $('a[href="#usuarios"]').click(listaUsuarios);
	}
    };
});

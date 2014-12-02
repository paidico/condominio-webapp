define(['utils'], function(u) {
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
			.append($('<td>').html(morador.apto)));
};
    return {
	bind: function() {
	    // moradores
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
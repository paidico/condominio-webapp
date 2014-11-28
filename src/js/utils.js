define(['jquery'], function(jq) {
    return {
	toggleHide: function() { 
	    // seletores como argumento
	    // faz toggle se elemento do seletor[0] estiver oculto
	    var args = Array.prototype.slice.call(arguments);
	    if(args.length && jq(args[0]).hasClass('hidden')) {
		for(var i = 0; i < args.length; i++) {
		    jq(args[i]).toggleClass('hidden');
		    console.log('toggle ::: ' + args[i]);
		}
	    }
	},
	showTabByName: function(n) {
	    jq('ul[role="tablist"] a[href="#' + n + '"]').show('tab');
	}
    };
});
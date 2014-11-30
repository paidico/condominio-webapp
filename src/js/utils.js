define(['jquery'], function(jq) {
    return {
	toggleHide: function(pag) { 
	    [
		'#main-page', '#login-page', '#signup-page'
	    ].forEach(function(p) {
		jq(p).addClass('hidden');
	    });
	    jq(pag).removeClass('hidden');
	},
	showTabByName: function(n) {
	    jq('ul[role="tablist"] a[href="#' + n + '"]').show('tab');
	}
    };
});

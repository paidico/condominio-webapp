require.config({
    baseUrl: 'js',
    paths: {
        'jquery': 'jquery.min',
	'jquery-ui': 'jquery-ui.min'
    },
    shim: {
	'jquery-ui': {
	    export: '$',
	    deps: ['jquery']
	}
    }
});

require(['init']);

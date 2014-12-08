require.config({
    baseUrl: 'js',
    paths: {
        'jquery': 'jquery.min',
	'datepicker': 'jquery-ui.min',
	'datepicker/pt-BR': 'datepicker-pt-BR.min',
	'tab': 'bootstrap-tab.min',
	'alert': 'bootstrap-alert.min',
	'tooltip': 'bootstrap-tooltip.min'
    },
    shim: {
	'alert': {
	    deps: ['jquery'],
	    exports: '$.fn.alert'
	},
	'tab': {
	    deps: ['jquery'],
	    exports: '$.fn.tab'
	},
	'tooltip': {
	    deps: ['jquery'],
	    exports: '$.fn.tooltip'
	},
	'datepicker': {
	    deps: ['jquery'],
	    exports: '$.fn.datepicker'
	}
    }
});

require(['init']);

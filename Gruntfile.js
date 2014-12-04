
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
	'customize-bootstrap': {
	    main: {
		options: {
		    bootstrapPath: 'node_modules/bootstrap/',
		    src: 'src/less/custom/',
		    dest: 'src/less/'
		}
	    }
	},
	uglify: {
	    main: {
		files: 
		[
		    {
			expand: true,
			cwd: 'src/js',
			src: '**/*.js',
			dest: 'build/js'
		    }, 
		    {
			'build/js/datepicker-pt-BR.min.js': [ 'lib/jquery-ui/datepicker-pt-BR.js' ],
			'build/js/bootstrap-tab.min.js': [ 'node_modules/bootstrap/js/tab.js' ],
			'build/js/bootstrap-alert.min.js': [ 'node_modules/bootstrap/js/alert.js' ],
			'build/lib/require.min.js': [ 'node_modules/requirejs/require.js' ]
		    }
		]
	    }
	},
	less: {
	    main: {
		options: {
		    cleancss: true
		},
		files: {
		    'build/css/bootstrap.css': 'src/less/bootstrap.less',
		    'build/css/condominio.css': 'src/less/condominio.less'
		}
	    }
	},
	copy: {
	    main: {
		files: [
		    {
			expand: true, 
			flatten: true,
			src: [
			    'node_modules/jquery/dist/jquery.min.js', 
			    'lib/jquery-ui/jquery-ui.min.js'
			], 
			dest: 'build/js/',
			filter: 'isFile' 
		    }, {
			expand: true,
			flatten: true,
			src: ['node_modules/font-awesome/fonts/**'], 
			dest: 'build/fonts/',
			filter: 'isFile'
		    }, {
			expand: true,
			flatten: true,
			src: [
			    'node_modules/font-awesome/css/*.min.css',
			    'lib/jquery-ui/*.min.css'
			], 
			dest: 'build/css/',
			filter: 'isFile'
		    }, {
			expand: true,
			flatten: true,
			src: ['lib/jquery-ui/images/*.png'], 
			dest: 'build/css/images/',
			filter: 'isFile'
		    }
		]
	    }
	}
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-customize-bootstrap');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task.
    grunt.registerTask('default', ['customize-bootstrap', 'copy', 'less', 'uglify']);

};

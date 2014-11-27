/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
	'customize-bootstrap': {
	    yourTarget: {
		options: {
		    bootstrapPath: 'node_modules/bootstrap/',
		    src: 'app/assets/less/custom/',
		    dest: 'app/assets/less/'
		}
	    }
	},
	less: {
	    development: {
		options: {
		    paths: ['app/assets']
		},
		files: {
		    'app/assets/css/bootstrap.css': 'app/assets/less/bootstrap.less',
		    'app/assets/css/grump.css': 'app/assets/less/grump.less'
		}
	    },
	    production: {
		options: {
		    paths: ['app/assets'],
		    cleancss: true
		},
		files: {
		    'app/assets/css/bootstrap.css': 'app/assets/less/bootstrap.less'
		}
	    }
	},
	copy: {
	    main: {
		files: [
		    {
			expand: true, 
			flatten: true,
			src: ['node_modules/jquery/dist/*.min.js', 'node_modules/bootstrap/dist/js/*.min.js'], 
			dest: 'app/assets/js/',
			filter: 'isFile' 
		    }, {
			expand: true,
			flatten: true,
			src: ['node_modules/bootstrap/dist/fonts/**'], 
			dest: 'app/assets/fonts/',
			filter: 'isFile'
		    }
		]
	    }
	}
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-customize-bootstrap');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task.
    grunt.registerTask('default', ['customize-bootstrap', 'copy', 'less']);

};

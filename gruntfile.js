module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      united: {
        src: 'api/v<%= pkg.version %>/doc-docstrap/*.html'
      },
      baseline: {
        src: 'api/v<%= pkg.version %>/doc-baseline/*.html'
      }
    },
    jsdoc : {
      united: {
        src: ['source', 'README.md'],
        dest: 'api/v<%= pkg.version %>/doc-docstrap',
        options: {
          template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
          configure: 'jsdoc.conf.json',
          no_tutorials: 'tutorials',
          recurse: true
        }
      }
    },
    exec: {
      united: {
        command: 'node_modules\\.bin\\jsdoc -d api/v<%= pkg.version %>/doc-docstrap -c jsdoc.conf.json -t node_modules/ink-docstrap/template -u tutorials -r source README.md'
      },
      baseline: {
        command: 'node_modules\\.bin\\jsdoc -d api/v<%= pkg.version %>/doc-baseline -t node_modules/jsdoc-baseline -r source'
      }
    }
  });

  // Load the plugin that cleans directories.
  grunt.loadNpmTasks('grunt-remove-plus-remove-empty');

  // Load the plugin that provides the jsdoc task.
  grunt.loadNpmTasks('grunt-jsdoc');

  // Load the plugin that runs commands.
  grunt.loadNpmTasks('grunt-exec');

  // Default task(s).
  grunt.registerTask('docstrap', ['clean:united',   'jsdoc:united']);
  grunt.registerTask('united',   ['clean:united',   'exec:united']);
  grunt.registerTask('baseline', ['clean:baseline', 'exec:baseline']);
};

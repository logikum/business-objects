module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    clean: {
      united: {
        src: 'doc-docstrap/*.html'
      },
      baseline: {
        src: 'doc-baseline/*.html'
      }
    },
    jsdoc : {
      united: {
        src: ['README.md', 'source/**/*.js'],
        dest: 'doc-docstrap',
        options: {
          template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
          configure: 'jsdoc.conf.json',
          tutorials: 'tutorials'
        }
      }
    },
    exec: {
      baseline: {
        command: 'node_modules\\.bin\\jsdoc -d doc-baseline -t node_modules/jsdoc-baseline -r source'
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
  grunt.registerTask('docstrap', ['clean:united', 'jsdoc:united']);
  grunt.registerTask('baseline', ['clean:baseline', 'exec:baseline']);
};

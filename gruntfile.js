module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jsdoc : {
      dist : {
        src: ['README.md', 'source/*.js', 'source/data-types/*.js', 'source/common-rules/*.js'],
        options: {
          destination: 'documentation',
          template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
          configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
        }
      }
    }
  });

  // Load the plugin that provides the jsdoc task.
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task(s).
  grunt.registerTask('default', ['jsdoc']);
};

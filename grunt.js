module.exports = function (grunt) {
  grunt.initConfig({
    min: {
      'morris.min.js': 'morris.js'
    },
  });
  grunt.registerTask('default', 'min');
};

'@namespace clean';

/* Cleanup Development dir before rebuild */
var devl = [ '.tmp/public/**' ];

/* Cleanup Production dir before rebuild */
var prod = [ 'www' ];

/* Loading NPM Task */
grunt.loadNpmTasks('grunt-contrib-clean');
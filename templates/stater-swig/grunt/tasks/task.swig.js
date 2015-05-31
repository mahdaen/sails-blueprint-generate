/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

'@namespace swig';

/* Swig Options */
var options = {
    data : load('config/stater')
}

/* Development */
var prod = {
    expand : true,
    cwd    : 'views',
    dest   : 'build',
    src    : [ '**/*.html' ],
    ext    : '.html'
}

/* Loadin NPM Task */
grunt.loadNpmTasks('grunt-swig-templates');
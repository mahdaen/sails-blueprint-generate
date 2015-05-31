/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

'@namespace prettify';

/* Prettify Option */
var options = {
    indent : 4
}

/* Production */
var prod = {
    expand : true,
    cwd    : 'build',
    ext    : '.html',
    src    : '**/*.html',
    dest   : 'build'
}

/* Loading NPM Task */
grunt.loadNpmTasks('grunt-prettify');
/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

'@namespace sync';

/* Syncronize Fonts */
var fonts = {
    files           : [
        {
            cwd  : 'public/fonts',
            src  : [ '**' ],
            dest : 'build/fonts'
        }
    ],
    verbose         : true,
    updateAndDelete : true
}

/* Syncronize Images */
var images = {
    files           : [
        {
            cwd  : 'public/images',
            src  : [ '**' ],
            dest : 'build/images'
        }
    ],
    verbose         : true,
    updateAndDelete : true
}

/* Syncronize Icons */
var icons = {
    files           : [
        {
            cwd  : 'public/icons',
            src  : [ '**' ],
            dest : 'build/icons'
        }
    ],
    verbose         : true,
    updateAndDelete : true
}

/* Loading NPM Task */
grunt.loadNpmTasks('grunt-sync');
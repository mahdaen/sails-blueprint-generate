'@namespace sync';

/* Syncronize Fonts */
var fonts = {
    files           : [
        {
            cwd  : 'public/fonts',
            src  : [ '**' ],
            dest : '.tmp/public/fonts'
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
            dest : '.tmp/public/images'
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
            dest : '.tmp/public/icons'
        }
    ],
    verbose         : true,
    updateAndDelete : true
}

/* Productions */
var prod = {
    files : [
        {
            cwd  : '.tmp/public',
            src  : [ '**' ],
            dest : 'www/public'
        }
    ]
}

/* Loading NPM Task */
grunt.loadNpmTasks('grunt-sync');
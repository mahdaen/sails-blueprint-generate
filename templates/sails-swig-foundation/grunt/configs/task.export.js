'@namespace exports';

/* Javascript Libraries */
var libs = {
    options : {
        verbose : true
    },
    files   : {
        '.tmp/public/scripts' : 'public/scripts/com.libs.js'
    }
}

/* Application Scripts */
var apps = {
    options : {
        verbose : true
    },
    files   : {
        '.tmp/public/scripts' : 'public/scripts/com.apps.js'
    }
}

/* Loading NPM Task */
grunt.loadNpmTasks('grunt-export');
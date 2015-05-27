/* Configuring Watcher */
config.watch = {
    /* Grunt Watch Options */
    options : {
        livereload : 9090
    },

    /* Watch public folder changes to support livereload */
    public  : {
        files : [ '.tmp/**' ]
    },
}

/* Loading Task */
grunt.loadNpmTasks('grunt-contrib-watch');
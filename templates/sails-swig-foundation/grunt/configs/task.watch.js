/* Configuring Watcher */
config.watch = {
    /* Grunt Watch Options */
    options : {
        livereload : $$RELOAD$$
    },

    /* Watch public folder changes to support livereload */
    public  : {
        files : [ '.livereload' ]
    },
}

/* Loading Task */
grunt.loadNpmTasks('grunt-contrib-watch');

/* Livereload Hook */
grunt.registerTask('livereload', function() {
    var file = require('fs');
    var done = this.async();

    file.writeFileSync('.livereload', new Date());

    done(true);
});
/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

/* Getting Runtime Flags */
var args = process.argv;
var earg = args.slice(3).join(' ');
var flog = '-l ' + root + '/logs/foreverlog.log -a';

if ( args.indexOf('--debug') > -1 ) {
    flog += ' --verbose';
}
else {
    flog = '';
}

/* Configuring Watcher */
config.watch = {
    /* Grunt Watch Options */
    options : {
        livereload : core.reloadport
    },

    /* Static Files will reload browser directly */
    static  : {
        files : [ '!.idea', '!build', '!node_modules', 'public/!(styles)', 'views/**' ]
    },

    /* Stylesheets */
    styles  : {
        files : [ '!.idea', '!build', '!node_modules', 'public/styles/**/*.scss' ],
        tasks : [ 'sass:devl' ]
    },

    /* Server Files will reload browser afrer rebooting server */
    server  : {
        files : [ '!.idea', '!build', '!node_modules', 'model/**', 'config/**', 'app.js' ],
        tasks : [ 'reboot' ]
    }
}

/* Loading Task */
grunt.loadNpmTasks('grunt-contrib-watch');

/* Livereload Hook */
grunt.registerTask('reboot', function () {
    var done = this.async(),
        sudo = require('child_process').exec;

    sudo('cd ' + root + ' && forever ' + flog + ' restart app.js ' + earg, function (err, std) {
        if ( err ) {
            console.log(err);
            done(false);
        }
        else {
            console.log(std);

            setTimeout(function () {
                done(true);
            }, 400);
        }
    });
});
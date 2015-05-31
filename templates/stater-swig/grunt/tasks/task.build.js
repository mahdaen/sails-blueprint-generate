/* Building Javascripts */
grunt.registerTask('build', function (grunt) {
    var core = require(root + '/app.js'),
        sudo = require('child_process').exec,
        fsex = require('fs-extra'),
        done = this.async(),
        swig = require('swig');

    /* Change the Environment */
    core.env = 'production';

    /* HTML Renderer */
    var render = function () {
        if ( core.router.length > 0 ) {
            var route = core.router[ 0 ],
                cpath = route.path, opath = route.path;

            if ( cpath === '/' || cpath === '' ) {
                cpath = '/home';

                /* Reduce Router */
                core.router = core.router.slice(1);

                render();

                return;
            }

            core.logs.info('⦿ ' + cpath, true);

            cpath = cpath.replace(/^\//, '').replace('/', '.');

            /* Find data related with path */
            if ( cpath in core && core.meta ) {
                Object.keys(core.meta).forEach(function (key) {
                    if ( key in core[ cpath ] ) {
                        core.meta[ key ] = core[ cpath ][ key ];
                    }
                });
            }

            /* Reduce Router */
            core.router = core.router.slice(1);

            /* Render HTML */
            var html = swig.render(file.readFileSync(route.view, 'utf8'), { filename : route.view, locals : core });

            if ( html ) {
                fsex.ensureFileSync('build/' + route.view.replace(/views\//, ''));
                file.writeFileSync('build/' + route.view.replace(/views\//, ''), html);

                render();
            }
        }
        else {
            /* Final Steps */
            core.logs.info('Compiling rendered HTML files and syncing assets.', true);

            sudo('grunt prettify && grunt assets', function (err, std) {
                if ( err ) {
                    core.logs.warn(err, true);
                    done(false);
                }
                else {
                    /* Compiling Javascripts */
                    var scriptstr = '', stylestr = '';

                    core.assets.scripts.forEach(function (scr, i) {
                        scriptstr += "'@import " + "$root/public/" + scr + "';\r\n";
                    });
                    core.assets.styles.forEach(function (stl, i) {
                        stylestr += "@import " + "'public/" + stl.replace(/\.css$/, '') + "';\r\n";
                    });

                    file.writeFileSync('.tmp/prod.js', scriptstr);
                    file.writeFileSync('.tmp/prod.scss', stylestr);

                    core.logs.info('Minifying javascript and css files.', true);

                    imports('.tmp/prod.js', {
                        exec      : false,
                        export    : true,
                        exportDir : 'build/scripts'
                    });

                    sudo('grunt sass && rm -Rf .tmp', function (err, std) {
                        if ( err ) {
                            core.logs.warn(err, true);
                            done(false);
                        }
                        else {
                            core.logs.info('Build process finished without error.', true);
                            done(true);
                        }
                    });
                }
            });
        }
    }

    /* Cleanup Destination Dir Before Build */
    core.logs.info('Cleaning up destination folder before build.', true);

    sudo('rm -Rf build && mkdir build && rm -Rf .tmp && mkdir .tmp', function (err, std) {
        if ( err ) {
            core.logs.warn(err, true);
            done(false);
        }
        else {
            /* Rendering HTMLs based on Router */
            core.logs.info('Rendering HMTL files based on routers.', true);
            render();
        }
    });
});
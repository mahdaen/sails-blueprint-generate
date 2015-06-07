/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

//!nonative

/* Loading Dependencies and Configurations */
var express = require('express'),
    compres = require('compression'),
    config  = require('./core/stater'),
    sudo    = require('child_process').exec,
    file    = require('fs'),
    Gaze    = require('gaze'),
    find    = require('glob'),
    sass    = require('node-sass'),
    load    = require('gulp-livereload'),
    root    = __dirname,
    swig    = require('swig');

/* Creating Swig Renderer */
var render = swig.renderFile;

/* Getting Runtime Arguments */
var cliArg = process.argv;
var clflag = cliArg.slice(3).join(' ');
var debugs = config.debug;

/* Configuring Swig */
swig.setDefaults({ cache : false });

if ( config.env === 'production' && config.cached ) {
    swig.setDefaults({ cache : 'memory' });
}

/* Adding Filters to Swig */
Object.keys(config.filter).forEach(function (filter) {
    swig.setFilter(filter, config.filter[ filter ]);
});

/* Start Server only if "start" argument is defined */
var initStater = false;

if ( cliArg && cliArg.length >= 3 ) {
    if ( cliArg[ 2 ] === 'start' ) {
        var port = config.port;

        /* Getting Custom Port */
        cliArg.forEach(function (arg) {
            if ( arg.search('--port=') > -1 ) {
                port = Number(arg.replace('--port=', '').replace(/[\'\"]+/g, ''));
            }
        });

        initStater = true;
    }
}

/* Router Reloader */
var reloadRouters = function () {
    delete require.cache[ require.resolve('./core/router') ];
    var rtr = require('./core/router');

    config.router = rtr.lists;
    config.menus = rtr.menus;
}

/* Model Reloader */
var reloadModel = function () {
    /* Collecting Models */
    var models = find.sync('model/**/*.js');

    /* Binding Models to Configuration Data */
    models.forEach(function (name) {
        /* Getting Model Name */
        var modelName = name.replace('model/', '').replace(/\//g, '.').replace(/\.js$/, '');

        /* Getting Model Data */
        try {
            delete require.cache[ require.resolve('./' + name) ];

            var data = require('./' + name);

            if ( data ) {
                config.model.set(modelName, data);

                if ( data.$name && config.menus.get(modelName) ) {
                    config.menus.set(modelName + '.$name', data.$name);
                }
            }
        }
        catch ( err ) {
            config.logs.warn(err);
        }
    });
}

if ( initStater ) {
    /* Creating New Host */
    var app = express();

    /* Enable Express Compression */
    if ( config.env === 'production' ) {
        app.use(compres({
            filter : function (req, res) {
                if ( req.headers[ 'x-no-compression' ] ) {
                    // don't compress responses with this request header
                    return false
                }

                // fallback to standard filter function
                return compres.filter(req, res)
            }
        }));
    }

    /* Serve server from "build" folder on production, and use router on development */
    if ( config.env === 'production' && config.cached ) {
        /* Serving Static Files */
        app.use(express.static('build', { etag : true, maxAge : 604800000 }));
    }
    else {
        /* Serving Static Files */
        app.use(express.static('public'));
    }

    /* Request Logger */
    app.all('*', function (req, res, next) {
        var hostname = req.headers.host.split(":")[ 0 ];

        config.logs.info('Initializing request ' + config.htpr + '://' + hostname + ':' + config.port + req.path);

        /* Redirect to original host if requested with different host */
        if ( cliArg.indexOf('--noredir') < 0 ) {
            if ( hostname !== config.host ) {
                config.logs.info('Redirecting request to original host from ' + config.htpr + '://' + hostname + ':' + config.port + req.path);

                res.redirect(config.htpr + '://' + config.host);
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    });

    /* Registering Routers */
    config.router.forEach(function (router) {
        app.get(router.path, function (req, res) {
            /* Loggin Request */
            config.logs.req(req);

            /* Getting Model */
            var cmodel = config.model.get(router.name);

            /* Find data related with path */
            if ( cmodel && config.meta ) {
                Object.keys(config.meta).forEach(function (key) {
                    if ( key in cmodel ) {
                        config.meta[ key ] = cmodel[ key ];
                    }
                });
            }

            config.menus.$current = router;

            /* Rendering Views with config as config */
            render('./' + router.view, config, function (err, html) {
                if ( err ) {
                    config.logs.warn(err);
                    config.logs.info('Sending ' + (err.status || 500) + ' from request: ' + req.protocol + '://' + req.hostname + ':' + config.port + req.originalUrl);

                    if ( debugs ) config.error = err;

                    render('./views/500.html', config, function (err, html) {
                        res.status(500);
                        res.send(html);
                    });
                }
                else {
                    /* Enable Caching on production */
                    if ( config.env === 'production' && config.cached ) {
                        res.header('Cache-Control', 'public, max-age=60000');
                    }

                    res.send(html);

                    config.logs.res(res);
                }
            });
        });
    });

    /* Handling 404 */
    app.use(function (req, res, next) {
        /* Create new Error */
        var err = new Error('Not found');

        /* Set error status */
        err.status = 404;

        /* Forward Error */
        next(err);
    });

    /* Handling error requests */
    app.use(function (err, req, res, next) {
        config.logs.warn(err);
        config.logs.info('Sending ' + (err.status || 500) + ' from request: ' + req.protocol + '://' + req.hostname + ':' + config.port + req.originalUrl);

        res.status(err.status || 500);

        if ( debugs ) config.error = err;

        render('./views/' + (err.status || 500) + '.html', config, function (err, html) {
            if ( err ) {
                config.logs.warn(err);

                if ( debugs ) config.error = err;

                render('./views/500.html', config, function (err, html) {
                    res.status(500);
                    res.send(html);
                });
            }
            else {
                res.status = 500;
                res.send(html);

                config.logs.res(res);
            }
        });
    });

    /* Starting Server */
    var host = app.listen(config.port, function () {
        config.logs.info('Server listening at: ' + config.htpr + '://' + config.host + ':' + config.port + ' on ' + config.env + ' environtment.');
    });

    /* Create Livereload server and related tasks on development */
    if ( config.env === 'development' && cliArg.indexOf('--reloads') > -1 ) {
        load.listen({
            port   : config.reloadport,
            auto   : true,
            silent : true
        });

        /* Watching for views file changes */
        new Gaze('views/**/*.html')
            .on('changed', function () {
                load.reload();
            })
            .on('added', function () {
                /* Reload Router */
                reloadRouters();

                /* Reload Models */
                reloadModel();

                /* Reload Page */
                load.reload();
            })
            .on('deleted', function () {
                /* Reload Router */
                reloadRouters();

                /* Reload Models */
                reloadModel();

                /* Reload Page */
                load.reload();
            });

        /* Sass Tasks */
        new Gaze('public/styles/**/*.scss')
            .on('all', function (e) {
                sass.render({
                    file        : 'public/styles/main.scss',
                    outFile     : 'public/styles/main.css',
                    outputStyle : 'exapnded',
                    sourceMap   : true
                }, function (err, result) {
                    if ( err ) {
                        console.log(err);
                    }
                    else {
                        file.writeFileSync('public/styles/main.css', result.css);
                        file.writeFileSync('public/styles/main.css.map', result.map);

                        load.changed('main.css');
                    }
                });
            });

        /* Public Task */
        new Gaze('public/!(styles|libs|robots.txt|sitemap.xml|*.css|*.map)/**')
            .on('all', function (e) {
                load.reload();
            });

        ///* Model Tasks */
        new Gaze([ 'model/*.*', 'model/*/**' ])
            .on('all', function (e) {
                reloadModel();

                load.reload();
            });

        /* System Task */
        new Gaze([ 'config/*.*', 'config/*/**', 'core/*.*', 'core/*/**', 'plugin/*.*', 'plugin/*/**' ])
            .on('all', function (e) {
                process.exit();
            });

        /* Trigger livereload on self-restart */
        setTimeout(function () {
            config.logs.info('Triggering reload on start...');
            load.reload();
        }, 200);
    }
}

/* Exporting Application Data */
module.exports = config;
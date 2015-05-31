/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

//!nonative

/* Loading Dependencies and Configurations */
var express = require('express'),
    config  = require('./config/stater'),
    exec    = require('child_process'),
    swig    = require('swig');

/* Creating Application Data */
var appData = {
    env : process.ENV || 'development'
};

/* Binding configurations to appData */
Object.keys(config).forEach(function (title) {
    appData[ title ] = config[ title ];
});

/* Configuring Swig */
swig.setDefaults({ cache : false });

/* Adding Filters to Swig */
Object.keys(config.filter).forEach(function (filter) {
    swig.setFilter(filter, config.filter[ filter ]);
});

/* Swig Renderer */
var render = swig.renderFile;

/* Getting Runtime Arguments */
var cliArg = process.argv;
var debugs = appData.debug = (cliArg.indexOf('--debug') > -1 ? true : false);

/* Remove Livereload using CLI Argument */
if ( cliArg.indexOf('--clean') > -1 ) {
    appData._noreload = true;
}

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

if ( initStater ) {
    /* Creating New Host */
    var app = express();

    /* Serving Static Files */
    app.use(express.static('public'));

    /* Registering Routers */
    config.router.forEach(function (router) {
        app.get(router.path, function (req, res) {
            var reqpath;
            /* Loggin Request */
            config.logs.req(req);

            /* Creating Request Path */
            reqpath = req.path;

            if ( req.path === '/' ) reqpath = '/home';

            /* Getting Path Name */
            reqpath = reqpath.replace(/^\//, '').replace(/\//g, '.');

            /* Find data related with path */
            if ( reqpath in appData.model && appData.meta ) {
                Object.keys(appData.meta).forEach(function (key) {
                    if ( key in appData.model[ reqpath ] ) {
                        appData.meta[ key ] = appData.model[ reqpath ][ key ];
                    }
                });
            }

            /* Rendering Views with appData as appData */
            render('./' + router.view, appData, function (err, html) {
                if ( err ) {
                    config.logs.warn(err);
                    config.logs.info('Sending ' + (err.status || 500) + ' from request: ' + req.protocol + '://' + req.hostname + ':' + config.port + req.originalUrl);

                    if ( debugs ) appData.error = err;

                    render('./views/500.html', appData, function (err, html) {
                        res.status(500);
                        res.send(html);
                    });
                }
                else {
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

        if ( debugs ) appData.error = err;

        render('./views/' + (err.status || 500) + '.html', appData, function (err, html) {
            if ( err ) {
                config.logs.warn(err);

                if ( debugs ) appData.error = err;

                render('./views/500.html', appData, function (err, html) {
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
        config.logs.info('Server listening at: http://127.0.0.1:' + config.port);
    });
}

/* Exporting Application Data */
module.exports = appData;
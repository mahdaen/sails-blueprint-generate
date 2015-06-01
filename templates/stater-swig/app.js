/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

//!nonative

/* Loading Dependencies and Configurations */
var express = require('express'),
    compres = require('compression'),
    config  = require('./config/stater'),
    exec    = require('child_process'),
    swig    = require('swig');

/* Creating Application Data */
var appData = {};

/* Getting Runtime Arguments */
var cliArg = process.argv;
var debugs = config.debug;

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

    /* Enable Express Compression */
    if ( appData.env === 'production' ) {
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
    if ( appData.env === 'production' ) {
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
        /* Dissalow requesting from wrong host */
        if ( config.env === 'production' ) {
            if ( hostname !== config.host ) {
                /* Redirect IP Address */
                if ( hostname.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/) ) {
                    res.redirect(config.htpr + '://' + config.host);
                }
                else {
                    var err = new Error('Forbidden. Not allowed to request from different host.');

                    err.status = 403;
                    next(err);
                }
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
    var host = app.listen(appData.port, function () {
        config.logs.info('Server listening at: ' + appData.htpr + '://' + appData.host + ':' + appData.port + ' on ' + appData.env + ' environtment.');
    });
}

/* Exporting Application Data */
module.exports = appData;
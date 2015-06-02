/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

/**
 * Stater Config Loader
 */

/* CLI Color */
var color = require('colors/safe'),
    find  = require('glob'),
    file  = require('fs'),
    path  = require('path');

/* Getting Verbose Mode */
var verbose = process.argv.indexOf('--verbose') > -1 ? true : false;
var silence = process.argv.indexOf('--silent') > -1 ? true : false;

/* Creating Logger */
var logger = require('./logger');

/* Creating Configuration Data */
var configs = {
    assets : require('./assets'),
    router : require('./router'),
    filter : require('./filters'),

    model  : {},
    menus  : {},
    env    : process.ENV || 'development',
    cached : true,

    htpr : '__PROTOCOL__',
    port : __SPORT__,
    host : '__SHOST__',
    logs : new logger(),
    meta : require('./meta'),

    raws : function (text) {
        return text;
    }
};

/* Getting Runtime Flags */
var cliArg = process.argv;
var debugs = configs.debug = (cliArg.indexOf('--debug') > -1 ? true : false);

/* Remove Livereload using CLI Argument */
if ( cliArg.indexOf('--clean') > -1 ) {
    configs._noreload = true;
}

/* Change Environtment by runtime flags */
if ( cliArg.indexOf('--prod') > -1 ) {
    configs.env = 'production';
}

/* Change Environtment by runtime flags */
if ( cliArg.indexOf('--https') > -1 ) {
    configs.htpr = 'https';
}

/* Change Caching Controll by runtime flags */
if ( cliArg.indexOf('--nocache') > -1 ) {
    configs.cached = false;
}

/* Change port by runtime flags */
cliArg.forEach(function (arg) {
    if ( arg.search('--port=') > -1 ) {
        configs.port = Number(arg.replace('--port=', '').replace(/\"/g, '').replace(/\'/g, ''));
    }
});

/* Change host by runtime flags */
cliArg.forEach(function (arg) {
    if ( arg.search('--host=') > -1 ) {
        configs.host = arg.replace('--host=', '').replace(/\"/g, '').replace(/\'/g, '');
    }
});

/* Registering Menus and Creating Sitemaps */
var sitemap = file.readFileSync('./config/sitemap.xml', 'utf8');
var siteurl = '';

configs.router.forEach(function (route) {
    var name = route.path.replace(/^\//, '').replace(/\//g, '.');

    if ( name === '' ) {
        /* Adding Menu */
        configs.menus[ 'home' ] = '/'

        /* Adding Sitemap URL */
        siteurl += '' +
        '\t<url>\r\n' +
        '\t\t<loc>' + configs.htpr + '://' + configs.host + '/</loc>\r\n' +
        '\t\t<priority>0.80</priority>\r\n' +
        '\t</url>\r\n';
    }
    else {
        /* Adding Menu */
        configs.menus[ name ] = route.path;

        /* Adding Sitemap URL */
        siteurl += '' +
        '\t<url>\r\n' +
        '\t\t<loc>' + configs.htpr + '://' + configs.host + route.path + '</loc>\r\n' +
        '\t\t<priority>0.80</priority>\r\n' +
        '\t</url>\r\n';
    }
});

/* Adding sitemap string to configs and writing sitemap file */
sitemap = sitemap.replace('<!-- URLS -->', siteurl);
configs.sitemapurl = sitemap;

file.writeFileSync('./public/sitemap.xml', sitemap);

/* Registering Custom Menus */
var cmenus = require('./menu');
Object.keys(cmenus).forEach(function (name) {
    configs.menus[ name ] = cmenus[ name ];
});

/* Generating Robots.txt */
var robots = require('./robots');
var robotx = '';

robots.forEach(function (rob) {
    robotx += 'User-Agent: ' + rob.userAgent + '\r\n';
    rob.disallow.forEach(function (dsl) {
        robotx += 'Disallow: ' + dsl + '\r\n';
    });
});

robotx += 'Sitemap: ' + configs.htpr + '://' + configs.host + '/sitemap.xml';
configs.robots = robotx;

file.writeFileSync('./public/robots.txt', robotx);

/* Collecting Models */
var models = find.sync('model/**/*.js');

/* Binding Models to Configuration Data */
models.forEach(function (name) {
    /* Getting Model Name */
    var modelName = path.parse(name).name.toLowerCase();

    /* Getting Model Data */
    try {
        var data = require('../' + name);

        if ( data ) {
            configs.model[ modelName ] = data;
        }
    }
    catch ( err ) {
        configs.logs.warn(err);
    }
});

/* Getting Public Dirs */
configs.public = find.sync('public/*');

/* Exporting Configurations */
module.exports = configs;
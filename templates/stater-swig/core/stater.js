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
    tree  = require('./tree'),
    path  = require('path');

/* Getting Verbose Mode */
var verbose = process.argv.indexOf('--verbose') > -1 ? true : false;
var silence = process.argv.indexOf('--silent') > -1 ? true : false;

/* Creating Logger */
var logger = require('./logger');

/* Creating Configuration Data */
var routers = require('./router');

var configs = {
    base       : '/',
    router     : routers.lists,
    menus      : routers.menus,
    model      : new tree(),
    plugin     : {},

    /* Server Configurations */
    env        : process.ENV || 'development',
    htpr       : '__PROTOCOL__',
    port       : __SPORT__,
    host       : '__SHOST__',
    logs       : new logger(),
    meta       : require('../config/meta'),
    cached     : false,

    /* Live Reload Port */
    reloadport : __RELOADPORT__,

    /* Read data without autoescape */
    raws       : function (text) {
        return text;
    },

    /* Extras */
    assets     : require('../config/assets'),
    filter     : require('../config/filters'),

    /* Current Path */
    current    : { view : '' }
};

/* Menu Extractor */
configs.parseMenu = function (menus) {
    /* Sorting Menu */
    var numb = [], char = [ 'home' ], ext = (configs.env === 'production' ? '.html' : '');

    Object.keys(menus).forEach(function (key) {
        if ( Number(key) ) {
            numb.push(key);
        }
        else {
            if ( key !== 'home' ) {
                char.push(key);
            }
        }
    });

    char = char.concat(numb.sort());

    /* Creating Menu */
    var menu = '<ul>', skip = [ '$current', '$link', '$view', '$path', '$name', '$base' ];

    var parse = function (mni) {
        var cr = menus.$current.view === mni.$view ? ' class="current"' : '';

        var ms = '<li>' + '<a href="' + configs.base + mni.$link.replace(/^\//, '') + ext + '"' + cr + '>' + '<span>' + mni.$name + '</span>' + '</a>';

        if ( Object.keys(mni).length > 5 ) {
            ms += '<ul>';

            for ( var sub in mni ) {
                if ( skip.indexOf(sub) < 0 ) {
                    ms += parse(mni[ sub ]);
                }
            }

            ms += '</ul>';
        }

        ms += '</li>';

        return ms;
    }

    char.forEach(function (key) {
        if ( skip.indexOf(key) < 0 ) {
            menu += parse(menus[ key ]);
        }
    });

    menu += '</ul>'

    return menu;
}

/* Getting Custom Configs */
var usrconfigs;

try {
    usrconfigs = require('../config.json');

    if ( usrconfigs ) {
        for ( var key in usrconfigs ) {
            if ( key === 'port' || key === 'reloadport' ) {
                configs[ key ] = Number(usrconfigs[ key ]);
            }
            else {
                configs[ key ] = usrconfigs[ key ];
            }
        }
    }
}
catch ( e ) {}

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
    configs.cached = true;
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

/* Collecting Models */
var models = find.sync('model/**/*.js');

/* Binding Models to Configuration Data */
models.forEach(function (name) {
    /* Getting Model Name */
    var modelName = name.replace('model/', '').replace(/\//g, '.').replace(/\.js$/, '');

    /* Getting Model Data */
    try {
        var data = require('../' + name);

        if ( data ) {
            configs.model.set(modelName, data);

            if ( data.$name && configs.menus.get(modelName) ) {
                configs.menus.set(modelName + '.$name', data.$name);
            }
        }
    }
    catch ( err ) {
        configs.logs.warn(err);
    }
});

/* Creating Sitemaps */
var sitemap = file.readFileSync('./core/sitemap.xml', 'utf8');
var siteurl = '';

configs.router.forEach(function (route) {
    var name = route.path.replace(/^\//, '').replace(/\//g, '.');

    if ( name === '' ) {
        /* Adding Sitemap URL */
        siteurl += '' +
        '\t<url>\r\n' +
        '\t\t<loc>' + configs.htpr + '://' + configs.host + '/</loc>\r\n' +
        '\t\t<priority>0.80</priority>\r\n' +
        '\t</url>\r\n';
    }
    else {
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

/* Generating Robots.txt */
var robots = require('../config/robots');
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

/* Loading Plugins */
var plugins = find.sync('plugin/*.js');

plugins.forEach(function (name) {
    /* Getting Model Name */
    var plgname = path.parse(name).name.toLowerCase(), plg;

    /* Getting Model Data */
    try {
        var plg = require('../' + name);
    }
    catch ( err ) {
        configs.logs.warn(err);
    }

    if ( plg ) {
        if ( plg.init ) {
            plg.init(configs);
        }

        if ( plg.code ) {
            configs.plugin[ plgname ] = plg.code;
        }
    }
});

/* Getting Public Dirs */
configs.public = find.sync('public/*');

/* Exporting Configurations */
module.exports = configs;
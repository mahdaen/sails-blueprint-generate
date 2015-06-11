/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

'use strict';

/* Router Loader */
var file = require('glob'),
    tree = require('./tree'),
    path = require('path');

/* Creating Router Lists */
var routers = [
    /* Default router path (home) */
    {
        path : '/',
        view : 'views/home.html',
        name : 'home'
    }
];

var menus = new tree();

/* Getting HTML Files */
var main = file.sync('views/*.html');
var subs = file.sync('views/!(parts)/*.html'); // Don't include "parts" folder.

/* Creating Router Infos */
main.concat(subs).forEach(function (file) {
    var rfile = file.replace('views', '');

    var route = (path.dirname(rfile) + '/' + path.basename(rfile))
        .replace('//', '/')
        .replace(path.extname(rfile), '');

    var name = route.replace(/^\//, '').replace('/', '.');

    var base = '';

    name.split('.').slice(1).forEach(function () {
        base += '../'
    });

    /* Adding router to router list */
    routers.push({
        path : route,
        view : file,
        name : name,
        base : base
    });

    /* Adding Menu */
    menus.set(name, {
        $link : route,
        $view : file,
        $path : name,
        $name : name.split('.').pop(),
        $base : base
    });
});

/**
 * Custom Routers
 * You can add custom router by concating "routers" variable above.
 * Required properties in each router: "path" and "view".
 */
var crouter = require('../config/router');
routers.concat(crouter);

/* Registering Custom Menus */
var cmenus = require('../config/menu');

Object.keys(cmenus).forEach(function (name) {
    menus.set(name, cmenus[ name ]);
});

/* Exporting Routers */
module.exports = {
    lists : routers,
    menus : menus
}


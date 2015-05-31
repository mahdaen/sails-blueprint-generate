/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

/**
 * Stater Router Loader
 */

var file = require('glob'),
    path = require('path');

/* Creating Router Lists */
var routers = [
    /* Default router path (home) */
    {
        path : '/',
        view : 'views/home.html'
    }
];

/* Getting HTML Files */
var main = file.sync('views/*.html');
var subs = file.sync('views/!(parts)/*.html'); // Don't include "parts" folder.

/* Creating Router Infos */
main.concat(subs).forEach(function (file) {
    var rfile = file.replace('views', '');
    var route = (path.dirname(rfile) + '/' + path.basename(rfile))
        .replace('//', '/')
        .replace(path.extname(rfile), '');

    /* Adding router to router list */
    routers.push({
        path : route,
        view : file
    });
});

/**
 * Custom Routers
 * You can add custom router by concating "routers" variable above.
 * Required properties in each router: "path" and "view".
 */
routers.concat([
    /* Add your custom router here */
]);

/* Exporting Routers */
module.exports = routers;
/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

/* Loading NodeImport */
require('node-import');

/* Extensions */
var path = require('path'),
    file = require('fs'),
    swig = require('swig');

/* Exporting Module */
module.exports = function (grunt) {
    /* Importing Configurations and sharing objects */
    imports.module('./grunt/init', {
        grunt : grunt,
        root  : __dirname,
        path  : path,
        file  : file,
        swig  : swig,

        /* Require Proxy, to load from __dirname path instead node-import path */
        load  : function (file) {
            return require(path.resolve(__dirname, file));
        }
    });
}
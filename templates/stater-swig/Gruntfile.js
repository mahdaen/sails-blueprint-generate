/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

/* Loading NodeImport */
require('node-import');

/* Makes forever enable to handle grunt watch */
var exec = require('child_process').exec;

/* Check runtime flags */
var cliArg = process.argv;

if ( cliArg.length >= 3 && cliArg[ 2 ] === 'develop' ) {
    exec('grunt devel', function (err, std) {
        if ( err ) {
            console.log(err);
        }
        else {
            console.log(std);
        }
    });
}
else {

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
            core  : require('./app'),

            /* Require Proxy, to load from __dirname path instead node-import path */
            load  : function (file) {
                return require(path.resolve(__dirname, file));
            }
        });
    }
}

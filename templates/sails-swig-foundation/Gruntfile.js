/* Loading NodeImport */
var imports = require('node-import');

/* Exporting Module */
module.exports = function (grunt) {
    /* Importing Configurations */
    imports.module('./grunt/init', { grunt : grunt });
}
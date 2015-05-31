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

    port : __DEVPORT__,
    host : 'localhost',
    logs : new logger(),
    meta : require('./meta'),

    raws : function(text) {
        return text;
    }
};

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
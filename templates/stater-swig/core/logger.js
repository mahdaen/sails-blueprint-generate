/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

/**
 * Stater Logger
 * Log application activity including request, response and errors.
 */

'use strict';

var file = require('fs'),
    path = require('path'),
    colr = require('colors/safe'),
    args = process.argv;

/* Logger Configs */
var defConfig = {
    /* Location where log files saved */
    location  : 'logs',

    /* Enable Color */
    colorize  : true,

    /* Rendering Data */
    render    : false,
    locals    : false,

    /* Write log file condition. */
    writecon  : 'error', // error | medium | all

    /* Configuration for Error Logger */
    _error    : {
        file : 'error.log',
        send : '--debug',
        logs : '--verbose',
        type : 'error'
    },

    /* Configuration for Standard Logger */
    _info     : {
        file : 'infos.log',
        logs : '--verbose',
        type : 'all'
    },

    /* Configuration for Request Logger */
    _request  : {
        file : 'request.log',
        logs : '--verbose',
        type : 'medium'
    },

    /* Configuration for Response Logger */
    _response : {
        file : 'response.log',
        logs : '--verbose',
        type : 'medium'
    }
}

/* Creating Logger Class */
var Logger = function (config) {
    if ( !config ) {
        config = defConfig;
    }

    /* Applying Configs */
    for ( var key in config ) {
        this[ key ] = config[ key ];
    }

    return this;
}

/* Creating Logger Methods */
Logger.prototype = {
    /* Log Errors */
    warn : function (err, force) {
        if ( !err ) return;

        /* Getting Info */
        var error = this.str(err, 'error');

        if ( (this._error.logs && args.indexOf(this._error.longs) > -1) || force ) {
            console.log(error.color);
        }

        /* Writing Logs */
        this.write('_error', error.text);

        return this;
    },

    error : function (message, force) {
        return this.warn(message, force);
    },

    /* Information Logger */
    info  : function (message, force) {
        if ( !message ) return;

        var info = this.str(message);

        if ( (this._info.logs && args.indexOf(this._info.logs) > -1) || force ) {
            console.log(info.color);
        }

        /* Writing Logs */
        this.write('_info', info.text);

        return this;
    },

    /* Request Logger */
    req   : function (req, force) {
        if ( !req ) return;

        var info = this.str('Receiving request from: ' + req.originalUrl);

        if ( (this._request.logs && args.indexOf(this._request.logs) > -1) || force ) {
            console.log(info.color);
        }

        /* Writing Logs */
        this.write('_request', info.text);

        return this;
    },

    /* Response Logger */
    res   : function (res, force) {
        if ( !res ) return;

        var info = this.str('Sending response to: ' + res.req.originalUrl);

        if ( (this._response.logs && args.indexOf(this._response.logs) > -1) || force ) {
            console.log(info.color);
        }

        /* Writing Logs */
        this.write('_response', info.text);

        return this;
    },

    /* Set property to logger, e.g renderer */
    set   : function (name, value) {
        if ( 'string' === typeof name && 'undefined' !== typeof value ) {
            this[ name ] = value;
        }

        return this;
    },

    /* Logs text formatter */
    str   : function (err, type, split) {
        var date, ttxt, mtxt;

        date = new Date();
        date = (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()).toString();

        var text = date + (split ? '\r\n----------------------------------------------------------------\r\n' : ' => ');
        var strs = '', ttxt, mtxt;

        if ( 'string' === typeof err ) {
            strs = err;
        }
        else {
            strs = err.toString();
        }

        ttxt = text;
        mtxt = strs;

        if ( this.colorize ) ttxt = colr.green(ttxt);

        if ( this.colorize ) {
            if ( type === 'error' ) {
                mtxt = colr.red.bold(mtxt);
            }
            else {
                mtxt = colr.bold(mtxt);
            }
        }

        text += strs;
        ttxt += mtxt;

        return { text : text + '\r\n', color : ttxt };
    },

    /* Write Logs */
    write : function (type, info) {
        var $this = this;

        /* Ensure write call log give type and data */
        if ( type && type in this && info ) {
            var logs = $this[ type ];

            /* Ensure this log type is allowed to write logs */
            if ( logs.type === this.writecon ) {
                /* Ensure folder to save logs is exists */
                file.stat($this.location, function (err, stat) {
                    if ( err ) {
                        file.mkdirSync($this.location);
                    }
                    else {
                        if ( !stat.isDirectory() ) file.mkdirSync($this.location);
                    }

                    var date = new Date();
                    var name = (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()).toUpperCase().replace(/\s+/g, '-') + '-' + logs.file.toUpperCase();
                    var trgt = path.resolve($this.location, name);

                    /* If today log already exists, append. Else, write new */
                    file.stat(trgt, function (err, stat) {
                        if ( err || !stat.isFile() ) {
                            file.writeFileSync(trgt, info);
                        }
                        else {
                            file.writeFileSync(trgt, file.readFileSync(trgt, 'utf8') + info);
                        }
                    });
                });
            }
        }

        return this;
    }
}

/* Exporting Logger */
module.exports = Logger;
#! /usr/bin/env node

'use strict';

/* Loading Required Modules */
var sudo = require('child_process').exec,
    info = require('./package.json'),
    root = __dirname;

/* Getting Arguments */
var args = process.argv;

/* Reading Arguments */
if ( args.length >= 3 ) {
    var carg = args[ 2 ];

    switch ( carg ) {
        case 'start':
            console.log('Starting Stater...');

            sudo('forever stop app.js', function () {
                sudo('forever start app.js start', function (err, std) {
                    if ( err ) {
                        console.log(err);
                    }
                    else {
                        console.log(std);
                    }
                });
            });

            break;
        case 'stop':
            console.log('Stopping Stater...');

            sudo('forever stop app.js', function (err, std) {
                if ( err ) {
                    console.log(err);
                }
                else {
                    console.log(std);
                }
            });

            break;
        case 'restart':
            console.log('Restarting Stater...');

            sudo('forever restart app.js', function (err, std) {
                if ( err ) {
                    console.log(err);
                }
                else {
                    console.log(std);
                }
            });

            break;
        case 'developer':
            console.log('Starting Stater in development mode...');

            sudo('forever stop app.js', function () {
                sudo('forever start app.js start && grunt devel', function (err, std) {
                    if ( err ) {
                        console.log(err);
                    }
                    else {
                        console.log(std);
                    }
                });
            });

            break;
        case 'build':
            console.log('Building Stater to static site...');

            sudo('grunt build', function (err, std) {
                if ( err ) {
                    console.log(err);
                }
                else {
                    console.log(std);
                }
            });

            break;
        case '-h':
            console.log('\r\n');
            console.log('\tStater Based Application');
            console.log('\t' + info.name + ' => v' + info.version);
            console.log('\t' + info.description);

            console.log('\r\n\tUSAGE:');
            console.log('\tnode stater [options] \r\n\t./stater.js [options] (if stater.js file is executable)\r\n');

            console.log('\tstart\t\t Start the server.');
            console.log('\tstop\t\t Stop the server.');
            console.log('\trestart\t\t Restart server.');
            console.log('\tbuild\t\t Build to Static HTML files (Web Template).\r\n\t\t\t Compiled files located at "build" folder.');

            console.log('\r\n\tTo start Stater in development mode, run: ./staterdev');
            console.log('\tServer (and browser) will be reloaded on file changes.\r\n');

            break;
        default :
            console.log('Invalid command: ' + carg);

            break;
    }
}

/* Assume to start the server */
else {
    console.log('Starting Stater...');

    sudo('forever stop app.js', function () {
        sudo('forever start app.js start', function (err, std) {
            if ( err ) {
                console.log(err);
            }
            else {
                console.log(std);
                console.log('Server successfully started.');
            }
        });
    });
}
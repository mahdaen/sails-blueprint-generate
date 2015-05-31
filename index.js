#! /usr/bin/env node

'use strict';

// /* Loading Inquirer */
var inquire = require('inquirer'),
    files   = require('fs'),
    filex   = require('fs-extra'),
    globs   = require('glob'),
    paths   = require('path'),
    execs   = require('child_process').exec,
    color   = require('colors/safe');

/* Getting generate target dir and target name */
var targetDir,
    targetName,
    cliArg   = process.argv,
    verbose,
    packages = require('./package.json'),
    exprompt = require('./prompts.json');

if ( cliArg.indexOf('-v') > -1 || cliArg.indexOf('--verbose') > -1 ) {
    verbose = true;
}

/* Getting Template Lists */
var tplDir = paths.resolve(__dirname, 'templates');
var templates = files.readdirSync(tplDir).filter(function (file) {
    return files.statSync(paths.join(tplDir, file)).isDirectory();
});

/* Supported Injection Files */
var injectdef = [
    '.js',
    '.html',
    '.swig',
    '.css',
    '.scss',
    '.json',
    '.md'
];

/* Preparing Setup Prompt */
var prompt = [
    {
        type    : 'input',
        name    : 'name',
        message : 'Project Name',
        default : (cliArg[ 2 ] || 'sails-app').replace(/[\s\.]+/g, '-')
    },
    {
        name    : 'realname',
        type    : 'input',
        message : 'Full Name',
        default : 'Sails Application'
    },
    {
        type    : 'input',
        name    : 'description',
        message : 'Description',
        default : 'The web framework of your dreams.'
    },
    {
        type    : 'input',
        name    : 'version',
        message : 'Version',
        default : '1.0.0'
    },
    {
        type    : 'input',
        name    : 'repository',
        message : 'Repository',
        default : 'https://github.com/user/reponame'
    },
    {
        type    : 'list',
        name    : 'template',
        message : 'Select Template',
        choices : templates
    }
];

/* Extending Prompts */
if ( Array.isArray(exprompt) ) {
    exprompt.forEach(function (exp) {
        prompt.push(exp);
    });
}

/* Initializing Generator */
var processTemplate = function (nextans, answers) {
    if ( nextans.verify == 'yes' ) {
        /* Tell user that process is started */
        console.log(
            color.green.bold('Generating Sails Blueprint for ') +
            color.bold(answers.name) +
            color.green.bold(' with template ') +
            color.bold(answers.template) +
            color.green.bold(' ...')
        );

        /* Get template resource dir */
        var resDir = paths.resolve(tplDir, answers.template), npkg;

        /* Get Template Package Setting */
        if ( files.existsSync(paths.resolve(resDir, 'package.json')) ) {
            npkg = require(paths.resolve(resDir, 'package.json'));
        }

        /* Get template files */
        var resFiles = globs.sync(resDir + '/**').concat(globs.sync(resDir + '/.*')), tplFiles = [];

        /* Processing each files for write and replacing variables */
        resFiles.forEach(function (file) {
            if ( files.statSync(file).isFile() ) {
                if ( verbose ) {
                    console.log(
                        color.green.bold('Processing template ') +
                        color.bold(file.replace(resDir, '')) +
                        color.green.bold(' ...')
                    );
                }

                var fxt = paths.extname(file);

                if (!fxt || fxt === '') fxt = '.?';

                var filename = file.replace(resDir, '');

                if (injectdef.indexOf(fxt) > -1) {
                    var fileStr = files.readFileSync(file, 'utf8');

                    for ( var pattern in answers ) {
                        if ( pattern in answers ) {
                            fileStr = fileStr.replace(new RegExp('__' + pattern.toUpperCase() + '__', 'g'), answers[ pattern ]);
                        }
                    }

                    if ( ('main' in npkg && file === paths.join(resDir, npkg.main)) || file === paths.join(resDir, 'app.js') ) {
                        if ( fileStr.search('//!nonative') < -1 ) {
                            fileStr = "// Embedding NativeJS\r\nrequire('native-js');\r\n\r\n" + fileStr;
                        }
                    }

                    filex.outputFileSync(targetDir + filename, fileStr);
                } else {
                    filex.copySync(file, targetDir + filename);
                }
            }
        });

        console.log(
            color.green.bold('\r\nSails Blueprint successfully generated.\r\n') +
            color.green.bold('Project path: ') +
            color.bold(targetDir) + '\r\n' +
            color.green.bold('Run the application by executing ') +
            color.bold('sails lift') +
            color.green.bold(' or ') +
            color.bold('forever -w app.js') + '\r\n'
        );

        /* Install Bower and NPM or not */
        var wbower, wnpm;

        if ( answers.npmdep && answers.npmdep !== '' ) wnpm = true;
        if ( answers.bowdep && answers.bowdep !== '' ) wbower = true;

        if ( wnpm ) {
            console.log(color.green.bold('Installing NPM Packages...'));

            execs('cd ./' + targetName + ' && npm install && npm install --save native-js' + answers.npmdep, function (err) {
                if ( !err ) {
                    console.log(color.green.bold('NPM Packages installed.'));
                }
            });
        }
        else {
            console.log(color.green.bold('Installing NPM Packages...'));

            execs('cd ./' + targetName + ' && npm install && npm install --save native-js', function (err) {
                if ( !err ) {
                    console.log(color.green.bold('NPM Packages installed.'));
                }
            });
        }

        if ( wbower ) {
            console.log(color.green.bold('Installing Bower Packages...'));

            execs('cd ./' + targetName + ' && bower install --allow-root && bower install --allow-root --save ' + answers.bowdep, function (err) {
                if ( !err ) {
                    console.log(color.green.bold('Bower Packages installed.'));
                }
            });
        }
        else {
            console.log(color.green.bold('Installing Bower Packages...'));

            execs('cd ./' + targetName + ' && bower install --allow-root', function (err) {
                if ( !err ) {
                    console.log(color.green.bold('Bower Packages installed.'));
                }
            });
        }
    }
    else {
        console.log(color.red.bold('Setup canceled.'));

        process.exit(0);
    }
}

/* Finalizing Generator */
var finalize = function (answers) {
    console.log(answers);

    inquire.prompt([
        {
            type    : 'input',
            name    : 'verify',
            message : 'Check the settings. Continue? yes/no',
            default : 'yes'
        }
    ], function (nextans) {
        processTemplate(nextans, answers);
    });
}

/* Executing Setup */
var doSetup = function () {
    inquire.prompt(prompt, function (answers) {
        if ( files.existsSync(paths.resolve(tplDir, answers.template + '/prompts.json')) ) {
            var extraPrompt = require(paths.resolve(tplDir, answers.template + '/prompts.json'));

            inquire.prompt(extraPrompt, function (exAnswers) {
                for ( var key in exAnswers ) {
                    answers[ key ] = exAnswers[ key ];
                }

                finalize(answers);
            });
        }
        else {
            finalize(answers);
        }
    });
}

/* Processing CLI Arguments */
if ( cliArg.length <= 2 ) {
    console.log(color.red.bold('First argument is needed. Usage sample: ') + color.green.bold('sails-blueprint project-name') + color.red.bold(' or ') + color.green.bold('sails-blueprint version'));
    process.exit(1);
}
else {
    var initArg = cliArg[ 2 ];

    switch ( initArg ) {
        case '-v':
            console.log(color.green.bold('Sails Blueprint Generator ') + color.bold(packages.version));
            break;
        case 'version':
            console.log(color.green.bold('Sails Blueprint Generator ') + color.bold(packages.version));
            break;
        case '-h':
            console.log('Visit Github Repo to learn Sails Blueprint Generator ' + color.green.bold(packages.homepage));
            break;
        case 'help':
            console.log('Visit Github Repo to learn Sails Blueprint Generator ' + color.green.bold(packages.homepage));
            break;
        case 'install':
            var pkgs = cliArg.slice(3);

            if ( pkgs.length > 0 ) {
                var instart = 0, root = paths.resolve(__dirname);

                var installTpl = function () {
                    var pkg = pkgs[ instart ];
                    instart++;

                    if ( instart <= pkgs.length ) {
                        console.log(color.green.bold('Installing additional template ') + color.bold(pkg));

                        execs('cd ' + root + ' && bower install --allow-root ' + pkg, function (err, data) {
                            if ( err ) {
                                console.log(color.red.bold('Unable to install or template not found: ') + color.bold(pkg) + '\r\n');
                            }
                            else {
                                console.log(color.green.bold('Template installed: ') + color.bold(pkg) + '\r\n');
                            }

                            installTpl();
                        });
                    }
                    else {
                        console.log(color.green.bold('Additional templates installed.'));
                    }
                }

                installTpl();
            }
            break;
        default :
            /* Welcome Message */
            console.log(color.green.bold('Welcome to interactive ') + color.bold('Sails Blueprint') + color.green.bold(' generator') + '\r\n');

            targetName = cliArg[ 2 ];
            targetDir = paths.resolve(process.cwd(), targetName);
            doSetup();

            break;
    }
}


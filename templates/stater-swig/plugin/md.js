/* Loading Markdown It */
var mdpl = require('markdown-it'),
    hljs = require('highlight.js'),
    file = require('fs');

/* Creating Configs */
/* Learn how to configure it by visiting https://www.npmjs.com/package/markdown-it */
var configs = {
    html        : true,
    linkify     : true,
    typographer : true
}

/* Markdown Object */
var md = new mdpl(configs);

/* Using plugins */
md.use(require('markdown-it-highlightjs'));

/* Markdown Renderer */
var render = function (mdstring, isfile) {
    var data;

    if ( isfile ) {
        mdstring = 'views/' + mdstring + '.md';

        try {
            data = file.readFileSync(mdstring, 'utf8');
        }
        catch ( err ) {
            return '';
        }
    }
    else {
        data = mdstring;
    }

    if ( data ) {
        return md.render(data);
    }
    else {
        return '';
    }
}

/* Exporting Module */
module.exports = {
    init : function (core) {
        /* Adding github flavored markdown */
        core.assets.styles.push('styles/md/default.css');
        core.assets.styles.push('styles/md/github-gist.css');
    },

    /* Markdown render in Swig */
    code : render
}
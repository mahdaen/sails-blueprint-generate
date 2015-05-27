/**
 * Swig Template Rendering Engine.
 */

module.exports = {
    /* Template File Extension */
    ext : 'swig',

    /* Function to handle render request */
    fn  : function (path, data, cb) {
        /* Swig Renderer */
        var swig = require('swig'), min = '.min';

        if ( data.settings.env === 'development' ) {
            min = '';
        }

        /* Bind injected js files */
        if ( !data.scripts ) {
            data.scripts = [ 'com.libs', 'com.apps' ];
        }

        /* Bind injected css files */
        if ( !data.styles ) {
            data.styles = [ 'main' ];
        }

        /* Bind public paths */
        var paths = {
            script : '/scripts',
            style  : '/styles',
            image  : '/images',
            font   : '/fonts',
            icon   : '/icons'
        };

        if ( !data.path ) {
            data.path = paths;
        }
        else {
            for ( var key in paths ) {
                if ( !key in data.path ) {
                    data.path[ key ] = paths[ key ];
                }
            }
        }

        /* Render Templates */
        return swig.renderFile(path, data, cb);
    }
}
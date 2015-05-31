/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

/**
 * Assets Mapping
 * Add your assets here so we can concat and minify them when building,
 * including javascripts libraries, css libraries etc.
 */

module.exports = {
    /* Application Icons */
    appicon : [
        {
            rel: 'apple-touch-icon-precomposed',
            size: '144x144',
            href: 'icons/app-icon.144.png'
        },
        {
            rel: 'apple-touch-icon-precomposed',
            size: '114x114',
            href: 'icons/app-icon.114.png'
        },
        {
            rel: 'apple-touch-icon-precomposed',
            size: '72x72',
            href: 'icons/app-icon.72.png'
        },
        {
            rel: 'apple-touch-icon-precomposed',
            size: '57x57',
            href: 'icons/app-icon.57.png'
        },
        {
            rel: 'shortcut icon',
            type: 'image/vnd.microsoft.icon',
            href: 'icons/favicon.ico'
        },
    ],

    /* Script Assets */
    scripts : [
        'libs/jquery/dist/jquery.js',
        'libs/jqpatch/dist/jqpatch.js',
        'scripts/global.js'
    ],

    /* Stylesheet Assets */
    styles  : [
        'styles/main.css',
    ]
}
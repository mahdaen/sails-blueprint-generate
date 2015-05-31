/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

'@namespace sass';

/* Comipile SCSS for Development */
var devl = {
    options: {
        sourceMap: true,
        outputStyle: 'expanded'
    },
    files: {
        'public/styles/main.css': 'public/styles/styles.scss'
    }
}

/* Compile SCSS for Production */
var prod = {
    options: {
        sourceMap: true,
        outputStyle: 'compressed'
    },
    files: {
        'build/styles/prod.min.css': '.tmp/prod.scss'
    }
}

/* Loading NPM Task */
grunt.loadNpmTasks('grunt-sass');
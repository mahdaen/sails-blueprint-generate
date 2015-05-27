'@namespace sass';

/* Comipile SCSS for Development */
var devl = {
    options: {
        sourceMap: true,
        outputStyle: 'expanded'
    },
    files: {
        '.tmp/public/styles/main.css': 'public/styles/main.scss'
    }
}

/* Compile SCSS for Production */
var prod = {
    options: {
        sourceMap: true,
        outputStyle: 'compressed'
    },
    files: {
        '.tmp/public/styles/main.css': 'public/styles/main.scss'
    }
}

/* Loading NPM Task */
grunt.loadNpmTasks('grunt-sass');
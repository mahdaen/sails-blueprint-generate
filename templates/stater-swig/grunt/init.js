/* ============ ><><><><><><><><>< Stater ><><><><><><><><>< ============ */
/* ===========  Web Template Development is just like a Beer  =========== */
/* ============ ><><><><><><><><><><><><><><><><><><><><><>< ============ */

/* INIT CONFIGURATIONS */
/* ------------------- */
'@namespace config';

/* Importing Tasks Configuration */
'@import tasks/';

/* APPLYING CONFIGS */
/* ---------------- */
grunt.initConfig(config);

/* REGISTERING TASKS */
/* ----------------- */
/* Sync Assets */
grunt.registerTask('assets', [ 'sync:fonts', 'sync:images', 'sync:icons' ]);

/* Default Task */
grunt.registerTask('default', [ 'devel' ]);

/* Development */
grunt.registerTask('devel', [ 'sass:devl', 'watch' ]);


/* INIT CONFIGURATIONS */
/* ------------------- */
'@namespace config';

/* Importing Configurations */
'@import configs/';

/* APPLYING CONFIGS */
/* ---------------- */
grunt.initConfig(config);

/* REGISTERING TASKS */
/* ----------------- */
/* Sync Assets */
grunt.registerTask('SyncAssets', [ 'sync:fonts', 'sync:images', 'sync:icons', 'sync:bootstrapFonts' ]);

/* Registering Default Task */
grunt.registerTask('default', [ 'clean', 'exports', 'sass:devl', 'SyncAssets' ]);

/* Registering Default Task */
grunt.registerTask('build', [ 'clean', 'exports', 'sass:devl', 'SyncAssets', 'sync:prod' ]);

/* Registering Default Task */
grunt.registerTask('prod', [ 'clean', 'exports', 'sass:prod', 'SyncAssets', 'sync:prod' ]);


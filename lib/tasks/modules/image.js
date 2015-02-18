'use strict';

var path = require('path');

var chalk = require('chalk');
var Imagemin = require('imagemin');

module.exports = function image(io, next) {

  new Imagemin()
    .src(path.join(io.options.src, 'img', '**', '*.{gif,jpg,png,svg}'))
    .dest(path.join(io.options.dest, 'img'))
    .use(Imagemin.gifsicle({ interlaced: true }))
    .use(Imagemin.jpegtran({ progressive: true }))
    .use(Imagemin.optipng({ optimizationLevel: 3 }))
    .use(Imagemin.svgo())
    .run(function(err, files) {
      if (err) {
        io.log.error(err);
      }

      files.forEach(function(file) {
        io.log(chalk.green('Created: %s'), path.relative(io.options.dest, file.history[1]));
      });

      io.log('');

      next();
    });

};

'use strict';

var path = require('path')

var chalk = require('chalk')
var Imagemin = require('imagemin')

module.exports = function favicon(io, next) {

  new Imagemin()
    .src(path.join(io.options.src, 'favicon.png'))
    .dest(io.options.dest)
    .use(Imagemin.optipng({ optimizationLevel: 3 }))
    .run(function(err) {
      if (err) {
        io.log.error(err)
      }

      io.log(chalk.green('create: %s\n'), 'favicon.png')

      io.log('')

      next()
    })

}

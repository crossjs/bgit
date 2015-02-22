'use strict';

var exec = require('child_process').exec
var path = require('path')

var chalk = require('chalk')
var stripAnsi = require('strip-ansi')

module.exports = function sass(io, next) {

  var arr = ['compass compile']

  arr.push('--sass-dir ' + path.join(io.options.src, 'scss'))
  arr.push('--css-dir ' + path.join(io.options.dest, 'css'))
  arr.push('--images-dir ' + path.join(io.options.dest, 'img'))
  arr.push('--javascripts-dir ' + path.join(io.options.dest, 'js'))
  arr.push('--fonts-dir ' + path.join(io.options.dest, 'font'))

  exec(arr.join(' '), { cwd: process.cwd() }, function(err, stdout/*, stderr*/) {
    stripAnsi(stdout).split('\n').forEach(function(line) {
      var match = line.match(/^\s*(wri|crea)te (.+)$/)

      if (match) {
        io.log(chalk.green('create: %s'),
          path.relative(io.options.dest, match[1] === 'wri' ? match[2] :
            path.relative(io.options.dest, path.join(io.options.src, match[2]))))
      }
    })

    io.log('')

    next()
  })

}

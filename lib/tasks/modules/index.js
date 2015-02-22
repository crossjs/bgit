'use strict';

var fs = require('fs')
var path = require('path')

var chalk = require('chalk')
var extend = require('extend')

module.exports = function index(io, next) {
  var tpl = io.templates.pages['index']

  var html = io.templates.layouts['default'](extend({
    config: io.config,
    // title: 'index',
    content: tpl({
      config: io.config,
      posts: io.posts
    })
  }, tpl.data), {
    partials: io.templates.partials
  })

  var filename = 'index' + io.options.ext.html

  fs.writeFile(path.join(io.options.dest, filename), html, function(err) {
    if (err) {
      io.log.error(err)
    }

    io.log(chalk.green('create: %s\n'), filename)

    next()
  })
}

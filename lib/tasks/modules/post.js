'use strict';

var fs = require('fs')
var path = require('path')

var async = require('async')
var chalk = require('chalk')
var extend = require('extend')
var mkdirp = require('mkdirp')

module.exports = function post(io, next) {
  var tplLayout = io.templates.layouts['default']
  var tplPost = io.templates.pages['post']

  function handleFile(post, done) {
    // save html
    var dest = path.join(io.options.dest, post.link)

    mkdirp(path.dirname(dest), function(err) {
      if (err) {
        io.log.error(err)
      }

      var html = tplLayout(extend({
        config: io.config,
        title: post.title,
        content: tplPost(extend({
          config: io.config
        }, post))
      }, tplPost.data), {
        partials: io.templates.partials
      })

      fs.writeFile(dest, html, function(err) {
        if (err) {
          io.log.error(err)
        }

        io.log(chalk.green('create: %s'), post.link.substring(1))

        done()
      })
    })
  }

  async.each(io.posts, handleFile, function(err) {
    if (err) {
      io.log.error(err)
    }

    io.log('')

    next()
  })
}

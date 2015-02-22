'use strict';

var fs = require('fs')
var path = require('path')

var async = require('async')
var chalk = require('chalk')
var extend = require('extend')
var matter = require('gray-matter')
var Showdown = require('showdown')
var _s = require('underscore.string')

var makeHtml = new Showdown.converter().makeHtml

module.exports = function posts(io, next) {
  var src = path.join(io.options.src, 'posts')

  var permalink = io.config.permalink

  function handleFile(file, done) {
    if (path.extname(file) !== io.options.ext.markdown) {
      done()
      return
    }

    var post = {
      source: path.join(src, file)
    }

    async.waterfall([

      // data and content
      function(_done) {
        fs.readFile(post.source, function(err, buf){
          if (err) {
            io.log.error(err)
          }

          var r = matter(buf.toString())

          post.data = r.data || {}
          post.content = r.content

          // clear
          r = null

          _done()
        })
      },

      // check ctime
      function(_done) {
        if (!post.data.ctime) {
          post.data.ctime = new Date().toISOString()

          // write ctime to source
          var html = matter.stringify(post.content, post.data)

          fs.writeFile(post.source, html, function(err){
            if (err) {
              io.log.error(err)
            }

            _done()
          })
        } else {
          _done()
        }
      },

      // make nav link data
      function(_done) {
        extend(post, post.data)
        delete post.data

        post.name = file.replace(new RegExp(io.options.ext.markdown + '$'), '')

        if (!post.title) {
          post.title = _s.humanize(post.name)
        }

        post.content = makeHtml(post.content)

        var ctime = new Date(post.ctime)

        post.year = ctime.getFullYear()
        post.month = ctime.getMonth() + 1
        post.date = ctime.getDate()

        post.link = '/post/' + permalink(extend({
          ext: io.options.ext.html
        }, post))

        _done()
      }

    ], function(err) {
      if (err) {
        io.log.error(err)
      }

      io.posts.push(post)

      done()
    })
  }

  fs.readdir(src, function(err, files) {
    if (err) {
      io.log.error(err)
    }

    async.each(files, handleFile, function(err) {
      if (err) {
        io.log.error(err)
      }

      // sort
      io.posts.sort(function(a, b) {
        return a.ctime > b.ctime ? -1 : 1
      })

      var len = io.posts.length

      // index/prev/next
      io.posts.forEach(function(post, i) {
        post.index = i

        if (i > 0) {
          post.prev = io.posts[i - 1]
        }
        if (i < len - 1) {
          post.next = io.posts[i + 1]
        }
      })

      io.log(chalk.yellow('initialize: %s'), 'posts indexed')

      io.log('')

      next()
    })
  })
}

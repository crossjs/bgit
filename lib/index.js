'use strict';

var path = require('path')

var chalk = require('chalk')

var Runner = require('./runner')
var tasks = require('./tasks')
var server = require('./server')
var watch = require('./watch')

function lpad(str, width) {
  var len = Math.max(0, width - str.length);
  return new Array(len + 1).join(' ') + str;
}

var log = function() {
  var args = Array.prototype.slice.call(arguments, 0)
  var r = /^([^:]+:)(.*)$/im
  var m = args[0].match(r)

  if (m) {
    args[0] = lpad(m[1], 20) + m[2];
  }

  console.log.apply(null, args);
}

log.error = function(err) {
  log(chalk.red('error: %s\n'), err.code || err)

  process.exit(0)
}

module.exports = function(options) {

  chalk.enabled = true

  var src = path.join(process.cwd(), options.src)
  var dest = path.join(process.cwd(), options.dest)

  // run
  ;(function run() {

    log('')
    log(lpad('...', 15))
    log('')

    new Runner().use([

      // config
      tasks.config,

      // templates
      tasks.template,

      // posts, sort, etc
      tasks.posts,

      // check, clean, make dest
      tasks.clean,

      // post, just write
      tasks.post,

      // index
      tasks.index,

      // image
      tasks.image,

      // sass
      tasks.sass,

      // favicon
      tasks.favicon

    ]).run({
      options: {
        src: src,
        dest: dest,
        port: options.port,
        quiet: options.quiet,
        ext: {
          handlebars: '.hbs',
          html: '.html',
          markdown: '.md'
        }
      },
      posts: [],
      templates: {
        layouts: {},
        pages: {},
        partials: {}
      },
      log: log
    }, function() {
      log(lpad('bgit!', 15) + '\n')

      server(options, log)
      watch(src, run, log)
    })
  })()

}

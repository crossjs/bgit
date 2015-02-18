'use strict';

var path = require('path');

var chalk = require('chalk');

var Runner = require('./runner');
var tasks = require('./tasks');
var watch = require('./watch');

var log = console.log;

log.error = function(err) {
  if (err.code === 'EADDRINUSE') {
    log.error('PREFER PORT IN USE');
  } else if (err.code === 'EACCES') {
    log.error('MAYBE WE NEED SUDO');
  } else {
    log(chalk.red('Errored: %s\n'), err.code || err);
  }

  process.exit(0);
};

module.exports = function(options) {

  chalk.enabled = true;

  var src = path.join(process.cwd(), options.src);
  var dest = path.join(process.cwd(), options.dest);

  // run
  (function run() {

    log('\n...\n');

    new Runner().use([

      // config
      tasks.config,

      // check, clean, make dest
      tasks.clean,

      // templates
      tasks.template,

      // posts, sort, etc
      tasks.posts,

      // post, just write
      tasks.post,

      // index
      tasks.index,

      // image
      tasks.image,

      // sass
      tasks.sass,

      // favicon
      tasks.favicon,

      // server
      tasks.server

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
      log('bgit!\n');

      watch(src, run, log);
    });
  })();

};

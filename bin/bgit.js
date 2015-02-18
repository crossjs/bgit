#!/usr/bin/env node

'use strict';

var commander = require('commander');

commander
  .version(require('../package').version, '-v, --version')
  .option('-s, --src <src>', 'Source root')
  .option('-d, --dest <dest>', 'Building destination')
  .option('-p, --port <port>', 'Listening port')
  .option('-q, --quiet', 'Not to open in browser')
  .parse(process.argv);

require('../lib/index')({
  src: commander.src || 'src',
  dest: commander.dest || 'dist',
  port: commander.port || 3000,
  quiet: commander.quiet
});

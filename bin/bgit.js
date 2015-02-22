#!/usr/bin/env node

'use strict';

var commander = require('commander')

commander
  .description([
    '',
    '      __          _ __ ',
    '     / /_  ____ _(_) /_',
    '    / __ \\/ __ `/ / __/',
    '   / /_/ / /_/ / / /_  ',
    '  /_.___/\\__, /_/\\__/  ',
    '        /____/         ',
    '',
    ''
    ].join('\n'))
  .version(require('../package').version, '-v, --version')
  .option('-q, --quiet', 'Not to open in browser')
  .option('-s, --src <src>', 'Source root')
  .option('-d, --dest <dest>', 'Build destination')
  .option('-p, --port <port>', 'Listening port')
  .parse(process.argv)

require('../lib/index')({
  quiet: commander.quiet,
  src: commander.src || 'src',
  dest: commander.dest || 'dist',
  port: commander.port || 3000
})

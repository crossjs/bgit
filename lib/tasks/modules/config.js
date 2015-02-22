'use strict';

var path = require('path')

var chalk = require('chalk')
var extend = require('extend')
var handlebars = require('handlebars')

var LINK_STYLES = {
  '0': '{{name}}{{ext}}',
  '1': '{{year}}/{{month}}/{{date}}/{{name}}{{ext}}'
}

module.exports = function config(io, next) {
  var config = io.config = extend({}, require(path.join(io.options.src, './config.json')))

  config.permalink = handlebars.compile(LINK_STYLES[config.permalink || '1'])

  io.log(chalk.yellow('initialize: %s\n'), 'global config loaded')

  io.log('')

  next()
}

'use strict';

var http = require('http')

var chalk = require('chalk')
var finalhandler = require('finalhandler')
var open = require('open')
var serveStatic = require('serve-static')

var _server

module.exports = function server(options, log) {

  if (_server) {
    return
  }

  chalk.enabled = true

  // Serve up public/ftp folder
  var serve = serveStatic(options.dest, {
    index: ['index.html', 'index.htm']
  })

  // Create server
  _server = http.createServer(function(req, res){
    serve(req, res, finalhandler(req, res))
  })

  _server.on('close', function() {
    _server = null
  })

  _server.on('error', function(err) {
    if (err.code === 'EADDRINUSE') {
      log.error('PREFER PORT IN USE')
    }

    if (err.code === 'EACCES') {
      log.error('MAYBE WE NEED SUDO')
    }

    log.error(err)
  })

  // Listen
  _server.listen(options.port, function() {
    log(chalk.blue('listening: %s\n'), options.port)

    if (!options.quiet) {
      open('http://127.0.0.1:' + options.port)
    }
  })
}

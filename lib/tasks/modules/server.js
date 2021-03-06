'use strict';

var http = require('http')

var chalk = require('chalk')
var finalhandler = require('finalhandler')
var open = require('open')
var serveStatic = require('serve-static')

var _server

module.exports = function server(io, next) {

  if (_server) {
    next()
    return
  }

  chalk.enabled = true

  // Serve up public/ftp folder
  var serve = serveStatic(io.options.dest, {
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
      io.log.error('PREFER PORT IN USE')
    }

    if (err.code === 'EACCES') {
      io.log.error('MAYBE WE NEED SUDO')
    }

    io.log.error(err)
  })

  // Listen
  _server.listen(io.options.port, function() {
    io.log(chalk.blue('listening: %s'), io.options.port)

    if (!io.options.quiet) {
      open('http://127.0.0.1:' + io.options.port)
    }

    next()
  })
}

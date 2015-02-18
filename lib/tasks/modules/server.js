'use strict';

var http = require('http');

var chalk = require('chalk');
var finalhandler = require('finalhandler');
var open = require('open');
var serveStatic = require('serve-static');

var __server;

module.exports = function server(io, next) {

  if (__server) {
    next();
    return;
  }

  chalk.enabled = true;

  // Serve up public/ftp folder
  var serve = serveStatic(io.options.dest, {
    index: ['index.html', 'index.htm']
  });

  // Create server
  __server = http.createServer(function(req, res){
    serve(req, res, finalhandler(req, res));
  });

  __server.on('close', function() {
    __server = null;
  });

  __server.on('error', function(err) {
    io.log.error(err);
  });

  // Listen
  __server.listen(io.options.port, function() {
    io.log(chalk.blue('Listening: %s'), io.options.port);

    if (!io.options.quiet) {
      open('http://127.0.0.1:' + io.options.port);
    }

    next();
  });
};

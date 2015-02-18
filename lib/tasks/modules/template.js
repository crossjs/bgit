'use strict';

var fs = require('fs');
var path = require('path');

var async = require('async');
var handlebars = require('handlebars');
var matter = require('gray-matter');

module.exports = function template(io, next) {

  function handleType(type, done) {
    var src = path.join(io.options.src, 'templates', type);
    var dest = io.templates[type];

    function handleFile(file, _done) {
      var result = matter.read(path.join(src, file));
      var filename = file.replace(new RegExp(io.options.ext.handlebars + '$'), '');

      if (!result.data) {
        result.data = {};
      }

      if (!result.content) {
        result.content = '';
      }

      dest[filename] = handlebars.compile(result.content);
      dest[filename].data = result.data;

      _done();
    }

    fs.readdir(src, function(err, files) {
      if (err) {
        io.log.error(err);
      }

      async.each(files, handleFile, function(err){
        if (err) {
          io.log.error(err);
        }

        done();
      });
    });
  }

  async.each(['layouts', 'pages', 'partials'], handleType, function(err) {
    if (err) {
      io.log.error(err);
    }

    next();
  });

};

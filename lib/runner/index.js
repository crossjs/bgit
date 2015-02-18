'use strict';

var chalk = require('chalk');
var table = require('text-table');

var Runner = function() {
  this.stack = [];
};

Runner.prototype.use = function(fn) {
  this.stack = this.stack.concat(fn);

  return this;
};

Runner.prototype.run = function(io, cb) {
  if (typeof io === 'function') {
    cb = io;
    io = {};
  }

  if (!io) {
    io = {};
  }

  var stack = this.stack;
  var i = 0;

  var stock = [];

  function time() {
    var total = 0;

    stock.forEach(function(line) {
      total += line[1];

      line[1] = chalk.magenta(line[1]) + ' ms';
    });

    console.log(table(stock, {
      align: [ 'r', 'r' ],
      hsep: ': '
    }));

    console.log('');
  }

  (function next() {
    // time hook
    if (i) {
      stock[i][1] = new Date() - stock[i][1];
    }

    var fn = stack[i++];

    if (!fn) {
      time();

      cb && cb(io);
      return;
    }

    // time hook
    stock[i] = [fn.name, new Date()];

    fn(io, next);
  })();
};

module.exports = Runner;

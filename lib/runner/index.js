'use strict';

var chalk = require('chalk')

function lpad(str, width) {
  var len = Math.max(0, width - str.length);
  return new Array(len + 1).join(' ') + str;
}

var Runner = function() {
  this.stack = []
}

Runner.prototype.use = function(fn) {
  this.stack = this.stack.concat(fn)

  return this
}

Runner.prototype.run = function(io, cb) {
  if (typeof io === 'function') {
    cb = io
    io = {}
  }

  if (!io) {
    io = {}
  }

  var stack = this.stack
  var i = 0

  var stock = []

  function time() {
    var total = 0

    stock.forEach(function(item) {
      total += item[1]

      // item[1] = chalk.magenta(item[1]) + ' ms'
    })

    stock.forEach(function(item) {
      item[0] = chalk.cyan(lpad(item[0], 14))
      item[1] = chalk.magenta(lpad(' ' + item[1], 6)) + ' ms' +
                lpad((item[1] / total * 100).toFixed(1), 6) + '%'

      console.log(item.join(':'))
    })

    console.log('')

    console.log([
      chalk.cyan(lpad('total', 14)),
      chalk.magenta(lpad(' ' + total, 6)) + ' ms'].join(':'))

    console.log('')
  }

  (function next() {
    // time hook
    if (i) {
      stock[i][1] = new Date() - stock[i][1]
    }

    var fn = stack[i++]

    if (!fn) {
      time()

      cb && cb(io)
      return
    }

    // time hook
    stock[i] = [fn.name, new Date()]

    fn(io, next)
  })()
}

module.exports = Runner

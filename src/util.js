var color = require('colors-cli')

module.exports = {
  log: function(text, type) {
    console.log(color.blue(text));
  },
  warn: function(text) {
    console.log(color.yellow(text));
  },
  success: function(text) {
    console.log(color.green(text));
  },
  error: function(text) {
    console.log(color.red(text));
  }
}

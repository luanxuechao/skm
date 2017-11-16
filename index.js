#! /usr/bin/env node
'use strict';
var program = require('commander');
var os = require('os');
const manager = require('./src/manager');
program
  .version('1.0.0')
  .option('-f, --foo', 'enable some foo', function() {

  })
  .option('-b, --bar', 'enable some bar')
  .option('-B, --baz', 'enable some baz');

// must be before .parse() since
// node's emit() is immediate

program.on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ custom-help --help');
  console.log('    $ custom-help -h');
  console.log('');
});

program
  .command('setup')
  .description('run remote setup commands')
  .action(function() {
    manager.init();
  });
program.parse(process.argv);

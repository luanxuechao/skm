#! /usr/bin/env node
'use strict'
const program = require('commander')
const Manager = require('./src/manager')
const PackageProperty = require('./package.json')
const config = require('./config.js')
const homedir = require('os').homedir()
const StorePath = homedir + config.StorePath
const SSHPath = homedir + config.SSHPath

const manager = new Manager(SSHPath, StorePath)
program
  .version(PackageProperty.version)

program.on('--help', function () {
  console.log('  Examples:')
  console.log('')
  console.log('    $ skm init')
  console.log('    $ skm ls')
  console.log('')
})

program
  .command('init')
  .description('init SSH key store')
  .action(function () {
    manager.init()
  })

program
  .command('ls')
  .description('List all the available SSH keys')
  .action(function () {
    manager.list()
  })

program
  .command('create [name]')
  .description('List all the available SSH keys')
  .option('-C,--email [email]')
  .action(function (name, options) {
    manager.create(name, options)
  })

program
  .command('use [name]')
  .description('use SSH keys')
  .action(function (name) {
    manager.use(name)
  })

program
  .command('delete [name]')
  .description('delete SSH keys')
  .action(function (name) {
    manager.delKey(name)
  })

program.parse(process.argv)

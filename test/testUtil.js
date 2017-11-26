const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')

const SSHPath = path.join(__dirname, '.ssh')
const StorePath = path.join(__dirname, '.skm')

function refreshTestDir () {
  rimraf.sync(SSHPath)
  rimraf.sync(StorePath)
  fs.mkdirSync(SSHPath)
}

function removeTestDir () {
  rimraf.sync(SSHPath)
  rimraf.sync(StorePath)
}

function mkdirTestDir () {
  rimraf.sync(SSHPath)
}

module.exports = {
  refreshTestDir,
  removeTestDir,
  mkdirTestDir
}

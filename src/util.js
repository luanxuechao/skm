const Promise = require('bluebird')
const color = require('colors-cli')
const config = require('../config.js')
const fileUtil = require('./fileUtil.js')
const path = require('path')
const fs = require('fs')
const readline = require('readline')
module.exports = {
  log: function (text, type) {
    console.log(color.blue(text))
  },
  warn: function (text) {
    console.log(color.yellow(text))
  },
  success: function (text) {
    console.log(color.green(text))
  },
  error: function (text) {
    console.log(color.red(text))
  },
  LoadSSHKeys: async function (storePath) {
    let sshKeys = new Map()
    let exists = await fileUtil.exists(storePath)
    if (!exists) {
      return module.exports.error('please execute this command after init !')
    }
    let files = await fileUtil.readdir(storePath)
    if (files.length === 0) {
      return module.exports.warn('You don\'t have any SSH key !')
    }
    if (files.indexOf('.DS_Store') > -1 && files.length === 1) {
      return module.exports.warn('You don\'t have any SSH key !')
    }
    let DSindex = files.indexOf('.DS_Store')
    if (DSindex > -1) {
      files.splice(DSindex, 1)
    }
    files.forEach(element => {
      sshKeys.set(element, fs.readFileSync(path.join(storePath, element, config.PublicKey)))
    })
    return sshKeys
  },
  stdin: function (text) {
    return new Promise((resolve, reject) => {
      let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      rl.question(color.yellow(text), (answer) => {
        resolve(answer)
        rl.close()
      })
    })
  },
  IsDefault: function (storePath,sshPath,name) {
    return new Promise(async function (resolve, reject) {
      let exists = await fileUtil.exists(path.join(sshPath, config.PrivateKey))
      if (!exists) {
        return resolve(false)
      }
      let defaultkey = fileUtil.readFileSync(path.join(sshPath, config.PublicKey))
      let key = fs.readFileSync(path.join(storePath, name, config.PublicKey))
      if (key.toString() === defaultkey.toString()) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  },
  clearKey: function (sshPath) {
    fs.unlinkSync(path.join(sshPath, config.PublicKey))
    fs.unlinkSync(path.join(sshPath, config.PrivateKey))
  }
}

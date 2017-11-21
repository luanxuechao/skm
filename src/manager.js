'use strict'
const config = require('../config.js')
const homedir = require('os').homedir()
const fileUtil = require('./fileUtil.js')
const util = require('./util')
const path = require('path')
const StorePath = homedir + config.StorePath
const SSHPath = homedir + config.SSHPath
const childProcess = require('child_process')
module.exports = {
  init: async function () {
    try {
      let exists = await fileUtil.exists(StorePath)
      if (!exists) {
        await fileUtil.mkdir(StorePath)
      }
      exists = await fileUtil.exists(path.join(SSHPath, config.PrivateKey))
      let defaultFloder = await fileUtil.exists(path.join(StorePath, config.DefaultKey))
      if (!defaultFloder && exists) {
        await fileUtil.mkdir(path.join(StorePath, config.DefaultKey))
      }
      if (exists) {
        await fileUtil.copyFile(path.join(SSHPath, config.PrivateKey), path.join(StorePath, config.DefaultKey, config.PrivateKey))
        await fileUtil.copyFile(path.join(SSHPath, config.PublicKey), path.join(StorePath, config.DefaultKey, config.PublicKey))
        util.success('SSH key store init success!')
      }
    } catch (err) {
      util.error(err.message)
    }
  },
  list: async function () {
    let storeKeys = await util.LoadSSHKeys()
    for (let key of storeKeys.keys()) {
      let inUse = await util.IsDefault(key)
      if (inUse) {
        util.success('* ' + key)
      } else {
        util.log(key)
      }
    }
  },
  create: async function (name, options) {
    try {
      if (!name) {
        return util.error('Please input key alias name!')
      }
      let storeKeys = await util.LoadSSHKeys()
      for (let key of storeKeys.keys()) {
        if (key === name) {
          return util.error('SSH key alias already exists, please choose another one')
        }
      }
      let argv = ''
      if (options.email) {
        argv += '-C '
        argv += options.email + ' '
      }
      argv += '-f'
      argv += ' ' + path.join(StorePath, name, 'id_rsa')
      console.log('ssh-keygen ' + argv)
      childProcess.exec('ssh-keygen ' + argv, function (err, stdout, stderr) {
        if (err) console.log(err)
        util.log(stdout)
      })
    } catch (err) {
      util.error(err.message)
    }
  },
  use: async function (name) {
    try {
      if (!name) {
        return util.error('Please input key alias name!')
      }
      let exists = await fileUtil.exists(path.join(StorePath, name))
      if (!exists) {
        return util.error('this alias name not found!')
      }
      await fileUtil.copyFile(path.join(StorePath, name, config.PrivateKey), path.join(SSHPath, config.PrivateKey))
      await fileUtil.copyFile(path.join(StorePath, name, config.PublicKey), path.join(SSHPath, config.PublicKey))
      util.success('Now using SSH key: ' + name)
    } catch (err) {
      util.error(err.message)
    }
  },
  delKey: async function (name) {
    try {
      if (!name) {
        return util.error('Please input key alias name!')
      }
      let exists = await fileUtil.exists(path.join(StorePath, name))
      if (!exists) {
        return util.error('this alias name not found!')
      }
      let text
      let inUse = await util.IsDefault(name)
      if (inUse) {
        text = `SSH key [${name}]  is currently in use, please confirm to delete it [y/n]:`
      } else {
        text = `Please confirm to delete SSH key [${name}] [y/n]:`
      }
      let confirm = await util.stdin(text)
      if (confirm !== 'y') {
        return
      }
      await fileUtil.rmdir(path.join(StorePath, name))
      if (inUse) {
        util.clearKey()
      }
      util.success(`SSH key [${name}] deleted`)
    } catch (err) {
      util.error(err.message)
    }
  }
}

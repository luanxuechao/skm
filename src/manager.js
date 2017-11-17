'use strict';
const config = require('../config.js');
const homedir = require('os').homedir();
const fileUtil = require('./fileUtil.js');
const util = require('./util');
const path = require('path');
const StorePath = homedir + config.StorePath;
const SSHPath = homedir + config.SSHPath;
const child_process = require('child_process');
module.exports = {
  init: async function() {
    try {

      let exists = await fileUtil.exists(StorePath);
      let floder;
      if (!exists) {
        floder = await fileUtil.mkdir(StorePath);
      }
      exists = await fileUtil.exists(path.join(SSHPath, config.PrivateKey));
      let defaultFloder = await fileUtil.exists(path.join(StorePath, config.DefaultKey));
      if (!defaultFloder && exists) {
        floder = await fileUtil.mkdir(path.join(StorePath, config.DefaultKey));
      }
      if (exists) {
        floder = await fileUtil.copyFile(path.join(SSHPath, config.PrivateKey), path.join(StorePath, config.DefaultKey, config.PrivateKey));
        floder = await fileUtil.copyFile(path.join(SSHPath, config.PublicKey), path.join(StorePath, config.DefaultKey, config.PublicKey));
        util.success('SSH key store init success!');
      }
    } catch (err) {
      util.error(JSON.stringify(err));
    }
  },
  list: async function() {
    let storeKeys = await util.LoadSSHKeys();
    let defaultkey = fileUtil.readFileSync(path.join(SSHPath, config.PublicKey));
    for (let key of storeKeys.keys()) {
      if (storeKeys.get(key).equals(defaultkey)) {
        util.success('* ' + key);
      } else {
        util.log(key);
      }
    }
  },
  create: async function(name, options) {
    try {
      if (!name) {
        return util.error('Please input key alias name!');
      }
      let storeKeys = await util.LoadSSHKeys();
      for (let key of storeKeys.keys()) {
        if (key == name) {
          return util.error('SSH key alias already exists, please choose another one');
        }
      }
      let folder = fileUtil.mkdir(path.join(StorePath, name));
      let argv = '';
      if (options.email) {
        argv += '-C ';
        argv +=  options.email+" "
      }
      argv += '-f';
      argv += ' ' + path.join(StorePath, name, 'id_rsa');
      console.log('ssh-keygen ' + argv);
      child_process.exec('ssh-keygen ' + argv, function(err, stdout, stderr) {
        if(err) console.log(err);
        util.log(stdout);
      });
    } catch (err) {
      util.error(JSON.stringify(err));
    }
  }
};

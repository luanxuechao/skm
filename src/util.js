var color = require('colors-cli')
const homedir = require('os').homedir();
const config = require('../config.js');
const StorePath = homedir + config.StorePath;
const SSHPath = homedir + config.SSHPath;
const fileUtil = require('./fileUtil.js');
const path = require('path');
const fs = require('fs');
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
  },
  LoadSSHKeys: async function() {
    let sshKeys =  new Map();
    let exists = await fileUtil.exists(StorePath);
    if (!exists) {
      return module.exports.error('please execute this command after init !')
    }
    let files = await fileUtil.readdir(StorePath);
    if (files.length == 0) {
      return module.exports.warn('You don\'t have any SSH key !')
    }
    if(files.indexOf('.DS_Store') > -1 && files.length == 1){
      return module.exports.warn('You don\'t have any SSH key !')
    }
    let DSindex =files.indexOf('.DS_Store');
    if(DSindex >-1){
      files.splice(DSindex, 1);
    }
    files.forEach(element => {
      sshKeys.set(element,fs.readFileSync(path.join(StorePath,element,config.PublicKey)));
    });
    return sshKeys;
  }
}

'use strict';
const config = require('../config.js');
const homedir = require('os').homedir();
const fileUtil = require('./fileUtil.js');
const util = require('./util');
const path = require('path');
module.exports = {
  init: async function() {
    try {
      let StorePath = homedir + config.StorePath;
      let SSHPath = homedir + config.SSHPath;
      let exists = await fileUtil.exists(StorePath);
      let floder;
      if (!exists) {
        floder = await fileUtil.mkdir(StorePath);
      }
      console.log(exists);
      exists = await fileUtil.exists(path.join(SSHPath,config.PrivateKey));
      console.log(exists);
      let defaultFloder = await fileUtil.exists(path.join(StorePath,config.DefaultKey));
      if(!defaultFloder && exists){
        floder = await fileUtil.mkdir(path.join(StorePath,config.DefaultKey));
        // console.log(floder);
        // floder  = await fileUtil.mkdir(path.join(StorePath,config.DefaultKey,config.PrivateKey));
        // floder  = await fileUtil.mkdir(path.join(StorePath,config.DefaultKey,config.PublicKey));
      }
      if (exists) {
        console.log(path.join(StorePath,config.DefaultKey,config.PrivateKey))
        floder = await fileUtil.copyFile(path.join(SSHPath,config.PrivateKey),path.join(StorePath,config.DefaultKey,config.PrivateKey));
        floder = await fileUtil.copyFile(path.join(SSHPath,config.PublicKey),path.join(StorePath,config.DefaultKey,config.PublicKey));
        util.success('SSH key store init success!');
      }

    } catch (err) {
      console.log(err);
      util.error(JSON.stringify(err));
    }
  }
};

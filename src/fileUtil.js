const fs = require('fs');
var Promise = require("bluebird");
module.exports = {
  exists: function(dir) {
    console.log(dir);
    return new Promise(function(resolve, reject) {
      fs.stat(dir, function(err, exists) {
        if (exists) {
          return resolve(true);
        } else if (err.errno == '-2') {
          return resolve(false);
        } else {
          return reject(err);
        }
      });
    });
  },
  mkdir:  function(dir) {
    return new Promise(function(resolve, reject) {
      fs.mkdir(dir, function(err, floder) {
        if (err) {
          return reject(err);
        } else {
          return resolve(floder);
        }
      })
    });
  },
  rename: function(oldPath, newPath) {
    return new Promise(function(resolve, reject) {
      fs.rename(oldPath,newPath,function(err, floder) {
        if (err) {
          return reject(err);
        } else {
          return resolve(floder);
        }
      })
    });
  },
  copyFile: function(oldPath, newPath){
    return new Promise(function(resolve, reject) {
      fs.writeFile(newPath,fs.readFileSync(oldPath), function(err){
        if(err) return reject(err);
        return resolve(true);
      })
    });
  }
}

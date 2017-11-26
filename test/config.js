'use strcit'
const path = require('path')

const SSHPath = path.resolve(__dirname, '.ssh')
const StorePath = path.resolve(__dirname, '.skm')
const PublicKey = 'id_rsa.pub'
const PrivateKey = 'id_rsa'
const DefaultKey = 'default'

module.exports = {
  SSHPath,
  StorePath,
  PublicKey,
  PrivateKey,
  DefaultKey
}

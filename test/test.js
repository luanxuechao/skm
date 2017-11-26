const common = require('./common')
const config = require('./config')
const testUtil = require('./testUtil')
const Manager = require('../src/manager')
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const Assert = common.assert
before(() => {
  testUtil.refreshTestDir()
})
after(() => {
  testUtil.removeTestDir()
})
describe('check manager', () => {
  describe(' ssh key store', () => {
    it('init skm store successfully', async () => {
      const manager = new Manager(config.SSHPath, config.StorePath)
      shell.exec(`ssh-keygen -f ${path.join(config.SSHPath, config.PrivateKey)} -C "" -N "" -q`)
      await manager.init()
      const storePubKeyPath = path.join(config.StorePath, config.DefaultKey, config.PublicKey)
      const storePriKeyPath = path.join(config.StorePath, config.DefaultKey, config.PrivateKey)
      const sshPubKeyPath = path.join(config.SSHPath, config.PublicKey)
      const sshPriKeyPath = path.join(config.SSHPath, config.PrivateKey)
      Assert.ok(fs.existsSync(storePriKeyPath))
      Assert.ok(fs.existsSync(storePubKeyPath))
      Assert.deepEqual(fs.readFileSync(sshPubKeyPath), fs.readFileSync(storePubKeyPath))
      Assert.deepEqual(fs.readFileSync(sshPriKeyPath), fs.readFileSync(storePriKeyPath))
    })
    it('create ssh key successfully', async () => {
      const manager = new Manager(config.SSHPath, config.StorePath)
      const storePubKeyPath = path.join(config.StorePath, 'test', config.PublicKey)
      await manager.create('test', {'email': 'test@qq.com'})
      Assert.ok(fs.existsSync(storePubKeyPath))
    })
  })
})

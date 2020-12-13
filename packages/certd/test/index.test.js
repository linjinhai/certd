import pkg from 'chai'
import { Certd } from '../src/index.js'
import options from './options.js'
import forge from 'node-forge'
const { expect } = pkg
describe('Certd', function () {
  it('#buildCertDir', function () {
    const certd = new Certd()
    const rootDir = certd.buildCertDir('xiaojunnuo@qq.com', options.cert.domains)
    console.log('rootDir', rootDir)
    expect(rootDir).match(/xiaojunnuo@qq.com\\cert\\(.*)\\(.*)/)
  })
  it('#writeCert', async function () {
    const certd = new Certd()
    certd.writeCert('xiaojunnuo@qq.com', ['*.domain.cn'], { csr: 'csr', crt: 'aaa', key: 'bbb' })
  })
  it('#certApply', async function () {
    this.timeout(80000)
    const certd = new Certd()
    const cert = await certd.certApply(options)
    expect(cert).ok
    expect(cert.cert).ok
    expect(cert.key).to.be.ok
  })

  it('#readCurrentCert', async function () {
    const certd = new Certd()
    const cert = certd.readCurrentCert('xiaojunnuo@qq.com', ['*.docmirror.cn'])
    expect(cert).to.be.ok
    expect(cert.crt).ok
    expect(cert.key).to.be.ok
    expect(cert.detail).to.be.ok
    expect(cert.expires).to.be.ok
    console.log('expires:', cert.expires)
  })
})

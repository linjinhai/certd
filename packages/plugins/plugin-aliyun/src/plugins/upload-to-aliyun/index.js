import Core from '@alicloud/pop-core'
import { AbstractAliyunPlugin } from '../abstract-aliyun.js'
import { ZoneOptions } from '../../utils/index.js'

const define = {
  name: 'uploadCertToAliyun',
  title: '上传证书到阿里云',
  desc: '',
  input: {
    name: {
      title: '证书名称',
      helper: '证书上传后将以此参数作为名称前缀'
    },
    regionId: {
      title: '大区',
      value: 'cn-hangzhou',
      component: {
        name: 'a-select',
        vModel: 'value',
        options: ZoneOptions
      },
      required: true
    },
    accessProvider: {
      title: 'Access授权',
      helper: 'Access授权',
      component: {
        name: 'access-selector',
        type: 'aliyun'
      },
      required: true
    }
  },
  output: {
    aliyunCertId: {
      type: String,
      desc: '上传成功后的阿里云CertId'
    }
  }
}

export class UploadCertToAliyun extends AbstractAliyunPlugin {
  static define () {
    return define
  }

  getClient (aliyunProvider) {
    return new Core({
      accessKeyId: aliyunProvider.accessKeyId,
      accessKeySecret: aliyunProvider.accessKeySecret,
      endpoint: 'https://cas.aliyuncs.com',
      apiVersion: '2018-07-13'
    })
  }

  async execute ({ cert, props, context }) {
    const { name, accessProvider } = props
    const certName = this.appendTimeSuffix(name || cert.domain)
    const params = {
      RegionId: props.regionId || 'cn-hangzhou',
      Name: certName,
      Cert: cert.crt,
      Key: cert.key
    }

    const requestOption = {
      method: 'POST'
    }

    const provider = this.getAccessProvider(accessProvider)
    const client = this.getClient(provider)
    const ret = await client.request('CreateUserCertificate', params, requestOption)
    this.checkRet(ret)
    this.logger.info('证书上传成功：aliyunCertId=', ret.CertId)
    context.aliyunCertId = ret.CertId
  }

  /**
   * 没用，现在阿里云证书不允许删除
   * @param accessProviders
   * @param cert
   * @param props
   * @param context
   * @returns {Promise<void>}
   */
  async rollback ({ cert, props, context }) {
    const { accessProvider } = props
    const { aliyunCertId } = context
    this.logger.info('准备删除阿里云证书:', aliyunCertId)
    const params = {
      RegionId: props.regionId || 'cn-hangzhou',
      CertId: aliyunCertId
    }

    const requestOption = {
      method: 'POST'
    }

    const provider = this.getAccessProvider(accessProvider)
    const client = this.getClient(provider)
    const ret = await client.request('DeleteUserCertificate', params, requestOption)
    this.checkRet(ret)
    this.logger.info('证书删除成功:', aliyunCertId)
    delete context.aliyunCertId
  }
}

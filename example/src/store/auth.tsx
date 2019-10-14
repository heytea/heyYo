import { observable, action, computed } from 'mobx'
import Store from 'store'
import { IFormStatus } from 'heyyo/dist/store/_i'
import { IResult } from 'heyyo/dist/unit/http'
import { ICURD } from 'heyyo/dist/store/curd'
import { IForm } from 'heyyo/dist/store/form'
import { getInfo, login, reset, logout, getCode, getImgCaptcha } from '../api/admin'
import { Form } from 'heyyo'
import Config from '../config'
import { setToken } from '../api/http'

const { codeValidated, codeSuccess, apiFormat: { code } } = Config

interface IUser {
  id: number,
  name: string
}

export interface IAuth {
  dataFn: { [key: string]: (...args: any) => Promise<IResult> }
  dfUser: IUser,
  user: IUser,
  referrer: string,

  setUser(user?: IUser): void,

  setReferrer(url: string): void,

  infoLoading: boolean

  getInfo(): Promise<IResult>,


  loginStatus: IFormStatus,
  loginForm: { name: string, password: string },
  loginErrs: { name: string, password: string },
  loginFormConf: any,

  login(): Promise<IResult>,

  logout(): Promise<IResult>,

  resetStatus: IFormStatus,
  resetForm: { phoneOrMail: string, captcha: string, password: string, rePassword: string },
  resetErrs: { phoneOrMail: string, captcha: string, password: string, rePassword: string },
  resetFormConf: any,

  reset(): Promise<IResult>,
}

@Form
class Auth implements IAuth {
  @observable dict = { loginImgCaptcha: { uuid: '', img: '' }, resetImgCaptcha: { uuid: '', img: '' } }
  dataFn = { login, getInfo, reset, logout, getImgCaptcha, getCode }
  dfUser = { id: 0, name: '' }
  @observable user: IUser = { ...this.dfUser, ...(Store.get('user') || {}) }
  @observable referrer: string = ''

  @action
  setUser = (userObj: IUser = this.dfUser) => {
    this.user = { ...this.user, ...userObj }
    Store.set('user', this.user)
  }

  @action
  setReferrer = (url: string): void => {
    this.referrer = url
  }

  @action setCaptcha(type: string, data: { uuid: string, img: string }) {
    // @ts-ignore
    this.dict[`${type}ImgCaptcha`] = data
    // @ts-ignore
    this[`${type}Form`] && (this[`${type}Form`].imgUuid = data.uuid)
  }

  @action
  async getCaptcha(type: string) {
    const data = await this.dataFn.getImgCaptcha(type)
    if (data[code] === codeSuccess) {
      const { uuid, img } = data.data
      this.setCaptcha(type, { uuid, img })
    }
  }

  // 登录
  dfLoginForm = { name: '', password: '', imgUuid: '', imgCaptcha: '' }
  @observable loginStatus: IFormStatus = { submit: false, loading: false }
  @observable loginForm = { ...this.dfLoginForm }
  @observable loginErrs = { name: '', password: '', imgCaptcha: '' }

  @computed get loginFormConf() {
    return {
      fields: [
        {
          field: 'name',
          type: 'input',
          span: 24,
          rules: 'required',
          aliasName: '邮箱/手机',
          props: { placeholder: '用户名' }
        },
        {
          field: 'password',
          type: 'input',
          span: 24,
          rules: 'required|password',
          aliasName: '密码',
          props: { type: 'password', placeholder: '密码' },
        },
        {
          field: 'imgCaptcha',
          type: this.dict.loginImgCaptcha.img ? 'imgCaptcha' : 'none',
          span: 24,
          rules: 'imgCaptcha',
          aliasName: '验证码',
          data: 'loginImgCaptcha',
          props: { onGetImg: () => this.getCaptcha('login') }
        }
      ]
    }
  }

  @action
  login = async (): Promise<IResult> => {
    this.loginStatus.loading = true
    const userData = await this.dataFn.login(this.loginForm, '登录成功')
    const { code, msg, data } = userData
    if (code === codeValidated) {
      this.loginErrs = Object.assign(this.loginErrs, msg)
      const { uuid = '', img = '' } = data || {}
      img && this.setCaptcha('login', { uuid, img })
    } else if (code === codeSuccess) {
      this.setUser(data.user)
      setToken(data.tokenObj)
      this.loginForm = { ...this.dfLoginForm }
    }
    this.loginStatus.loading = false
    return userData
  }

  // 获取用户信息
  @observable infoLoading = false
  @action
  getInfo = async () => {
    this.infoLoading = true
    const userData = await this.dataFn.getInfo()
    const { code, data } = userData
    code === codeSuccess ? this.setUser(data) : this.setUser(this.dfUser)
    this.infoLoading = false
    return userData
  }

  // 重置密码
  dfResetForm = { phoneOrMail: '', captcha: '', password: '', rePassword: '', imgCaptcha: '', imgUuid: '' }
  @observable resetStatus = { submit: false, loading: false }
  @observable resetForm = { ...this.dfResetForm }
  @observable resetErrs = { phoneOrMail: '', password: '', captcha: '', rePassword: '', imgCaptcha: '' }
  @action
  getResetCode = async () => {
    const { imgCaptcha, imgUuid, phoneOrMail } = this.resetForm
    const data = await this.dataFn.getCode({ phoneOrMail, action: 'reset', imgCaptcha, imgUuid })
    if (data.code === 403001) {
      this.dict.resetImgCaptcha = data.data
      this.resetForm.imgUuid = data.data.uuid
    }
    return data
  }

  @computed get resetFormConf() {
    const { resetErrs: { phoneOrMail: eUsername }, resetForm: { phoneOrMail } } = this
    return {
      fields: [
        {
          field: 'phoneOrMail',
          type: 'input',
          span: 24,
          rules: 'required|phoneOrMail',
          aliasName: '用户名',
          props: { placeholder: '用户名' }
        },
        {
          field: 'imgCaptcha',
          type: this.dict.resetImgCaptcha.img ? 'imgCaptcha' : 'none',
          span: 24,
          rules: 'imgCaptcha',
          aliasName: '验证码',
          data: 'resetImgCaptcha',
          props: { onGetImg: () => this.getCaptcha('reset') }
        },
        {
          field: 'captcha',
          type: 'captcha',
          span: 24,
          rules: 'required|captcha',
          aliasName: '验证码',
          data: 'resetImgCaptcha',
          props: {
            placeholder: '验证码',
            isActive: !eUsername && phoneOrMail,
            onGetCode: this.getResetCode
          }
        },
        {
          field: 'password',
          type: 'input',
          span: 24,
          rules: 'required|password',
          aliasName: '密码',
          props: { type: 'password', placeholder: '密码', autoComplete: 'new-password' },
        },
        {
          field: 'rePassword',
          type: 'input',
          span: 24,
          rules: { required: '', password: '', equals: { field: 'password', original: '确认密码', equal: '密码' } },
          aliasName: '确认密码',
          props: { type: 'password', placeholder: '确认密码', autoComplete: 'new-password' },
        }
      ]
    }
  }

  @action
  reset = async (): Promise<IResult> => {
    this.resetStatus.loading = true
    const userData = await this.dataFn.reset(this.resetForm)
    const { code, msg, data } = userData
    if (code === codeValidated) {
      this.resetErrs = Object.assign(this.resetErrs, msg)
    } else if (code === codeSuccess) {
      this.setUser(data.user)
      setToken(data.tokenObj)
      this.resetForm = { ...this.dfResetForm }
    }
    this.resetStatus.loading = false
    return userData
  }

  @action
  logout = async () => {
    const outData = await this.dataFn.logout()
    if (outData[code] === codeSuccess || outData.status === 204) {
      this.setUser(this.dfUser)
    }
    return outData
  }
}

export default new Auth() as Auth & ICURD<IResult> & IForm

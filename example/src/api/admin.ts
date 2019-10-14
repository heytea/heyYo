import Http from './http'
import Store from 'store'

const { httpGet, httpPost } = Http

interface ILogin {
  name: string,
  password: string
}

interface IReset {
  phoneOrMail: string,
  captcha: string,
  password: string,
}

export function getInfo() {
  return httpGet('/api/index', '', false)
}

export function getPrivilege() {
  return httpPost('/api/my/privilege', '', false)
}

export async function login(data: ILogin, tips: boolean | string = false) {
  const loginData = await httpPost('/api/login', data, tips)
  if (loginData.code === 0) {
    const token = loginData.headers && loginData.headers.token
    token && Store.set('token', token)
  }
  return loginData
}


export async function getImgCaptcha(type: string) {
  return httpPost('/api/captcha/img', type, false)
}

export async function getPhoneCaptcha(opt: { phone: string, action: string, imgCaptcha: string, imgUuid: string }) {
  return httpPost('/api/captcha/phone', opt)
}

export async function getMailCaptcha(opt: { mail: string, action: string, imgCaptcha: string, imgUuid: string }) {
  return httpPost('/api/captcha/mail', opt)
}

export async function getCode({ phoneOrMail, action, imgCaptcha, imgUuid }: { phoneOrMail: string, action: string, imgCaptcha: string, imgUuid: string }) {
  return /\d+/.test(phoneOrMail) ?
    getPhoneCaptcha({ phone: phoneOrMail, action, imgCaptcha, imgUuid }) :
    getMailCaptcha({ mail: phoneOrMail, action, imgCaptcha, imgUuid })
}

export async function reset(data: IReset, tips: boolean | string = false) {
  return httpPost('/api/reset', data, tips)
}


export async function logout(data?: IReset, tips: boolean | string = false) {
  return httpPost('/api/logout', data, tips)
}

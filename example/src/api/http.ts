import { HTTP } from 'heyyo'
import Store from 'store'
import Config from '../config'
import { IBeforeFn, IBeforeFnOpt } from 'heyyo/dist/unit/http'

export interface ITokenObj {
  time: number,
  token: string
}

let tokenObj: ITokenObj = Store.get('token') || { time: 0, token: '' }

export function setToken(opt: ITokenObj) {
  tokenObj = opt
  Store.set('token', opt)
}

export function clearToken() {
  tokenObj.time = 0
  tokenObj.token = ''
  Store.remove('token')
}

const beforeFn: IBeforeFn = function ({ url, data, conf = {} }: IBeforeFnOpt) {
  const opt: IBeforeFnOpt = { url: url, data, conf }
  const { hosts } = Config
  opt.url = url.replace(/^\/([\w\d]+)\//, (a1, a2) => a2 && hosts && hosts[a2] ? `${hosts[a2]}/` : a1)
  const { token = '' } = tokenObj || Store.get('token') || {}
  if (token) {
    !conf.headers && (conf.headers = {})
    conf.headers.Authorization = 'Bearer ' + token
  }
  return opt
}
// const afterFn: IAfterFn = (res = {}) => {
//   if (res.data && res.data.code === 401001) {
//     clearToken()
//   }
//   return res.data
// }
const Http = HTTP({ beforeFn })
export default Http
const { httpDel, httpGet, httpPatch, httpPost, httpPut } = Http
export const HttpMap = { get: httpGet, post: httpPost, del: httpDel, patch: httpPatch, put: httpPut }

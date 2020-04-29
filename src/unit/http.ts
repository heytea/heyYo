import Axios, { AxiosRequestConfig } from 'axios'
import { notification } from 'antd'

export interface IResult {
  code: number | string,
  msg: string,
  data: any,
  status?: number,
  headers?: { [key: string]: any },

  [key: string]: any
}

type TMethod = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'

export interface IMethod {
  (url: string, data?: Object | string, tips?: boolean | string, conf?: Object): Promise<IResult>
}

export interface IBeforeFnOpt {
  url: string,
  data?: object,
  conf?: AxiosRequestConfig
}

export type IBeforeFn = (opt: IBeforeFnOpt) => Promise<IBeforeFnOpt> | IBeforeFnOpt
export type IAfterFn = (data: any) => Promise<IResult> | IResult

export interface IHttp {
  beforeFn?: IBeforeFn,
  afterFn?: IAfterFn,
  conf?: AxiosRequestConfig
}

export const dfData: IResult = { code: '', msg: '', data: '' }
export const dfDataArr: IResult = { code: '', msg: '', data: [] }
export const dfDataObj: IResult = { code: '', msg: '', data: {} }
export const dfDataPage: IResult = { code: '', msg: '', data: { data: [] } }

export default function HTTP(opt?: IHttp) {
  const { beforeFn = '', afterFn = '', conf = {} } = opt || {}
  const axiox = Axios.create({
    timeout: 30000,
    responseType: 'json',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    ...conf
  })

  const handleTips = (tips: string | boolean, result: IResult) => {
    if (tips) {
      if (result.code === 0) {
        notification.success({
          message: typeof tips === 'string' ? tips : result.msg,
        })
      } else {
        let errmsg = ''
        if (result.msg && typeof result.msg === 'object') {
          // @ts-ignore
          Object.keys(result.msg).forEach((key: string) => errmsg += ` ${key}: ${result.msg[key]}`)
        } else {
          errmsg = result.msg
        }
        notification.error({
          message: result.code,
          description: errmsg,
        })
      }
    }
  }

  const AjaxFn = async function (method: TMethod, url: string, data: object = {}, tips: boolean | string = false, conf: { [key: string]: any } = {}): Promise<IResult> {
    const fn = axiox[method]
    let newUrl = url
    let newData = data
    let newConf = conf
    if (typeof beforeFn === "function") {
      const beforeObj = await beforeFn({ url, data, conf })
      newUrl = beforeObj.url
      newData = beforeObj.data || {}
      newConf = beforeObj.conf || {}
    }

    let result: IResult = { code: 1, msg: '', data: '' }
    let ajaxResult

    try {
      if (['get', 'delete', 'head', 'options'].indexOf(method) >= 0) {
        // @ts-ignore
        ajaxResult = await fn(newUrl, { ...newConf, params: newData })
      } else {
        // @ts-ignore
        ajaxResult = await fn(newUrl, newData, newConf)
      }
    } catch (e) {
      if (!e.response) {
        result.msg = e.message
        result.code = 600 // 网络错误
        result.status = 600 // 网络错误
        handleTips(tips, result)
        return result
      } else {
        if (typeof afterFn === "function") {
          result = await afterFn(e.response)
        } else {
          const { status, statusText, headers, data = {} } = e.response
          result.code = data && data.code || status
          result.msg = data && data.msg || statusText
          result.headers = headers
          result.status = status
        }
      }
      handleTips(tips, result)
      return result
    }
    if (typeof afterFn === "function") {
      result = await afterFn(ajaxResult)
    } else {
      if (['text', 'arraybuffer'].indexOf(conf.responseType) >= 0) {
        result = { code: 0, msg: '', data: ajaxResult.data }
      } else {
        result = { ...result, ...ajaxResult.data }
      }
      result.headers = ajaxResult.headers
      result.status = ajaxResult.status
    }
    handleTips(tips, result)
    return result
  }

  const httpGet: IMethod = async function (url: string, data: Object = {}, tips: boolean | string = false, conf: Object = {}): Promise<IResult> {
    return AjaxFn('get', url, data, tips, conf)
  }
  const httpPost: IMethod = async function (url: string, data: Object = {}, tips: boolean | string = '操作成功', conf: Object = {}): Promise<IResult> {
    return AjaxFn('post', url, data, tips, conf)
  }
  const httpPatch: IMethod = async function (url: string, data: Object = {}, tips: boolean | string = '操作成功', conf: Object = {}): Promise<IResult> {
    return AjaxFn('patch', url, data, tips, conf)
  }
  const httpPut: IMethod = async function (url: string, data: Object = {}, tips: boolean | string = '添加成功', conf: Object = {}): Promise<IResult> {
    return AjaxFn('put', url, data, tips, conf)
  }
  const httpDel: IMethod = async function (url: string, data: Object = {}, tips: boolean | string = '删除成功', conf: Object = {}): Promise<IResult> {
    return AjaxFn('delete', url, data, tips, conf)
  }

  return { httpGet, httpPost, httpPatch, httpPut, httpDel, dfData, dfDataArr, dfDataObj, dfDataPage }
}


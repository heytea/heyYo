import { action } from 'mobx'
import Validator from '../form/validator'
import XSS from 'xss'
import Conf from "../config";

export const dfWhiteList: { [key: string]: any } = XSS.whiteList
dfWhiteList.embed = ['src', 'allowfullscreen', 'quality', 'width', 'height', 'align', 'type', 'allowscriptaccess']
Object.keys(dfWhiteList).forEach(key => {
  dfWhiteList[key].push('style')
})

interface ISetFormOpt {
  name?: string,
  valObj?: { [key: string]: any },
  isXss?: boolean,
  trimType?: 'left' | 'right' | true | false,
  isVerify?: boolean
}

export interface IForm {

  setForm(opt: ISetFormOpt): void,

  outHtml(content: string): any,

  setErrs(opt: { name: string, data: object }): void,

  getUrlParamsFieldArr(obj?: { page?: boolean, formName?: string }): Array<string>,

  getUrlParamsStr(opt: { formName?: string, page?: boolean, sorter?: boolean }): string,

  getUrlParamsVal(opt: { fields?: Array<any>, url?: string }): { [key: string]: string },

  urlSetForm(opt: { name?: string, url?: string, isVerify?: boolean }): void
}

const { apiFormat } = Conf
export default function <T extends { new(...args: any[]): {} }>(target: T, { whiteList = dfWhiteList, format = apiFormat } = {}) {
  const xss = new XSS.FilterXSS({ whiteList })
  const validator = new Validator()
  return class Form extends target implements IForm {
    xss = xss
    setForm = action(({ name = '', valObj = {}, isXss = true, trimType, isVerify = true }: ISetFormOpt = {}) => {
      const form = this[`${name}Form`]
      const rules = {} // 校验规则
      const htmlFieldMap = {} // html 字段
      const formConf = this[`${name}FormConf`] || {}
      const { fields, blocks } = formConf
      if (fields) {
        fields.forEach((item: any) => {
          if (item.rules) {
            rules[item.field] = {
              rules: item.rules,
              aliasName: item.aliasName || item.title,
              defined: item.defined
            }
          }
          if (item.type === 'editor') {
            htmlFieldMap[item.field] = true
          }
        })
      } else if (blocks) {
        typeof blocks.forEach === 'function' && blocks.forEach((block: any) => {
          block.fields && typeof block.fields.forEach === 'function' && block.fields.forEach((item: any) => {
            if (item.rules && item.field) {
              rules[item.field] = { rules: item.rules, aliasName: item.aliasName || item.title }
            }
            if (item.type === 'editor') {
              htmlFieldMap[item.field] = true
            }
          })
        })
      }
      const errs = this[`${name}Errs`]
      Object.keys(valObj).forEach((key) => {
        let tmpValue = valObj[key]
        if (form && !htmlFieldMap[key] && typeof form[key] !== 'undefined') {
          tmpValue = (isXss && typeof tmpValue === 'string') ? xss.process(tmpValue) : tmpValue
          if (tmpValue && typeof tmpValue.replace === 'function') {
            if (trimType === 'left') {
              tmpValue = tmpValue.replace(/^[\s\uFEFF\xA0]+/, '')
            } else if (trimType === 'right') {
              tmpValue = tmpValue.replace(/[\s\uFEFF\xA0]+$/, '')
            } else if (trimType === true) {
              tmpValue.trim()
            }
          }
        }
        form[key] = tmpValue
        if (isVerify && rules && rules[key] && errs && typeof errs[key] !== 'undefined') {
          errs[key] = validator.check({ value: tmpValue, ruleObj: rules[key], form })
        }
      })
      // isSubmit
      let isSubmit = true
      const status = this[`${name}Status`]
      if (typeof status === 'object' && typeof form === 'object') {
        const errKeys = typeof errs === 'object' ? Object.keys(errs) : []
        for (let i = 0; i < errKeys.length; i += 1) {
          if (errs[errKeys[i]]) {
            isSubmit = false
            break
          }
        }
        const ruleKeys = typeof rules === 'object' ? Object.keys(rules) : []
        for (let i = 0; i < ruleKeys.length; i += 1) {
          const tmpKey = ruleKeys[i]
          const tmpRules = rules[tmpKey] ? rules[tmpKey].rules || '' : ''
          if ((typeof tmpRules === 'string' && tmpRules.indexOf('required') >= 0 || typeof tmpRules === 'object' && tmpRules.hasOwnProperty('required')) && (typeof form[tmpKey] === undefined || form[tmpKey] === '')) {
            isSubmit = false
            break
          }
        }
        status.submit = isSubmit
      }
      // this.isSubmit(name)
    })

    outHtml(content: string) {
      return { __html: xss.process(content) }
    }

    setErrs = action(({ name = '', data = {} }) => {

      this[`${name}Errs`] && (this[`${name}Errs`] = { ...this[`${name}Errs`], ...data })
    })

    // 获取表单配置的字段
    getUrlParamsFieldArr = action(({ page = false, formName = 'list' }: { page?: boolean, formName?: string } = {}) => {
      const listForm = this[`${formName}Form`]
      const listFormConf = this[`${formName}FormConf`]
      if (typeof listForm !== 'object') {
        return []
      }
      let fieldArr: Array<any> = []
      if (typeof listFormConf === 'object') {
        if (page) {
          fieldArr.push(format.page, format.currentPage, format.pageSize)
        }
        const { fields = [] } = listFormConf
        for (let i = 0; i < fields.length; i += 1) {
          const fieldObj = fields[i]
          if (fieldObj.field.indexOf(',') > 0) {
            fieldArr = fieldArr.concat(fieldObj.field.split(','))
          } else {
            fieldArr.push(fieldObj.field)
          }
        }
      } else {
        if (page) {
          fieldArr = fieldArr.concat(Object.keys(listForm))
        } else {
          const tmpObj = Object.assign({}, listForm)
          delete tmpObj.page
          delete tmpObj.pageSize
          fieldArr = fieldArr.concat(Object.keys(tmpObj))
        }
      }

      return fieldArr
    })

    getUrlParamsStr = ({ formName = 'list', page = false, sorter = false } = {}) => {
      if (typeof this[`${formName}Form`] !== 'object') {
        return ''
      }
      const searchParams = new URLSearchParams()
      const fieldArr = this.getUrlParamsFieldArr({ formName })
      const listFormConf = this[`${formName}FormConf`]
      const { emptyValSetUrl = [] } = listFormConf || {};
      if (page) {
        fieldArr.push(format.page, format.currentPage, format.pageSize)
      }
      if (sorter) {
        fieldArr.push('_sorterField', '_sorterVal')
      }
      for (let j = 0; j < fieldArr.length; j += 1) {
        const field = fieldArr[j]
        const value = this[`${formName}Form`][field]
        if (!(typeof value === 'undefined' || (value === '' && emptyValSetUrl.indexOf(field) < 0))) {
          searchParams.set(field, value);
        }
      }
      return searchParams.toString()
    }
    getUrlParamsVal = ({ fields = [], url = '' }: { fields?: Array<any>, url?: string } = {}) => {
      const valObj: { [key: string]: any } = {}
      const searchParams = new URLSearchParams(url ? url.replace(/$\?/, '') : '')
      fields.forEach((key) => valObj[key] = searchParams.has(key) ? xss.process(searchParams.get(key) || '') : '')
      return valObj
    }

    urlSetForm = ({ name = 'list', url = '', isVerify = true } = {}) => {
      const dfFormName = `df${name.replace(/^\S/, s => s.toUpperCase())}Form`
      const dfFormObj = this[dfFormName] || {}
      const formObj = this[`${name}Form`]
      const newForm = {}
      if (typeof formObj === 'object') {
        const searchParams = new URLSearchParams(url.replace(/$\?/, ''))
        Object.keys(formObj).forEach((key) => {
          if (searchParams.has(key)) {
            newForm[key] = xss.process(searchParams.get(key) || '')
          }
        })
      }
      this.setForm({ name: name, valObj: { ...dfFormObj, ...newForm }, isVerify })
    }
  }
}

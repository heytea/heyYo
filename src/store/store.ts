import { observable, action } from 'mobx'
import XSS, { FilterXSS } from 'xss'
import { dfDataObj, dfData, dfDataPage } from "../unit/http";

export const dfWhiteList: { [key: string]: any } = XSS.whiteList
dfWhiteList.embed = ['src', 'allowfullscreen', 'quality', 'width', 'height', 'align', 'type', 'allowscriptaccess']
Object.keys(dfWhiteList).forEach(key => {
  dfWhiteList[key].push('style')
})
const OrderMap: { [key: string]: string } = { ascend: 'ASC', descend: 'DESC', ASC: 'ascend', DESC: 'descend' }

interface ISetFormOpt {
  name: 'list' | 'add' | 'detail' | 'edit'
  valObj?: { [key: string]: any },
  isXss?: boolean,
  trimType?: 'left' | 'right' | true | false,
  isVerify?: boolean
}

interface IUrlSetForm extends ISetFormOpt {
  url: string
}

export interface IStore {
  [key: string]: any
}

export default class Store implements IStore {
  xss: FilterXSS

  constructor({ whiteList = dfWhiteList } = {}) {
    this.xss = new XSS.FilterXSS({ whiteList })
  }

  @observable dict: { [key: string]: object | any[] } = {}

  // 字段配置
  fields: { [key: string]: { [key: string]: any } } = {}

  // 列表
  listDfForm: { [key: string]: any } = {}
  @observable listForm: { [key: string]: any } = {}
  @observable listStatus = { submit: false, loading: false }
  @observable listOperateStatus: { [key: string]: any } = {}

  listPage: { [key: string]: any } = {
    title: '列表',
    addConf: {},
    form: [],
    formProps: {},
    emptyValSetUrl: [],
    table: {
      dataKey: 'data',
      columns: []
    }
  }
  listInitData?: Function
  listApiFn?: Function
  listRequestBeforeFn?: Function
  listRequestAfterFn?: Function
  @observable listData = { ...dfDataPage }

  // 添加
  addDfForm: { [key: string]: any } = {}
  @observable addForm: { [key: string]: any } = {}
  @observable addErrs: { [key: string]: any } = {}
  @observable addStatus = { submit: false, loading: false }
  addPage = {
    title: '添加',
    form: {}
  }
  addInitData?: Function
  addApiFn?: Function
  addRequestBeforeFn?: Function
  addRequestAfterFn?: Function
  @observable addData = { ...dfData }

  // 详情
  @observable detailStatus = { submit: true, loading: false }
  @observable detailForm = { id: '' }
  detailPage = {
    title: '详情',
    form: {}
  }
  detailInitData?: Function
  detailApiFn?: Function
  detailRequestBeforeFn?: Function
  detailRequestAfterFn?: Function
  @observable detailData = { ...dfDataObj }

  // 编辑
  editDfForm: { [key: string]: any } = {}
  @observable editForm: { [key: string]: any } = {}
  @observable editErrs: { [key: string]: any } = {}
  @observable editStatus = { submit: false, loading: false }
  editPage = {
    title: '编辑',
    form: {}
  }
  editInitData?: Function
  editApiFn?: Function
  editRequestBeforeFn?: Function
  editRequestAfterFn?: Function
  @observable editData = { ...dfDataObj }

  getTypeConf = (name: string) => {
    if (this[`${name}Page`] && this[`${name}Form`]) {
      return {
        form: this[`${name}Form`] || {},
        errs: this[`${name}Errs`] || {},
        dfForm: this[`${name}DfForm`] || {},
        status: this[`${name}Status`] || {},
        page: this[`${name}Page`] || {},
        initData: this[`${name}InitData`],
        apiFn: this[`${name}ApiFn`],
        requestBeforeFn: this[`${name}RequestBeforeFn`],
        requestAfterFn: this[`${name}RequestAfterFn`],
        pageData: this[`${name}Data`] || {},
      }
    }
    console.error('type找不到对应的配置')
    return null
  }


  // 基础方法

  @action
  setStatus = ({ name, status }: { name: string, status: { loading?: boolean, submit?: boolean } }) => {
    const typeConf = this.getTypeConf(name)
    if (typeConf) {
      const { status: oldStatus } = typeConf
      Object.keys(status)?.forEach((key: string) => oldStatus[key] = status[key])
    }
  }

  @action
  setForm = ({ name, valObj = {}, isXss = true, trimType }: ISetFormOpt) => {
    const type = this.getTypeConf(name)
    if (type) {
      const { form } = type
      Object.keys(valObj).forEach((key) => {
        let tmpValue = valObj[key]
        if (typeof tmpValue === 'string') {
          if (isXss && !this.fields[key]?.isHtml) {
            tmpValue = this.xss.process(tmpValue)
          }
          if (trimType === 'left') {
            tmpValue = tmpValue.replace(/^[\s\uFEFF\xA0]+/, '')
          } else if (trimType === 'right') {
            tmpValue = tmpValue.replace(/[\s\uFEFF\xA0]+$/, '')
          } else if (trimType === true) {
            tmpValue.trim()
          }
        }
        form[key] = tmpValue
      })
    }
  }

  @action
  setErrs = ({ name, errs }: { name: string, errs: { [key: string]: string[] | string } }) => {
    const typeConf = this.getTypeConf(name)
    if (typeConf) {
      let isSubmit = true
      let { errs: thisErrs, status, form, page } = typeConf
      if (Object.keys(errs).length > 0 && thisErrs) {
        thisErrs = Object.assign(thisErrs, errs)
        // 判断能否提交
        const fieldsConf: any = {}
        const fields = Object.keys(thisErrs)
        for (let i = 0; i < fields.length; i += 1) {
          const field = fields[i]
          const err = errs[field]
          if (err?.length > 0) {
            isSubmit = false
            break
          }
          // 判断空值与必填
          if (typeof form[field] === 'undefined' || form[field] === '') {
            let fieldConf = fieldsConf[field]
            if (!fieldConf) {
              page.form?.forEach((fField: string | { [key: string]: any }) => {
                if (typeof fField === 'string') {
                  fieldsConf[fField] = { field: fField, ...this.fields[fField] }
                } else if (fField.field && typeof fField.field === 'string') {
                  fieldsConf[fField.field] = { ...(fField.conf ? this.fields[fField.conf] : this.fields[fField.field] || {}), ...fField }
                }
              })
            }
            fieldConf = fieldsConf[field]
            const rules = fieldConf?.rules || []
            if (fieldConf?.type !== 'none') {
              for (let j = 0; j < rules.length; j += 1) {
                if (rules[j].required) {
                  isSubmit = false
                  break
                }
              }
            }
          }
        }
        status.submit = isSubmit
      }
    }
  }

  urlSetForm = ({ name = 'list', url = '' }: IUrlSetForm) => {
    const type = this.getTypeConf(name)
    if (type) {
      const { form, dfForm } = type
      const newForm: { [key: string]: any } = {}
      if (typeof form === 'object') {
        const searchParams = new URLSearchParams(url.replace(/$\?/, ''))
        Object.keys(form).forEach((key) => {
          if (searchParams.has(key)) {
            newForm[key] = this.xss.process(searchParams.get(key) || '')
          }
        })
      }
      this.setForm({ name, valObj: { ...dfForm, ...newForm } })
    }
  }

  getUrlParams = ({ fields = [], url = '' }: { fields?: Array<string>, url?: string } = {}) => {
    const valObj: { [key: string]: any } = {}
    const searchParams = new URLSearchParams(url ? url.replace(/$\?/, '') : '')
    fields.forEach((key) => valObj[key] = searchParams.has(key) ? this.xss.process(searchParams.get(key) || '') : '')
    return valObj
  }

  // getFields = ({ name = '', page = false }: { page?: boolean, name?: string } = {}) => {
  //   const typeConf = this.getTypeConf(name)
  //   if (!typeConf) {
  //     console.error('type 找不到对应的配置')
  //   } else {
  //     let fieldArr: Array<any> = []
  //     const { page: { fields = [] } } = typeConf
  //     fields?.forEach(() => {
  //
  //     })
  //   }
  // }
  getUrlParamsStr = ({ name = '', page = false, sorter = false } = {}) => {
    const typeConf = this.getTypeConf(name)
    if (!typeConf) {
      return ''
    }
    const { form = {}, page: { emptyValSetUrl = [] } = {} } = typeConf
    const searchParams = new URLSearchParams()
    Object.keys(form).forEach((field: string) => {
      const value = form[field]
      if (
        (sorter === true && ['_sorterField', '_sorterVal'].indexOf(field) >= 0) ||
        (page === true && ['page', 'pageSize', 'currentPage'].indexOf(field) >= 0) ||
        !(typeof value === 'undefined' || (value === '' && emptyValSetUrl.indexOf(field) < 0))
      ) {
        searchParams.set(field, value);
      }
    })
    return searchParams.toString()
  }

  outHtml = (content: string) => {
    return { __html: this.xss.process(content) }
  }

  getSortOrder = (field: string) => {
    const { _sorterField = '', _sorterVal = '' } = this.listForm
    return _sorterVal === field ? OrderMap[_sorterVal] || '' : ''
  }
  @action
  executeDataFn = async ({ form = {}, name = '' }: any) => {
    const typeConf = this.getTypeConf(name)
    if (typeConf) {
      const { requestAfterFn, requestBeforeFn, apiFn = () => '' } = typeConf
      const tmpForm = typeof requestBeforeFn === 'function' ? await requestBeforeFn(form) : form
      const isQuery = /[Dd]etail|[Ll]ist|[Tt]ree$/.test(name)
      const reqForm: { [key: string]: any } = {}
      Object.keys(tmpForm).forEach((key: any) => {
        const val = tmpForm[key]
        if (typeof val !== 'undefined' && !(isQuery && val === '')) {
          reqForm[key] = val
        }
      })
      const data = await apiFn(reqForm)
      if (typeof requestAfterFn === 'function') {
        const afterObj = await requestAfterFn({ data, form })
        return afterObj.data
      }
      return data
    }
  }
  @action
  resetListTable = () => {
    const listTable = this.listPage.table
    if (listTable && listTable.rowSelection)
      listTable.rowSelection.selectedRowKeys = []
  }
  getErrData = (e: Error) => {
    return { code: 700, msg: e.message, data: '' }
  }
  @action
  getList = async () => {
    this.listStatus.loading = true
    try {
      this.resetListTable()
      const { _sorterField, _sorterVal, ...opts } = this.listForm
      if (_sorterField && _sorterVal) {
        opts[`${_sorterField}Order`] = _sorterVal
      }
      this.listData = await this.executeDataFn({ form: opts, name: 'list' })
    } catch (e) {
      this.listData = this.getErrData(e)
    }
    this.listStatus.loading = false
    return this.listData
  }

  @action
  add = async () => {
    this.addStatus.loading = true
    try {
      this.addData = await this.executeDataFn({ form: this.addForm, name: 'add' })
    } catch (e) {
      this.addData = this.getErrData(e)
    }
    this.addStatus.loading = false
    return this.addData
  }
  @action
  getDetail = async () => {
    this.detailStatus.loading = true
    try {
      this.detailData = await this.executeDataFn({ form: this.detailForm, name: 'detail' })
    } catch (e) {
      this.detailData = this.getErrData(e)
    }
    this.detailStatus.loading = false
    return this.detailData
  }
  @action
  edit = async () => {
    this.editStatus.loading = true
    try {
      this.editData = await this.executeDataFn({ form: this.editForm, name: 'edit' })
    } catch (e) {
      this.editData = this.getErrData(e)
    }
    this.editStatus.loading = false
    return this.editData
  }
  @action
  setListOperateStatus = ({ type = 'row', status: { index, actionName, loading } }: { type: string, status: { index: number, actionName: string, loading: boolean } }) => {
    const listOperateStatus = this.listOperateStatus
    listOperateStatus && (listOperateStatus[`${actionName}-${type === 'row' ? index : type}`] = loading)
  }

  downBlob = (blob: any, name: string) => {
    var downloadElement = document.createElement('a')
    var href = window.URL.createObjectURL(blob)
    downloadElement.href = href
    downloadElement.download = name
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(href)
  }
}
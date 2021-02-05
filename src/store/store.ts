import { observable, action } from 'mobx'
import { FilterXSS, whiteList } from 'xss'
import { dfDataObj, dfData, dfDataPage } from '../unit/http'
import IStore, {
  ISetTypeFormOpt,
  ISetFormOpt,
  IUrlSetForm,
  iSetErrsOpt,
  IForm,
  IErrs,
  IListPage,
  IDetailPage,
  IEditPage,
  IAddPage,
  iDataToCsvDownOpt,
  IFieldsConf
} from './_i'
import { TableRowSelection } from 'antd/lib/table/interface'

export const dfWhiteList: { [key: string]: any } = { ...whiteList }
dfWhiteList.embed = ['src', 'allowfullscreen', 'quality', 'width', 'height', 'align', 'type', 'allowscriptaccess']
Object.keys(dfWhiteList).forEach(key => {
  dfWhiteList[key].push('style')
})
const OrderMap: { [key: string]: string } = { ascend: 'ASC', descend: 'DESC', ASC: 'ascend', DESC: 'descend' }

export default class Store implements IStore {
  xss: FilterXSS
  fieldsConf: IFieldsConf = {}
  // fieldsConf: { [key: string]: { [key: string]: any } } | undefined;

  constructor({ whiteList = dfWhiteList } = {}) {
    this.xss = new FilterXSS({ whiteList })
  }

  @observable dict = {}

  @action setDict = (data: { [key: string]: any }) => this.dict = { ...this.dict, ...data }

  // 字段配置
  // fieldsConf: { [key: string]: { [key: string]: any } } = {}

  // 列表
  listDfForm: IForm = {}
  @observable listForm: IForm = {}
  @observable listStatus = { submit: false, loading: false }

  listPage: IListPage = {
    title: '列表',
    form: [],
    formProps: {},
    emptyValSetUrl: [],
    table: {
      dataKey: 'data',
      columns: []
    },
    actions: []
  }
  // listInitData?: Function
  // listApiFn?: Function
  // listRequestBeforeFn?: Function
  // listRequestAfterFn?: Function
  @observable listData = { ...dfDataPage }
  @observable listActionsBatchStatus = { name: '', loading: false }
  @action
  setListActionsBatchStatus = (name = '', loading = false) => {
    this.listActionsBatchStatus = { name, loading }
  }
  @observable listActionsRowStatus = { name: '', loading: false, index: 0 }
  @action
  setListActionsRowStatus = (name = '', loading = false, index: number) => {
    this.listActionsRowStatus = { name, loading, index }
  }
  @observable
  listRowSelection: TableRowSelection<any> = { selectedRowKeys: [] }

  @action
  setSelectedRowKeys = (keys: React.Key[]) => {
    this.listRowSelection.selectedRowKeys = keys
  }

  modelDetailIndex = 0
  @action
  setModelDetailIndex = (i: number) => this.modelDetailIndex = i

  @observable
  modelDetailVisible = false

  setModelDetailVisible = action((bool: boolean = true) => this.modelDetailVisible = bool)

  @observable
  modelAddVisible = false

  setModelAddVisible = action((bool: boolean = true) => this.modelAddVisible = bool)

  @observable
  modelEditVisible = false

  setModelEditVisible = action((bool: boolean = true) => this.modelEditVisible = bool)

  @observable
  modelListVisible = false

  setModelListVisible = action((bool: boolean = true) => this.modelListVisible = bool)

  // 添加
  addDfForm = {}
  @observable addForm: IForm = {}
  @observable addErrs: IForm = {}
  @observable addStatus = { submit: false, loading: false }
  addPage: IAddPage = {
    title: '添加',
    form: []
  }
  // addInitData?: Function
  // addApiFn?: Function
  // addRequestBeforeFn?: Function
  // addRequestAfterFn?: Function
  @observable addData = { ...dfData }

  // 详情
  @observable detailStatus = { submit: true, loading: false }
  detailDfForm: IForm = {}
  @observable detailForm: IForm = { id: '' }
  detailPage: IDetailPage = {
    title: '详情',
    showConf: {
      fields: []
    }
  }
  // detailInitData?: Function
  // detailApiFn?: Function
  // detailRequestBeforeFn?: Function
  // detailRequestAfterFn?: Function
  @observable detailData = { ...dfDataObj }

  // 编辑
  editDfForm: IForm = {}
  @observable editForm: IForm = {}
  @observable editErrs: IErrs = {}
  @observable editStatus = { submit: false, loading: false }
  editPage: IEditPage = {
    title: '编辑',
    form: []
  }
  // editInitData?: Function
  // editApiFn?: Function
  // editRequestBeforeFn?: Function
  // editRequestAfterFn?: Function
  @observable editData = { ...dfDataObj }

  // @action
  // setListStatus = (status: { loading?: boolean, submit?: boolean }) => {
  //   this.listStatus = { ...this.listStatus, ...status }
  // }
  // @action
  // setAddStatus = (status: { loading?: boolean, submit?: boolean }) => {
  //   this.addStatus = { ...this.addStatus, ...status }
  // }
  // @action
  // setDetailStatus = (status: { loading?: boolean, submit?: boolean }) => {
  //   this.detailStatus = { ...this.detailStatus, ...status }
  // }
  // @action
  // setEditStatus = (status: { loading?: boolean, submit?: boolean }) => {
  //   this.editStatus = { ...this.editStatus, ...status }
  // }


  @action
  setForm = ({ form, valObj = {}, isXss = true, trimType }: ISetFormOpt) => {
    Object.keys(valObj).forEach((key) => {
      let tmpValue = valObj[key]
      // @ts-ignore
      const fieldsConf = this?.fieldsConf || {}
      if (typeof tmpValue === 'string') {
        if (isXss && !fieldsConf[key]?.isHtml) {
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

  @action
  setListForm = ({ valObj = {}, isXss = true, trimType }: ISetTypeFormOpt) => {
    this.setForm({ form: this.listForm, valObj, isXss, trimType })
  }
  @action
  setDetailForm = ({ valObj = {}, isXss = true, trimType }: ISetTypeFormOpt) => {
    this.setForm({ form: this.detailForm, valObj, isXss, trimType })
  }
  @action
  setAddForm = ({ valObj = {}, isXss = true, trimType }: ISetTypeFormOpt) => {
    this.setForm({ form: this.addForm, valObj, isXss, trimType })
  }
  @action
  setEditForm = ({ valObj = {}, isXss = true, trimType }: ISetTypeFormOpt) => {
    this.setForm({ form: this.editForm, valObj, isXss, trimType })
  }
  getIsSubmit = ({ errs, form, page }: { errs: iSetErrsOpt, form: { [key: string]: any }, page: { [key: string]: any } }) => {
    let isSubmit = true
    const fields = Object.keys(errs)
    for (const field of fields) {
      const err = errs[field]
      if (err?.length > 0) {
        isSubmit = false
        break
      }
      // 判断空值与必填
      if (typeof form[field] === 'undefined' || form[field] === '') {
        const selfFieldsConf = this?.fieldsConf || {}
        let fieldConf: { [key: string]: any } = selfFieldsConf[field]
        if (fieldConf) {
          const rules = fieldConf.rules || []
          const type = fieldConf.in || fieldConf.type || ''
          if (type && type !== 'none') {
            for (const rule of rules) {
              if (rule.required) {
                console.warn('required field ====>', field);
                isSubmit = false
                break
              }
            }
          }
          if (!isSubmit) {
            break
          }
        }
      }
    }
    return isSubmit
  }
  @action
  setErrs = (name: string, errs: iSetErrsOpt) => {
    if (this[`${name}Errs`]) {
      this[`${name}Errs`] = Object.assign(this[`${name}Errs`], errs)
      this[`${name}Status`].submit = this.getIsSubmit({
        errs: this[`${name}Errs`],
        form: this[`${name}Form`],
        page: this[`${name}Page`]
      })
    }
  }
  @action
  setAddErrs = (errs: iSetErrsOpt) => {
    this.addErrs = Object.assign(this.addErrs, errs)
    this.addStatus.submit = this.getIsSubmit({ errs: this.addErrs, form: this.addForm, page: this.addPage })
  }
  @action
  setEditErrs = (errs: iSetErrsOpt) => {
    this.addErrs = Object.assign(this.editErrs, errs)
    this.editStatus.submit = this.getIsSubmit({ errs: this.editErrs, form: this.editForm, page: this.editPage })
  }

  @action
  urlSetForm = ({ form, dfForm, url = '' }: IUrlSetForm) => {
    const newForm: { [key: string]: any } = {}
    if (typeof form === 'object') {
      const searchParams = new URLSearchParams(url.replace(/$\?/, ''))
      Object.keys(form).forEach((key) => {
        if (searchParams.has(key)) {
          newForm[key] = this.xss.process(searchParams.get(key) || '')
        }
      })

      this.setForm({ form, valObj: { ...dfForm, ...newForm } })
    }
  }

  urlSetListForm = (url: string) => this.urlSetForm({ form: this.listForm, dfForm: this.listDfForm, url })
  urlSetDetailForm = (url: string) => this.urlSetForm({ form: this.detailForm, dfForm: this.detailForm, url })
  urlSetAddForm = (url: string) => this.urlSetForm({ form: this.addForm, dfForm: this.addDfForm, url })
  urlSetEditForm = (url: string) => this.urlSetForm({ form: this.editForm, dfForm: this.editDfForm, url })

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
    const form = this[`${name}Form`]
    const { emptyValSetUrl = [] } = this[`${name}Page`]
    const searchParams = new URLSearchParams()
    Object.keys(form).forEach((field: string) => {
      const value = form[field]
      if (['_sorterField', '_sorterVal'].indexOf(field) >= 0) {
        sorter === true && searchParams.set(field, value);
      } else if (['page', 'pageSize', 'currentPage'].indexOf(field) >= 0) {
        page === true && searchParams.set(field, value);
      } else if (!(typeof value === 'undefined' || (value === '' && emptyValSetUrl.indexOf(field) < 0))) {
        searchParams.set(field, value);
      }
      // if (
      //   (sorter === true && ['_sorterField', '_sorterVal'].indexOf(field) >= 0) ||
      //   (page === true && ['page', 'pageSize', 'currentPage'].indexOf(field) >= 0) ||
      //   !(typeof value === 'undefined' || (value === '' && emptyValSetUrl.indexOf(field) < 0))
      // ) {
      //   searchParams.set(field, value);
      // }
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
    const requestAfterFn = this[`${name}RequestAfterFn`]
    const requestBeforeFn = this[`${name}RequestBeforeFn`]
    const apiFn = this[`${name}ApiFn`]
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
  @action
  resetListTable = () => {
    this.setSelectedRowKeys([])
  }
  getErrData = (e: Error) => {
    return { code: 700, msg: e.message, data: '' }
  }
  @action
  resetList = () => this.listForm = { ...this.listDfForm }
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
  @observable
  isShowListTable = true

  @action
  setShowListTable = (bool: boolean) => this.isShowListTable = bool

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

  downUri = (uri: string, name: string) => {
    var downloadElement = document.createElement('a')
    downloadElement.href = uri
    downloadElement.download = name
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
  }
  downBlob = (blob: any, name: string) => {
    const uri = window.URL.createObjectURL(blob)
    this.downUri(uri, name)
    window.URL.revokeObjectURL(uri)
  }

  dataToCsvDown = ({ data, keys, titleMap = {}, name = this.listPage.title || '' }: iDataToCsvDownOpt = {}) => {
    const fieldsConf = this?.fieldsConf || {}
    const downData = typeof data === 'undefined' ? (this.listData.data.data || []) : data
    const downkeys = typeof keys === 'undefined' ? Object.keys(fieldsConf) : keys
    let str = ''
    for (const key of downkeys) {
      str += (titleMap[key] || fieldsConf[key]?.title || '') + ','
    }
    str = str.replace(/,$/, '') + '\n'
    for (const item of downData) {
      for (const key of downkeys) {
        str += (typeof item[key] === 'undefined' ? '' : item[key]) + '\t,'
      }
      str = str.replace(/\t,$/, '\n')
    }
    const uri = 'data:application/vnd.ms-excel;charset=utf-8,\ufeff' + encodeURIComponent(str)
    this.downUri(uri, name + '.csv')
  }
  exportList = () => {
    this.dataToCsvDown()
  }
}

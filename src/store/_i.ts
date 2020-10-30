import { TableProps } from 'antd/lib/table/Table'
import { ButtonProps } from 'antd/lib/button'
import { FormProps } from 'antd/lib/form'
import { ReactNode } from 'react'
import { IResult } from '../unit/http'
import { TableRowSelection, ColumnType } from 'antd/lib/table/interface'
import { Rule } from 'antd/lib/form'
import { AlertProps } from 'antd/lib/alert'
import { ModalProps } from 'antd/lib/modal'

export type ISpan = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 18 | 24 | number

export interface IDict {
  [key: string]: any
}

export type IRule = Rule | Array<{ [key: string]: any }>
export type IOutFieldType =
  'button'
  | 'tooltip'
  | 'tag'
  | 'progress'
  | 'divider'
  | 'table'
  | 'datetime'
  | 'detailGrid'
  | 'phoneEncrypt'
  | 'idCardEncrypt'
  | 'currency'
  | string

export interface IFieldsConf {
  [key: string]: {
    title?: string,
    in?: string,
    data?: string,
    dataIndex?: string,
    inProps?: { [key: string]: any },
    inSpan?: ISpan,
    out?: string,
    outProps?: { [key: string]: any },
    outSpan?: ISpan,
    rules?: IRule,
    isHtml?: boolean
  }
}

export interface IForm {
  [key: string]: any
}

export interface IStatus {
  submit: boolean,
  loading: boolean
}

export interface IErrs {
  [key: string]: string | string[]
}

export interface IListAddConfItem {
  name: string,
  url?: string | Function,
  props?: ButtonProps
}

export type IListAddConf = IListAddConfItem | IListAddConfItem[]

export interface IListFormConfItem {
  field: string,
  type?: string,
  title?: string,
  conf?: string,
  span?: ISpan,
  data?: string,
  render?: ReactNode | Function,
  props?: { [key: string]: any },
  rules?: Rule | Array<{ [key: string]: any }>
  isComplex?: boolean
}

export type IListFormConf = Array<string | IListFormConfItem>

export interface IListAction {
  name: string,
  type: 'row' | 'batch' | 'all',
  url?: string | Function,
  action?: Function,
  whom?: string,
  isConfirm?: boolean,
  show?: boolean | string | Function,
  props?: ButtonProps
}

export interface IListTAbleCol extends ColumnType<any> {
  field: string,
  conf?: string,
  type?: IOutFieldType
}

// @ts-ignore
export interface IListTable extends TableProps<any> {
  dataKey?: string,
  columns: Array<IListTAbleCol | string>,
  sorterFields?: string[],
  sorter?: { field: string, val: 'DESC' | 'ASC' },
}

export interface ITips extends AlertProps {
  show?: boolean | Function
}

export interface IBtnConf {
  isAdd?: boolean
  isSave?: boolean
  isEdit?: boolean
  isBack?: boolean
  addBtnName?: boolean
  actions?: Array<ButtonProps>
}

export interface IInFormConfItem {
  type?: string,
  field: string,
  conf?: string,
  dependencies?: string[],
  span?: ISpan,
  data?: string,
  title?: string
  props?: { [key: string]: any },
  rules?: IRule
  render?: ReactNode | Function
}

export type IInFormConf = Array<string | IInFormConfItem>

export interface IDetailShowFieldItem {
  field: string,
  title?: string,
  conf?: string,
  type?: IOutFieldType,
  props?: { [key: string]: any },
  span?: ISpan,
  style?: React.CSSProperties,
  render?: ReactNode | Function
}

export type IDetailShowFields = Array<string | IDetailShowFieldItem>


export interface ISetTypeFormOpt {
  valObj?: { [key: string]: any },
  isXss?: boolean,
  trimType?: 'left' | 'right' | true | false,
  isVerify?: boolean
}

export interface ISetFormOpt extends ISetTypeFormOpt {
  form: { [key: string]: any }
}

export interface IUrlSetForm extends ISetFormOpt {
  dfForm: { [key: string]: any },
  url: string
}

export interface iSetErrsOpt {
  [key: string]: string[] | string
}

export interface iDataToCsvDownOpt {
  data?: { [key: string]: any },
  keys?: string[],
  titleMap?: { [key: string]: string },
  name?: string
}

export interface IListPage {
  isExport?: boolean,
  isSearch?: boolean,
  isReset?: boolean,
  isShowListTable?: boolean,
  tabs?: Array<{ name: string, value: string | number }>,
  tabField?: string,
  breadcrumb?: Array<{ url: string, icon: string, title: string }>
  title?: string,
  tips?: ITips,
  add?: IListAddConf,
  form?: IListFormConf,
  formProps?: FormProps,
  emptyValSetUrl?: string[],
  showTableSwitch?: boolean
  table?: IListTable,
  showPaginationTotal?: boolean
  actions?: IListAction[],
  actionColProps?: ColumnType<any>,
  FormAfterNode?: ReactNode,
  TableBeforeNode?: ReactNode,
  TableAfterNode?: ReactNode
}

export interface IAddPage {
  title?: string,
  breadcrumb?: Array<{ url: string, icon: string, title: string }>
  tips?: ITips,
  idKey?: string,
  btnConf?: IBtnConf,
  FormBeforeNode?: ReactNode,
  FormAfterNode?: ReactNode,
  form?: IInFormConf,
  blocks?: Array<{
    title?: string,
    style?: React.CSSProperties,
    describe?: string | ReactNode,
    tips?: ITips,
    props?: FormProps,
    form: IInFormConf
  }>
}

export interface IEditPage {
  title?: string,
  breadcrumb?: Array<{ url: string, icon: string, title: string }>
  tips?: ITips,
  idKey?: string,
  btnConf?: IBtnConf,
  FormBeforeNode?: ReactNode,
  FormAfterNode?: ReactNode,
  form?: IInFormConf,
  blocks?: Array<{
    title?: string,
    style?: React.CSSProperties,
    describe?: string | ReactNode,
    tips?: ITips,
    props?: FormProps,
    form: IInFormConf
  }>
}

export interface IDetailPage {
  title?: string,
  breadcrumb?: Array<{ url: string, icon: string, title: string }>
  tips?: ITips,
  btnConf?: IBtnConf,
  PageUI?: ReactNode,
  showConf?: {
    fields?: IDetailShowFields,
    blocks?: Array<{
      fields: IDetailShowFields
      dataKey?: string,
      tips?: ITips,
      title?: string,
      describe?: string | ReactNode,
      style?: React.CSSProperties,
      contentStyle?: React.CSSProperties,
      show?: boolean | string | Function
    }>
  }
}

export interface IEditTableProps extends IListTable {
  isShowOperate?: boolean
}

export default interface IStore {
  dict?: IDict,
  fieldsConf?: IFieldsConf

  // 列表
  listDfForm: IForm
  listForm: IForm
  listStatus: IStatus
  listData: IResult,
  listInitData?: Function
  listApiFn?: Function
  listRequestBeforeFn?: Function
  listRequestAfterFn?: Function
  listActionsBatchStatus: { name: string, loading: boolean }
  setListActionsBatchStatus: (name: string, loading: boolean) => void
  listActionsRowStatus: { name: string, loading: boolean, index: number }
  setListActionsRowStatus: (name: string, loading: boolean, index: number) => void
  listRowSelection: TableRowSelection<any>
  setSelectedRowKeys: (keys: React.Key[]) => void
  listPage: IListPage
  isShowListTable: boolean,
  setShowListTable: (bool: boolean) => void

  // 添加页
  addDfForm: IForm
  addForm: IForm
  addStatus: IStatus
  addErrs: IErrs
  addData: IResult
  addInitData?: Function
  addApiFn?: Function
  addRequestBeforeFn?: Function
  addRequestAfterFn?: Function
  addPage: IAddPage,

  // 编辑页
  editDfForm: IForm
  editForm: IForm
  editStatus: IStatus
  editErrs: IErrs
  editData: IResult
  editInitData?: Function
  editApiFn?: Function
  editRequestBeforeFn?: Function
  editRequestAfterFn?: Function
  editPage: IEditPage,

  // 详情页
  detailDfForm?: IForm,
  detailForm?: IForm,
  detailStatus?: IStatus,
  detailInitData?: Function
  detailApiFn?: Function
  detailRequestBeforeFn?: Function
  detailRequestAfterFn?: Function
  detailData: IResult,
  detailPage: IDetailPage,

  setForm: (opt: ISetFormOpt) => void

  // tableEdit
  editTableModelProps?: ModalProps,
  editTableBtnProps?: ButtonProps,
  editTableProps?: IEditTableProps

  [key: string]: any
}

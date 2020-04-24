import { TableProps } from 'antd/lib/table/Table'
import { ColumnProps } from 'antd/lib/table/Column'
import { ButtonProps } from 'antd/lib/button'
import { ReactNode } from 'react'
import { IResult } from '../unit/http'

export interface IDict {
  [key: string]: any
}

export interface IDataFn {
  [key: string]: (opt?: any) => Promise<any>
}

export interface IListAddConfItem {
  name: string,
  url?: string | Function,
  props?: ButtonProps
}

export type IListAddConf = IListAddConfItem | IListAddConfItem[]
export type IListTableActions = ButtonProps[]

export interface IFormStatus {
  submit: boolean,
  loading: boolean
}

export interface IListOperateActionOpt {
  value: any[]
  record: { [key: string]: any }
  index: number
}

export type IFields = Array<{
  type?: string,
  field: string,
  title?: string,
  span?: number,
  data?: string,
  rules?: string | { [key: string]: any },
  render?: any,
  props?: { [key: string]: any }
}>

export interface IListFormConf {
  emptyValSetUrl?: string[]
  pageTitle: string,
  fields: IFields
}

export interface IListTable extends TableProps<any> {
  dataKey?: string,
}

export interface IListOperateStatus {
  [key: string]: boolean
}

export interface IListOperateConf {
  props?: ColumnProps<any>,
  items?: Array<{ show?: Function | boolean, actionName?: string, action?: Function, urlFn?: Function, whom: string, isConfirm?: boolean, props?: ButtonProps }>
}

export interface IAddFormConf {
  props?: any,
  pageTitle?: string,
  fields?: IFields,
  type?: string,
  blocks?: Array<{ title?: string, fields: IFields }>
}

export type IDetailFieldType = 'button|tooltip|tag|progress|divider|table|datetime|detailGrid|phoneEncrypt|idCardEncrypt|currency'
export type IDetailField = Array<{
  span?: number
  field: string
  title?: string
  render?: ReactNode,
  props?: object
  valProp?: string
  dataProp?: string
  // type?: IDetailFieldType
  type?: string
}>

export interface IDetailShowConf {
  pageTitle?: string,
  type?: 'grid' | 'blocks',
  fields?: IDetailField,
  blocks?: Array<{
    fields?: IDetailField
    title?: string,
    describe?: ReactNode,
    show?: boolean,
    contentStyle?: { [key: string]: string | number },
    style?: { [key: string]: string | number },
  }>
}

export default interface IStore {
  dict?: IDict,
  dataFn?: IDataFn
  listLoading?: boolean,
  listData?: IResult,
  listAddConf?: IListAddConf,
  listFormConf?: IListFormConf,
  listTableActions?: IListTableActions,
  listTable?: IListTable
  listOperateConf?: IListOperateConf

  // enableItem?(opt: IListOperateActionOpt): void
  //
  // disableItem?(opt: IListOperateActionOpt): void

  addStatus?: IFormStatus
  addData?: IResult,
  addFormConf?: IAddFormConf,
  detailLoading?: boolean,
  detailData?: IResult,
  detailShowConf?: IDetailShowConf,
  editStatus?: IFormStatus,
  editData?: IResult,
  editFormConf?: IAddFormConf,

  [key: string]: any
}

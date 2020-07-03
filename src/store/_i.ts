import { TableProps } from 'antd/lib/table/Table'
import { ColumnProps } from 'antd/lib/table/Column'
import { ButtonProps } from 'antd/lib/button'
import { FormProps } from 'antd/lib/form'
import { ReactNode } from 'react'
import { IResult } from '../unit/http'
import { TableRowSelection, ColumnType } from 'antd/lib/table/interface';
import { Rule } from 'antd/lib/form'
import { AlertProps } from "antd/lib/alert";

export type ISpan = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 24
export type  IListOperateActionOpt = any

export interface IDict {
  [key: string]: any
}

export interface IFieldsConf {
  [key: string]: {
    title?: string,
    in?: string,
    dataIndex?: string,
    inProps?: { [key: string]: any },
    inSpan?: ISpan,
    out?: string,
    outProps?: { [key: string]: any },
    outSpan?: ISpan,
    rules?: Rule | Array<{ [key: string]: any }>
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
}

export type IListFormConf = Array<string | IListFormConfItem>

export interface IListAction {
  name: string,
  type: 'row' | 'batch' | 'all',
  show?: boolean | string | Function,
}

export interface IFormStatus {
  submit: boolean,
  loading: boolean
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

export interface IListTAbleCol extends ColumnType<any> {
  field: string,
  conf?: string,
  type?: string
}

// @ts-ignore
export interface IListTable extends TableProps<any> {
  rowKey?: string,
  columns: Array<IListTAbleCol | string>,
  sorterFields?: string[],
  sorter?: { field: string, val: 'DESC' | 'ASC' },
}

export interface ITips extends AlertProps {
  show: boolean | Function
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
  listPage: {
    isExport?: boolean,
    isSearch?: boolean,
    tabs?: Array<{ name: string, value: string | number }>,
    tabField?: string,
    breadcrumb?: Array<{ url: string, icon: string, title: string }>
    title?: string,
    tips?: ITips,
    add?: IListAddConf,
    form?: IListFormConf,
    formProps?: FormProps,
    emptyValSetUrl?: string[],
    table: IListTable,
    showPaginationTotal?: boolean
    actions?: IListAction[],
    actionColProps?: ColumnType<any>,
    FormAfterNode?: ReactNode,
    TableBeforeNode?: ReactNode,
    TableAfterNode?: ReactNode
  }

  addDfForm: IForm
  addForm: IForm
  addStatus: IStatus
  addErrs: IErrs
  addData: IResult
  addInitData?: Function
  addApiFn?: Function
  addRequestBeforeFn?: Function
  addRequestAfterFn?: Function
  addPage: {
    title?: string
  }

  addFormConf?: IAddFormConf,
  detailLoading?: boolean,
  detailData?: IResult,
  detailShowConf?: IDetailShowConf,
  editStatus?: IFormStatus,
  editData?: IResult,
  editFormConf?: IAddFormConf,

  [key: string]: any
}

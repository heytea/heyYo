import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Table } from 'antd'
import IStore from '../../store/_i'
import { useContext } from 'react'
import { ConfigContext } from '../../config'
import Content from '../../display/content'
import ListActionsBatch from './actionsBatch'
import ListActionsRow from './actionsRow'

export interface IProps {
  store: IStore,
  name: string,
  onRoutePush: Function
}

const sorterMap = { ascend: 'ASC', descend: 'DESC', ASC: 'ascend', DESC: 'descend' }

const ListTable = (props: IProps) => {
  const { config: { apiFormat, codeSuccess } } = useContext(ConfigContext)
  const [tableCol, setTableCol] = useState([])
  const [{ isShowRow, batchItems, rowItems }, setActionsConf]: [{ isShowRow: boolean, batchItems: any[], rowItems: any }, Function] = useState({
    isShowRow: false,
    batchItems: [],
    rowItems: []
  })
  const { store, name, onRoutePush } = props
  const { listData, listStatus: { loading }, listPage, listForm, listRowSelection } = store
  const { fieldsConf = {} } = store
  const code = listData[apiFormat.code]
  const msg = listData[apiFormat.msg]
  const { actions, actionRowProps = {}, table: { rowKey = 'id', columns = [], onSorter, sorterFields, sorter: tableSorter, ...tableProps }, showPaginationTotal = true } = listPage
  const getFieldConf = (field: string) => {
    const { dataIndex = field, title = '' } = fieldsConf && fieldsConf[field] || {}
    const conf: { [key: string]: any } = { dataIndex, title }
    if (sorterFields.indexOf(field) >= 0) {
      conf.sorter = true
      conf.sortOrder = listForm._sorterField === field ? sorterMap[listForm._sorterVal] || '' : ''
    }
    return conf
  }
  useEffect(() => {
    const arr: any = []
    for (let i = 0; i < columns.length; i += 1) {
      const item = columns[i]
      let fieldItem: { [key: string]: any } = {}
      if (typeof item === 'string') {
        fieldsConf[item] && (fieldItem = getFieldConf(item))
      } else if (item.field) {
        fieldItem = { ...(item.conf ? getFieldConf(item.conf) : getFieldConf(item.field) || {}), ...item }
      }
      arr.push(fieldItem)
    }
    if (rowItems.length > 0) {
      arr.push({
        title: '操作',
        ...actionRowProps,
        render: (v: any, record: any, index: number) => (
          <ListActionsRow store={store} items={rowItems} index={index} record={record} val={v} />
        )
      })
    }
    setTableCol(arr)
  }, [columns, fieldsConf, rowItems, listForm?._sorterField, listForm?._sorterVal])
  useEffect(() => {
    const batchArr: any[] = []
    const rowArr: any[] = []
    actions?.forEach((item: any) => {
      const { type } = item
      if (type === 'all') {
        batchArr.push(item)
        rowArr.push(item)
      } else if (type === 'batch') {
        batchArr.push(item)
      } else if (type === 'row') {
        rowArr.push(item)
      }
    })
    setActionsConf({ isShowRow: batchArr.length > 0, batchItems: batchArr, rowItems: rowArr })
  }, [actions])
  const pageSizeChange = (_cur: number, size: number) => {
    store.urlSetForm({ name, url: location.search })
    const valObj: { [key: string]: any } = {}
    valObj[apiFormat.page] = 1
    valObj[apiFormat.currentPage] = 1
    valObj[apiFormat.pageSize] = size
    store.setListForm({ valObj })
    const queryStr = `?${store.getUrlParamsStr({ name, page: true, sorter: true })}`
    onRoutePush(queryStr)
  }
  const pageChange = (page: number) => {
    store.urlSetForm({ name, url: location.search })
    const valObj: { [key: string]: any } = {}
    valObj[apiFormat.page] = page
    valObj[apiFormat.currentPage] = page
    store.setListForm({ valObj })
    const queryStr = `?${store.getUrlParamsStr({ name, page: true, sorter: true })}`
    onRoutePush(queryStr)
  }
  const pagination = {
    showQuickJumper: true,
    onChange: pageChange,
    onShowSizeChange: pageSizeChange,
    current: listData.data[apiFormat.currentPage] || 0,
    total: listData.data[apiFormat.count] || 0,
    pageSize: listData.data[apiFormat.pageSize] || 0,
    showSizeChanger: true,
    size: 'small'
  }
  const change = (_pagination: any, _filters: any, sorter: any) => {
    const { field, order } = sorter
    if (field) {
      const { field: oldField = '', val: OldVal = '' } = tableSorter
      const orderVal = sorterMap[order]
      if (oldField !== field || OldVal !== orderVal) {
        store.urlSetForm({ name, url: location.search })
        store.setListForm({ valObj: { _sorterField: field, _sorterVal: orderVal || '' } })
        const queryStr = `?${store.getUrlParamsStr({ name, page: false, sorter: true })}`
        onRoutePush(queryStr)
      }
    }
  }
  if (code !== '' && code !== codeSuccess) {
    return <Content code={code} msg={msg} loading={loading} />
  }
  const computeProps: { [key: string]: any } = {}
  if (isShowRow) {
    const dfOnChange = (selectedRowKeys: Array<string | number>) => {
      store.setSelectedRowKeys(selectedRowKeys)
    }
    const { columnWidth = 60, fixed = true, hideSelectAll = false, selectedRowKeys = [], selections = true, type = 'checkbox', onChange = dfOnChange, onSelect = () => '', onSelectAll = () => '' } = listRowSelection
    computeProps.rowSelection = {
      columnWidth,
      fixed,
      hideSelectAll,
      selectedRowKeys,
      onChange,
      selections,
      type,
      onSelect,
      onSelectAll,
    }
  }
  return (
    <div className='m-list-table'>
      {showPaginationTotal && pagination && pagination.total > 0 ?
        <p>符合条件的信息共 {pagination.total} 条 共 {Math.ceil(pagination.total / pagination.pageSize)} 页</p> :
        <p>暂无数据</p>
      }
      <ListActionsBatch store={store} items={batchItems} />
      <Table
        bordered
        size="small"
        rowKey={rowKey}
        {...tableProps}
        {...computeProps}
        loading={loading}
        columns={tableCol}
        dataSource={listData.data.data}
        pagination={pagination}
        onChange={change}
      />
    </div>
  )
}
export default observer(ListTable)

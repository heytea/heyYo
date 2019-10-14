import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Divider, Button, Tabs, Row, Col } from 'antd'
import Content from '../display/content'
import EditForm from '../form/editForm'
import ListTable from './_unit/listTable'
import Link from '../display/link'
import PageTips from './_unit/pageTips'
import Breadcrumb from './_unit/breadcrumb'
import UI, { IUI } from "../store/ui";
import { IAuth } from "../store/auth";
import ListOperateC from './_unit/listOperate'
import { ConfigContext } from '../config'


interface IProps extends RouteComponentProps {
  UI?: IUI
  Auth?: IAuth
  Store: any
  name?: string
  itemMap?: any
}

@inject('UI', 'Auth') @observer
class List extends Component<IProps> {
  static contextType = ConfigContext;

  state = { isPushListOperate: false }

  setTitle() {
    const { UI, Store, name = 'list' } = this.props
    const listFormConf = Store[`${name}FormConf`] || {}
    UI && UI.setPageTitle(listFormConf.pageTitle || '列表页')
  }

  async fetchData() {
    const { Store, location, name = 'list', Auth } = this.props
    Store.urlSetForm({ name, url: location.search })
    const initDataFn = Store[`${name}InitData`]
    typeof initDataFn === 'function' && initDataFn.call(Store, { location, Auth })
    Store.getList({ formName: name })
  }

  componentDidMount(): void {
    this.fetchData()
    this.setTitle()
  }

  // UNSAFE_componentWillReceiveProps(nextProps: IProps) {
  //   const { location } = this.props
  //   const newLocation = nextProps.location
  //   if (newLocation.pathname !== location.pathname || newLocation.search !== location.search) {
  //     setTimeout(() => this.fetchData())
  //     this.setTitle()
  //   }
  // }

  routePush = (queryStr: string) => {
    if (queryStr !== this.props.location.search) {
      const path = this.props.location.pathname
      this.props.history.push(path + queryStr)
    } else {
      this.fetchData()
    }
  }
  submit = () => {
    const { Store, name = 'list' } = this.props
    const queryStr = `?${Store.getUrlParamsStr({ formName: name })}`
    this.routePush(queryStr)
  }
  exportList = () => {
    const { Store, name = 'list' } = this.props
    Store.exportList({ formName: name })
  }
  pageSizeChange = (_cur: number, size: number) => {
    const { config: { apiFormat } } = this.context
    const { Store, name = 'list', location } = this.props
    Store.urlSetForm({ name, url: location.search })
    const valObj = {}
    valObj[apiFormat.page] = 1
    valObj[apiFormat.currentPage] = 1
    valObj[apiFormat.pageSize] = size
    Store.setForm({ name, valObj })
    const queryStr = `?${Store.getUrlParamsStr({ formName: name, page: true, sorter: true })}`
    this.routePush(queryStr)
  }
  pageChange = (page: number) => {
    const { config: { apiFormat } } = this.context
    const { Store, name = 'list', location } = this.props
    Store.urlSetForm({ name, url: location.search })
    const valObj = {}
    valObj[apiFormat.page] = page
    valObj[apiFormat.currentPage] = page
    Store.setForm({ name, valObj })
    const queryStr = `?${Store.getUrlParamsStr({ formName: name, page: true, sorter: true })}`
    this.routePush(queryStr)
  }
  sorter = ({ field, order }: any) => {
    const { Store, name = 'list', location } = this.props
    Store.urlSetForm({ name, url: location.search })
    Store.setForm({ name, valObj: { _sorterField: field, _sorterVal: order } })
    const queryStr = `?${Store.getUrlParamsStr({ formName: name, page: false, sorter: true })}`
    this.routePush(queryStr)
  }

  tagChange = (val: any) => {
    const { Store, name = 'list', } = this.props
    const listFormConf = Store[`${name}FormConf`] || {}
    const tagChange = Store[`${name}TagChange`] || false;
    const { tabField } = listFormConf
    tagChange && tagChange(val)
    this.routePush(`?${tabField}=${val}`)
  }
  getListAddConfInner = (conf: any) => {
    if (!conf) return null;
    let isArray = Object.prototype.toString.call(conf).includes('Array');
    let maps = isArray ? Array.from(conf) : [conf];
    return <div className="add-link"><Row> {
      maps.map(listAddConf => {
        return listAddConf.name && <Col key={listAddConf.name} span={24 / maps.length}>
            <Link className=""
                  href={listAddConf.url ? (typeof listAddConf.url === 'function' ? listAddConf.url() : listAddConf.url) : 'javascript:;'}>
                <Button type="primary" {...listAddConf.props}>{listAddConf.name}</Button></Link></Col>
      })
    }
    </Row>
    </div>
  };
  // getListBatchOperationsRender = (listBatchOperations: any) => {
  //   if (!listBatchOperations) return null;
  //   const { Store } = this.props;
  //   let isArray = Object.prototype.toString.call(listBatchOperations).includes('Array');
  //   let maps = isArray ? Array.from(listBatchOperations) : [listBatchOperations];
  //   return maps.map((item, key) => {
  //     const { ModalUI, modalProps = {} } = item;
  //     return ModalUI && <ModalUI {...modalProps} Store={Store} key={key}/>
  //   });
  // };

  componentDidUpdate(prevProps: Readonly<IProps>) {
    const { Store, name = 'list', location } = this.props;
    const prevLocation = prevProps.location
    if (prevLocation.pathname !== location.pathname || prevLocation.search !== location.search) {
      setTimeout(() => this.fetchData())
      this.setTitle()
    }
    const listDidUpdate = Store[`${name}DidUpdate`];
    listDidUpdate instanceof Function && listDidUpdate.call(Store);
  }

  render() {
    const { config: { codeSuccess, apiFormat } } = this.context
    const { Store, name = 'list', Auth, itemMap, UI: { layout: { clientWidth }, mobileWidth } = UI, location } = this.props
    const { isPushListOperate } = this.state
    const listAddConf = Store[`${name}AddConf`] || []
    const Table = Store[`${name}TableUI`] || ListTable
    const listFormConf = Store[`${name}FormConf`] || {}
    const listOperate = Store[`${name}Operate`] || {}
    const listOperateConf = Store[`${name}OperateConf`] || {}
    const loading: boolean = Store[`${name}Loading`]
    const exportLoading = Store[`${name}ExportLoading`]
    const listForm = Store[`${name}Form`] || {}
    const listData = Store[`${name}Data`] || Object.assign({}, Store.dfDataPage)
    const tableFn = Store[`${name}TableFn`]
    // const listBatchOperations = Store[`${name}BatchOperations`] || []
    const listTips = Store[`${name}Tips`]
    const breadcrumb = Store[`${name}Breadcrumb`]
    let columnsOperate: any[] = []
    const tableProps = typeof tableFn === 'function' ? tableFn.call(Store, { user: Auth && Auth.user }) : Store[`${name}Table`] || {}
    const isMobile = clientWidth < mobileWidth
    if (!isPushListOperate && tableProps && tableProps.columns && listOperateConf && listOperateConf.items) {
      const operateProps = listOperateConf.props || {}
      columnsOperate = [{
        fixed: isMobile ? false : 'right',
        ...operateProps,
        title: '操作',
        dataIndex: listOperateConf.dataIndex || '',
        render: (v: any, r: object, i: number) => <ListOperateC value={v} record={r} index={i} Store={Store}
                                                                name={name}/>
      }]
    }
    const { isExport = false, isSearch = true, tabs, tabField } = listFormConf
    const listPageFormBeforeNode = Store[`${name}PageFormBeforeNode`] || null
    const listPageFormAfterNode = Store[`${name}PageFormAfterNode`] || null
    const listPageTableBeforeNode = Store[`${name}PageTableBeforeNode`] || null
    const listPageTableAfterNode = Store[`${name}PageTableAfterNode`] || null
    const pagination = {
      showQuickJumper: true,
      onChange: this.pageChange,
      onShowSizeChange: this.pageSizeChange,
      current: listData.data[apiFormat.currentPage] || 0,
      total: listData.data[apiFormat.count] || 0,
      pageSize: listData.data[apiFormat.pageSize] || 0,
      showSizeChanger: true,
      size: 'small'
    }
    const errno = listData[apiFormat.code]
    const errmsg = listData[apiFormat.msg]
    const title = listFormConf.pageTitle || '列表页'
    return (
      <div className="m-list" data-url={location.pathname + location.search}>
        <div className="m-list-title">
          <Breadcrumb data={breadcrumb} dfTitle={title && title.split('-') && title.split('-')[0]}/>
          {this.getListAddConfInner(listAddConf)}
        </div>
        <Divider/>
        {listTips && <PageTips {...listTips}/>}
        {listPageFormBeforeNode}
        {tabs && tabs.map &&
        <Tabs activeKey={listForm[tabField] + ''} onChange={this.tagChange}>
          {tabs.map((item: any) => <Tabs.TabPane tab={item.name} key={item.value + ''}/>)}
        </Tabs>
        }
        <EditForm conf={{ layout: clientWidth > 768 ? 'inline' : 'vertical' }}
                  loading={loading}
                  itemMap={itemMap}
                  Store={Store} name={name}
                  onSubmit={this.submit}>
          {isSearch &&
          <Button htmlType="submit" type="primary" icon={loading ? '' : 'search'} loading={loading}>查询</Button>}
          {isExport &&
          <Button htmlType="button" loading={exportLoading} type="primary" ghost
                  icon={exportLoading ? '' : 'download'}
                  style={{ marginLeft: '10px' }}
                  onClick={this.exportList}>
              导出
          </Button>
          }
        </EditForm>
        {listPageFormAfterNode}
        {(isSearch || isExport) && <Divider/>}
        {listPageTableBeforeNode}
        {errno !== '' && errno !== codeSuccess ?
          <Content code={errno} msg={errmsg} loading={loading}/>
          :
          <Table
            name={name}
            loading={loading}
            operate={listOperate}
            data={listData.data}
            onPageSizeChange={this.pageSizeChange}
            onPageChange={this.pageChange}
            onSorter={this.sorter}
            pagination={pagination}
            Store={Store}
            {...tableProps}
            columns={[...tableProps.columns, ...columnsOperate]}
          />
        }
        {listPageTableAfterNode}
        {/*{this.getListBatchOperationsRender(listBatchOperations)}*/}
      </div>
    )
  }
}

export default withRouter(List)

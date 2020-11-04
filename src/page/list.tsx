import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Divider, Button, Tabs, Switch } from 'antd'
import PageTips from './_unit/pageTips'
import Breadcrumb from './_unit/breadcrumb'
import { AuthContext, UIContext } from '../index'
import TitleBtn from './_list/titleBtn'
import StoreEditForm from '../form/storeEditForm'
import ListTable from './_list/table'
import ActionBtn from './_unit/actionsBtn'
import Svg from '../display/svg'

const List = observer(({ Store: store = {}, name = 'list' }: any) => {
  const UI = useContext(UIContext)
  const Auth = useContext(AuthContext)
  const location = useLocation()
  const history = useHistory()
  const [dfTitle, setDfTitle] = useState('')
  const { setPageTitle } = UI
  const { listStatus, listPage, listForm, isShowListTable, setShowListTable } = store
  const {
    isExport = false,
    isSearch = true,
    isReset = false,
    showTableSwitch = false,
    tabs,
    tabField,
    title: pageTitle = '列表',
    breadcrumb,
    tips: listTips,
    add: listAddConf = [],
    FormAfterNode = null,
    TableBeforeNode = null,
    TableAfterNode = null,
    btnConf = {}
  } = listPage
  const { isBack = false, actions: btnActions = [] } = btnConf

  const fetchData = async () => {
    store.urlSetListForm(location.search)
    const initDataFn = store.listInitData
    typeof initDataFn === 'function' && initDataFn({ location, Auth })
    store.getList()
  }

  useEffect(() => {
    const didMount = store.listDidMount
    typeof didMount === 'function' && didMount({ location, Auth })
  }, [])

  useEffect(() => {
    setPageTitle(pageTitle)
    setDfTitle(pageTitle && pageTitle.split('-') && pageTitle.split('-')[0])
  }, [pageTitle])

  useEffect(() => {
    fetchData()
  }, [location.pathname, location.search])

  const routePush = (queryStr: string) => {
    if (queryStr !== location.search) {
      const path = location.pathname
      history.push(path + queryStr)
    } else {
      fetchData()
    }
    store.setSelectedRowKeys([])
  }
  const submit = () => {
    // todo
    const queryStr = `?${store.getUrlParamsStr({ name })}`
    routePush(queryStr)
  }

  const tagChange = (val: any) => {
    const tabChange = store.listTabChange
    tabChange && tabChange(val)
    routePush(`?${tabField}=${val}`)
  }

  return (
    <div className="m-list" data-url={location.pathname + location.search}>
      <div className="m-list-title">
        <Breadcrumb data={breadcrumb} dfTitle={dfTitle} />
        <TitleBtn addConf={listAddConf} />
      </div>
      <Divider />
      {listTips && <PageTips {...listTips} />}
      {tabs && tabs.map &&
        <Tabs activeKey={listForm[tabField] + ''} onChange={tagChange}>
          {tabs.map((item: any) => <Tabs.TabPane tab={item.name} key={item.value + ''} />)}
        </Tabs>
      }
      <StoreEditForm pageType="list" store={store} name={name} onSubmit={submit}>
        {isSearch &&
          <Button htmlType="submit" type="primary" icon={listStatus.loading ? '' : <Svg src={'search'} />}
            loading={listStatus.loading}>查询</Button>
        }
        {isReset &&
          <Button icon={listStatus.loading ? '' : <Svg src={'reset'} />}
            style={isSearch && { marginLeft: '10px' }}
            onClick={store.resetList}>重置</Button>
        }
        {isExport &&
          <Button htmlType="button" loading={listStatus.exportLoading}
            icon={listStatus.exportLoading ? '' : <Svg src={'download'} />}
            style={(isSearch || isReset) && { marginLeft: '10px' }}
            onClick={store.exportList}>
            导出
        </Button>
        }
      </StoreEditForm>
      {typeof FormAfterNode === 'function' ? <FormAfterNode store={store} /> : FormAfterNode}
      {(isSearch || isExport) && <Divider />}
      {typeof TableBeforeNode === 'function' ? <TableBeforeNode store={store} /> : TableBeforeNode}
      {showTableSwitch &&
        <Switch style={{ marginBottom: '20px' }} checkedChildren="隐藏表格" unCheckedChildren="显示表格" checked={isShowListTable} onChange={setShowListTable} />
      }
      {isShowListTable && <ListTable store={store} name={name} onRoutePush={routePush} />}
      {typeof TableAfterNode === 'function' ? <TableAfterNode store={store} /> : TableAfterNode}
      <ActionBtn actions={btnActions} isBack={isBack} />
    </div>
  )
})
export default List

import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory, useLocation } from 'react-router-dom'
import { AuthContext, UIContext, ConfigContext } from '../index'
import Breadcrumb from './_unit/breadcrumb'
import { Divider } from 'antd'
import PageTips from './_unit/pageTips'
import ActionBtn from './_unit/actionsBtn'
import Content from '../display/content';
import DetailContent from './_detail/content'
import { useUnmount } from '../unit/hooks'

const DetailPage = ({ Store: store = {} }: any) => {
  const UI = useContext(UIContext)
  const Auth = useContext(AuthContext)
  const { config: { codeSuccess, apiFormat } } = useContext(ConfigContext)
  const [dfTitle, setDfTitle] = useState('')
  const location = useLocation()
  const history = useHistory()
  const { pathname, search = '' } = location
  const { setPageTitle } = UI
  const { detailStatus, detailPage, detailData } = store
  const { loading } = detailStatus
  const detailCode = detailData[apiFormat.code]
  const detailMsg = detailData[apiFormat.msg]
  const {
    title: pageTitle,
    breadcrumb,
    tips: detailTips,
    btnConf = {},
    ContentBeforeNode = null,
    ContentAfterNode = null,
  } = detailPage
  const { isEdit = true, isBack = true, actions: btnActions = [], editBtnName = '编辑', backUrl = '' } = btnConf

  const fetchData = async () => {
    store.urlSetDetailForm(location.search)
    const initDataFn = store.detailInitData
    typeof initDataFn === 'function' && initDataFn({ location, Auth })
    store.getDetail()
  }
  const btns = btnActions && btnActions?.length > 0 ? [...btnActions] : []
  isEdit && btns.push({
    onClick: () => history.push(pathname.replace(/\/detail$/, '/edit') + search),
    htmlType: 'button',
    type: 'primary',
    loading,
    disabled: loading,
    children: editBtnName
  })

  useEffect(() => {
    const didMount = store.detailDidMount
    typeof didMount === 'function' && didMount({ location, Auth })
    fetchData()
  }, [])

  useUnmount(() => {
    const unmount = store.detailUnmount
    typeof unmount === 'function' && unmount({ location, Auth })
  })

  useEffect(() => {
    setPageTitle(pageTitle)
    setDfTitle(pageTitle && pageTitle.split('-') && pageTitle.split('-')[0])
  }, [pageTitle])
  return (
    <Content code={detailCode} msg={detailMsg} data={detailData[apiFormat.data]} loading={loading}>
      <div className="content m-detail">
        <div className="m-add-title">
          <Breadcrumb data={breadcrumb} dfTitle={dfTitle} />
        </div>
        <Divider />
        {detailTips && <PageTips {...detailTips} />}
        {typeof ContentBeforeNode === 'function' && <ContentBeforeNode store={store} />}
        {detailCode === codeSuccess && <DetailContent store={store} data={detailData[apiFormat.data]} />}
        <ActionBtn loading={loading} actions={btns} isBack={isBack} backUrl={backUrl} />
        {typeof ContentAfterNode === 'function' && <ContentAfterNode store={store} />}
      </div>
    </Content>
  )
}

export default observer(DetailPage)

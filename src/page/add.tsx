import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory, useLocation } from 'react-router-dom'
import { AuthContext, UIContext, ConfigContext } from '../index'
import Breadcrumb from './_unit/breadcrumb'
import { Divider } from 'antd'
import PageTips from './_unit/pageTips'
import ActionBtn from './_unit/actionsBtn'
import StoreEditForm from '../form/storeEditForm'

const AddPage = ({ Store: store = {}, name = 'list' }: any) => {
  const UI = useContext(UIContext)
  const Auth = useContext(AuthContext)
  const { config: { codeSuccess, codeValidated, apiFormat } } = useContext(ConfigContext)
  const [dfTitle, setDfTitle] = useState('')
  const location = useLocation()
  const history = useHistory()
  const { pathname, search = '' } = location
  const { setPageTitle } = UI
  const { addForm, addDfForm, addStatus, addPage, addBeforeFn, addAfterFn } = store
  const { loading, submit } = addStatus
  const {
    title: pageTitle,
    breadcrumb,
    tips: addTips,
    idKey = 'id',
    FormBeforeNode = null,
    FormAfterNode = null,
    btnConf = {},
  } = addPage
  const { isAdd = true, isBack = true, actions: BtnActions = [], addBtnName = '添加' } = btnConf

  const fetchData = async () => {
    store.urlSetAddForm(location.search)
    const initDataFn = store.addInitData
    typeof initDataFn === 'function' && initDataFn({ location, Auth })
  }
  const onSubmit = async () => {
    if (typeof addBeforeFn === 'function') {
      if (!addBeforeFn({ location, history })) {
        return false
      }
    }
    const addData = await store.add()
    if (addData.code === codeValidated) {
      store.setErrs(name, addData.data)
    }
    if (typeof addAfterFn === 'function') {
      if (!addAfterFn({ addData, location, history })) {
        return false
      }
    }
    if (addData[apiFormat.code] === codeSuccess) {
      const data = addData[apiFormat.data]
      addDfForm && store.setAddForm({ valObj: addDfForm })
      const idKeyVal = addForm[idKey] || (data && data[idKey]) || ''
      if (!idKeyVal) {
        history.goBack()
      } else {
        const detailPathname = pathname.replace(/\/add$/, '/detail')
        const detailSearch = `?${idKey}=${idKeyVal}${search.replace('?', '&')}`
        history.replace(detailPathname + detailSearch)
      }
    }
    return true
  }
  if (isAdd) {
    BtnActions.push({
      onClick: onSubmit,
      htmlType: 'button',
      type: 'primary',
      loading,
      disabled: !submit,
      children: addBtnName
    })
  }
  useEffect(() => {
    const didMount = store.addDidMount
    typeof didMount === 'function' && didMount({ location, Auth })
    fetchData()
  }, [])

  useEffect(() => {
    setPageTitle(pageTitle)
    setDfTitle(pageTitle && pageTitle.split('-') && pageTitle.split('-')[0])
  }, [pageTitle])
  return (
    <div className="content m-add">
      <div className="m-add-title">
        <Breadcrumb data={breadcrumb} dfTitle={dfTitle} />
      </div>
      <Divider />
      {addTips && <PageTips {...addTips} />}
      {typeof FormBeforeNode === 'function' && <FormBeforeNode store={store} />}
      <StoreEditForm store={store} name='add' onSubmit={onSubmit} />
      {typeof FormAfterNode === 'function' && <FormAfterNode store={store} />}
      <ActionBtn actions={BtnActions} isBack={isBack} />
    </div>
  )
}

export default observer(AddPage)

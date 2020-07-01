import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory, useLocation } from 'react-router-dom'
import { AuthContext, UIContext, ConfigContext } from '../index'
import Breadcrumb from './_unit/breadcrumb'
import { Divider } from 'antd'
import PageTips from './_unit/pageTips'
import ActionBtn from './_unit/actionsBtn'
import StoreEditForm from '../form/storeEditForm'

const EditPage = ({ Store: store = {}, name = 'edit' }: any) => {
  const UI = useContext(UIContext)
  const Auth = useContext(AuthContext)
  const { config: { codeSuccess, codeValidated, apiFormat } } = useContext(ConfigContext)
  const [dfTitle, setDfTitle] = useState('')
  const location = useLocation()
  const history = useHistory()
  const { pathname, search = '' } = location
  const { setPageTitle } = UI
  const { editForm, editDfForm, editStatus, editPage, editBeforeFn, editAfterFn } = store
  const { loading, submit } = editStatus
  const {
    title: pageTitle,
    breadcrumb,
    tips: editTips,
    idKey = 'id',
    FormBeforeNode = null,
    FormAfterNode = null,
    btnConf = {},
  } = editPage
  const { isEdit = true, isBack = true, actions: BtnActions = [], editBtnName = '保存' } = btnConf

  const fetchData = async () => {
    store.urlSetEditForm(location.search)
    const initDataFn = store.editInitData
    typeof initDataFn === 'function' && initDataFn({ location, Auth })
  }
  const onSubmit = async () => {
    if (typeof editBeforeFn === 'function') {
      if (!editBeforeFn({ location, history })) {
        return false
      }
    }
    const editData = await store.edit()
    if (editData.code === codeValidated) {
      store.setErrs(name, editData.data)
    }
    if (typeof editAfterFn === 'function') {
      if (!editAfterFn({ editData, location, history })) {
        return false
      }
    }
    if (editData[apiFormat.code] === codeSuccess) {
      const data = editData[apiFormat.data]
      editDfForm && store.setEditForm({ valObj: editDfForm })
      const idKeyVal = editForm[idKey] || (data && data[idKey]) || ''
      if (!idKeyVal) {
        history.goBack()
      } else {
        const detailPathname = pathname.replace(/\/edit$/, '/detail')
        const detailSearch = `?${idKey}=${idKeyVal}${search.replace('?', '&')}`
        history.replace(detailPathname + detailSearch)
      }
    }
    return true
  }
  if (isEdit) {
    BtnActions.push({
      onClick: onSubmit,
      htmlType: 'button',
      type: 'primary',
      loading,
      disabled: !submit,
      children: editBtnName
    })
  }
  useEffect(() => {
    const didMount = store.editDidMount
    typeof didMount === 'function' && didMount({ location, Auth })
    fetchData()
  }, [])

  useEffect(() => {
    setPageTitle(pageTitle)
    setDfTitle(pageTitle && pageTitle.split('-') && pageTitle.split('-')[0])
  }, [pageTitle])
  return (
    <div className="content m-edit">
      <div className="m-edit-title">
        <Breadcrumb data={breadcrumb} dfTitle={dfTitle} />
      </div>
      <Divider />
      {editTips && <PageTips {...editTips} />}
      {typeof FormBeforeNode === 'function' && <FormBeforeNode store={store} />}
      <StoreEditForm store={store} name='edit' onSubmit={onSubmit} />
      {typeof FormAfterNode === 'function' && <FormAfterNode store={store} />}
      <ActionBtn actions={BtnActions} isBack={isBack} />
    </div>
  )
}

export default observer(EditPage)

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
  const { editSetFormBeforeFn, editSetFormAfterFn, editDfForm, editStatus, editPage, editBeforeFn, editAfterFn } = store
  const { loading, submit } = editStatus
  const {
    title: pageTitle,
    breadcrumb,
    tips: editTips,
    FormBeforeNode = null,
    FormAfterNode = null,
    btnConf = {},
  } = editPage
  const { isSave = true, isBack = true, actions: BtnActions = [], saveBtnName = '保存' } = btnConf

  const fetchData = async () => {
    store.urlSetDetailForm(location.search)
    store.urlSetEditForm(location.search)
    const initDataFn = store.editInitData
    typeof initDataFn === 'function' && initDataFn({ location, Auth })
    const detailData = await store.getDetail()
    if (detailData[apiFormat.code] === codeSuccess) {
      if (typeof editSetFormBeforeFn === 'function') {
        const { data } = await editSetFormBeforeFn({ data: detailData, location, history })
        store.setEditForm({ valObj: data[apiFormat.data] })
      } else {
        store.setEditForm({ valObj: detailData[apiFormat.data] })
      }
      if (typeof editSetFormAfterFn === 'function') {
        editSetFormAfterFn({ data: detailData, location, history })
      }
    }
  }
  const onSubmit = async () => {
    if (typeof editBeforeFn === 'function') {
      if (!editBeforeFn({ location, history })) {
        return false
      }
    }
    const editData = await store.edit()
    const code = editData[apiFormat.code]
    if (code === codeValidated) {
      store.setErrs(name, editData.data)
    }
    if (typeof editAfterFn === 'function') {
      if (!editAfterFn({ editData, location, history })) {
        return false
      }
    }
    if (code === codeSuccess) {
      editDfForm && store.setEditForm({ valObj: editDfForm })
      const detailUrl = pathname.replace(/\/edit$/, '/detail') + search
      history.replace(detailUrl)
    }
    return true
  }
  if (isSave) {
    BtnActions.push({
      onClick: onSubmit,
      htmlType: 'button',
      type: 'primary',
      loading,
      disabled: !submit,
      children: saveBtnName
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

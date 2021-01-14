import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory, useLocation } from 'react-router-dom'
import { Modal } from 'antd';
import IStore from '../../store/_i';
import StoreEditForm from '../../form/storeEditForm'
import { ConfigContext } from '../../index'
export interface IProps {
  store: IStore
}

const ModalDetail = observer((props: IProps) => {
  const location = useLocation()
  const history = useHistory()
  const { config: { codeSuccess, codeValidated, apiFormat } } = useContext(ConfigContext)
  const { store } = props;

  const { editPage, editDfForm, editStatus, editBeforeFn, editAfterFn, modalEdit, listData, modelEditVisible, setModelEditVisible, modelDetailIndex, } = store;

  const { modalProps = {}, } = modalEdit || {}

  useEffect(() => {
    if (modelEditVisible) {
      const data = (listData?.data?.data && listData.data.data[modelDetailIndex]) || {};
      store.setEditForm({ valObj: data })
      store.setEditErrs({})
    }
  }, [listData, modelDetailIndex, modelEditVisible])
  const onSubmit = async () => {
    if (typeof editBeforeFn === 'function') {
      if (!editBeforeFn({ location, history })) {
        return false
      }
    }
    const editData = await store.edit()
    const code = editData[apiFormat.code]
    if (code === codeValidated) {
      store.setErrs('edit', editData.data)
    }
    if (typeof editAfterFn === 'function') {
      if (!editAfterFn({ editData, location, history })) {
        return false
      }
    }
    if (code === codeSuccess) {
      editDfForm && store.setEditForm({ valObj: editDfForm })
      setModelEditVisible(false)
    }
  }
  return <Modal
    title={editPage.title}
    width={800}
    maskClosable={false}
    visible={modelEditVisible}
    okButtonProps={{ disabled: !editStatus.submit }}
    onOk={onSubmit}
    okText="保存"
    cancelText="取消"
    onCancel={() => setModelEditVisible(false)}
    {...modalProps}
  >
    <StoreEditForm store={store} name='edit' onSubmit={onSubmit} />
  </Modal>;
});

export default ModalDetail;

import React, { useContext } from 'react';
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
  const { addPage, addDfForm, addStatus, addBeforeFn, addAfterFn, modalAdd, modelAddVisible, setModelAddVisible, } = store;
  const { modalProps = {} } = modalAdd || {}

  const onSubmit = async () => {
    if (typeof addBeforeFn === 'function') {
      if (!addBeforeFn({ location, history })) {
        return false
      }
    }
    const addData = await store.add()
    const code = addData[apiFormat.code]
    if (code === codeValidated) {
      store.setErrs('add', addData.data)
    }
    if (typeof addAfterFn === 'function') {
      if (!addAfterFn({ addData, location, history })) {
        return false
      }
    }
    if (code === codeSuccess) {
      addDfForm && store.setAddForm({ valObj: addDfForm })
      setModelAddVisible(false)
    }
  }
  return <Modal
    title={addPage.title}
    width={800}
    maskClosable={false}
    visible={modelAddVisible}
    okButtonProps={{ disabled: !addStatus.submit }}
    onOk={onSubmit}
    okText="保存"
    cancelText="取消"
    onCancel={() => setModelAddVisible(false)}
    {...modalProps}
  >
    <StoreEditForm store={store} name='add' onSubmit={onSubmit} />
  </Modal>;
});

export default ModalDetail;
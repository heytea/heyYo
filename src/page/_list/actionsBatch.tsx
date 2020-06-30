import React from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Modal } from 'antd'
import { ButtonProps } from 'antd/lib/button'

const confirm = Modal.confirm

export interface IProps {
  items: any[],
  store: any
}

export interface IActionProps {
  store?: any,
  name: string,
  isConfirm: boolean,
  props?: ButtonProps
  action: Function
}


const Action = observer(({ store, name, isConfirm, action, props }: IActionProps) => {
  const execute = async () => {
    store.setListActionsBatchStatus(name, true)
    await action()
    store.setListActionsBatchStatus(name, false)
  }
  const click = () => {
    if (isConfirm) {
      confirm({
        title: `${name}确认?`,
        content: `您确定要批量${name}?`,
        onOk: () => execute()
      })
    } else {
      execute()
    }
  }
  const { listActionsBatchStatus, listRowSelection: { selectedRowKeys } } = store
  const loading = listActionsBatchStatus.name === name && listActionsBatchStatus.loading
  const disabled = selectedRowKeys < 1 || (listActionsBatchStatus.name !== name && listActionsBatchStatus.loading)
  return <Button onClick={click} htmlType="button" type="primary" {...props} disabled={disabled} loading={loading}>
    {name}
  </Button>
})

const ListActions = ({ items, store }: IProps) => {
  return (
    <div className='u-table-row-selection-btn'>
      {items.map && items.map((item: any, i: number) => <Action key={i} store={store} {...item} />)}
    </div>
  )
}


export default observer(ListActions)

import React from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Modal } from 'antd'

const confirm = Modal.confirm

export interface IProps {
  items: any[],
  store: any
}

export interface IActionProps {
  store?: any,
  name: string,
  isConfirm: boolean,
  action: Function
}


const Action = observer(({ store, name, isConfirm, action }: IActionProps) => {
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
  return <Button onClick={click} disabled={disabled} loading={loading} htmlType="button" type="primary">{name}</Button>
})

const ListActions = ({ items, store }: IProps) => {
  return (
    <div className='u-table-row-selection-btn'>
      {items.map && items.map((item: any, i: number) => <Action key={i} store={store} {...item} />)}
    </div>
  )
}


export default observer(ListActions)

import React from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Modal } from 'antd'

const confirm = Modal.confirm

export interface IProps {
  items: [],
  store: any,
  record: any,
  val: any,
  index: number
}

export interface IActionProps {
  store?: any,
  name: string,
  isConfirm: boolean,
  record: any,
  val: any,
  index: number,
  action: Function
}


const Action = observer(({ store, name, isConfirm, action, record, val, index }: IActionProps) => {
  const execute = async () => {
    store.setListActionsRowStatus(name, true, index)
    await action(val, record, index)
    store.setListActionsRowStatus(name, false, index)
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
  const { listActionsRowStatus } = store
  const loading = listActionsRowStatus.name === name && listActionsRowStatus.index === index && listActionsRowStatus.loading
  return <Button size="small" onClick={click}  loading={loading} htmlType="button">{name}</Button>
})

const ListActionsRow = ({ items, store, record, val, index }: IProps) => {
  return (
    <div className='m-list-operate'>
      {items.map && items.map((item: any, i: number) => (
        <Action key={i} index={index} store={store} record={record} val={val} {...item} />
      ))}
    </div>
  )
}


export default observer(ListActionsRow)

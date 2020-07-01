import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Modal } from 'antd'
import { ButtonProps } from 'antd/lib/button'
import template from "../../unit/template";

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
  props?: ButtonProps
  record: any,
  val: any,
  index: number,
  url?: Function | string,
  action: Function
}


const Action = observer(({ store, name, props = {}, isConfirm, action, record, val, index, url = '' }: IActionProps) => {
  const [newUrl, setNewUrl] = useState('')
  useEffect(() => {
    setNewUrl(typeof url === 'function' ? url(val, record, index) : template(url, { ...record, _index: index }))
  }, [url])
  const execute = async () => {
    if (typeof action !== 'function') {
      console.error('action 必须是一个函数')
    } else {
      store.setListActionsRowStatus(name, true, index)
      await action(val, record, index)
      store.setListActionsRowStatus(name, false, index)
    }
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
  const btnProps: ButtonProps = { size: 'small', htmlType: 'button' }
  if (newUrl) {
    btnProps.href = newUrl
    btnProps.type = 'link'
  } else {
    const { listActionsRowStatus } = store
    btnProps.loading = listActionsRowStatus.name === name && listActionsRowStatus.index === index && listActionsRowStatus.loading
    btnProps.onClick = click
    btnProps.type = 'primary'
  }
  return <Button {...btnProps} {...props} >{name}</Button>
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

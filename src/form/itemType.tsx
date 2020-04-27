import React, { useEffect, useState } from 'react'
import ItemMap from './itemMap'
import { observer } from 'mobx-react-lite'

interface IProps {
  loading?: boolean,
  conf?: { [key: string]: any },
  values?: { [key: string]: any },
  data?: { [key: string]: any },
  itemMap?: { [key: string]: any },
  onChange?: Function
}

export default observer(function HyItemType(props: IProps) {
  const { values = {}, conf = {}, data = {}, loading = false, itemMap = ItemMap, onChange } = props
  const change = (val: any, key: string) => {
    const { onChange } = props
    const formObj: { [key: string]: any } = {}
    formObj[key] = typeof val === 'undefined' ? '' : val
    onChange && onChange(formObj)
  }
  const { field, } = conf
  const value = values[field]
  const itemData = data[conf.data]
  const type = conf.type || 'Default'
  const [Render, setRender]: [any, Function] = useState(null)
  useEffect(() => {
    setRender(() => typeof conf.render === 'function' ? conf.render : itemMap[type])
  }, [type, conf.render])
  let newProps: { [key: string]: any } = { ...conf.props, value }
  if (itemData) {
    newProps.data = itemData
  }
  // if (!(Render.prototype && Render.prototype.isReactComponent)) {
  //   newProps = { ...newProps, conf, field, onChangeForm: onChange, loading, values, dict: data }
  //   return <Render {...newProps} {...props} onChange={(val: any) => this.change(val, field)} />
  // }
  // if (type === 'input' || type === 'captcha' || type === 'select') {
  newProps.name = field
  // }
  if (!Render) {
    return null
  }
  return <Render {...newProps} onChange={(val: any) => change(val, field)} />
})
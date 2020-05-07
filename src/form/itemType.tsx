import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useUpdateEffect } from '../unit/hooks'
import ItemMap from './itemMap'

interface IProps {
  loading?: boolean,
  conf?: { [key: string]: any },
  values?: { [key: string]: any },
  data?: { [key: string]: any },
  itemMap?: { [key: string]: any },
  onChange?: Function
  onFieldChange?: Function
}

export default observer(function HyItemType(props: IProps) {
  const { values = {}, conf = {}, data = {}, loading = false, itemMap = ItemMap, onChange, onFieldChange } = props
  const change = (val: any, key: string) => {
    const formObj: { [key: string]: any } = {}
    formObj[key] = typeof val === 'undefined' ? '' : val
    onFieldChange && onFieldChange(formObj)
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
  useUpdateEffect(() => { // 向上传递经过 store 处理的值 主要解决 form.item 拦截的值 与 store 的值不一致的问题
    console.log('useUpdateEffect');
    onChange && onChange(value)
  }, [value])
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
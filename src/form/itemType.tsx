import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useUpdateEffect } from '../unit/hooks'
import ItemMap from './itemMap'
import RemoteComponent from "../unit/remoteComponent";

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
  const onChangeForm = (values: any) => {
    onChange && onChange(values);
  }
  const { field, isComplex = false } = conf
  const value = values[field]
  const itemData = data[conf.data]
  const type = conf.type || 'Default'
  const [Render, setRender]: [any, Function] = useState(null)
  useEffect(() => {
    setRender(() => conf.render ? conf.render : itemMap[type])
  }, [type, conf.render])
  let newProps: { [key: string]: any } = { ...conf.props, value, }
  let complexProps = (type === 'rangeDate' || type === 'rangeTime' || isComplex) ? { field, onChangeForm, loading, values, dict: data } : {}
  if (itemData) {
    newProps.data = itemData
  }
  useUpdateEffect(() => { // 向上传递经过 store 处理的值 主要解决 form.item 拦截的值 与 store 的值不一致的问题
    onChange && onChange(value)
  }, [value])
  newProps.name = field

  if (!Render) {
    if (!itemMap[type] && conf.type && !conf.render) {
      return <RemoteComponent
        name={type} props={{ ...newProps, ...complexProps, onChange: (val: any) => change(val, field) }} />
    }
    return null
  }
  return <Render {...newProps} {...complexProps} onChange={(val: any) => change(val, field)} />
})

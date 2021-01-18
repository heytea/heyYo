import React, { ReactNode, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import itemMap from "./itemMap";
import template, { isTemplate } from '../unit/template'
import RemoteComponent from '../unit/remoteComponent'

export interface IProps {
  props: { [key: string]: any }
  store: any,
  record: any,
  val: any,
  index?: number,
  type: string,
  data: string,
  render?: ReactNode
}

const RenderDisplay = ({ type, val, data, store, record = {}, props, index, render }: IProps) => {
  const [newProps, setNewProps] = useState({})
  useEffect(() => {
    const tmpProps = {}
    props && Object.keys(props).forEach((key: string) => {
      let val = props[key]
      if (typeof val === 'string' && isTemplate(val)) {
        tmpProps[key] = template(val, { ...record, _index: index })
      } else {
        tmpProps[key] = val
      }
    })
    setNewProps(tmpProps)
  }, [props])
  const C = render ? render : itemMap[type]
  const dfProps = { value: val, data: store.dict[data], record, index }
  if (!C) {
    if (type) {
      return <RemoteComponent name={type} props={{ ...dfProps, ...newProps }} />
    }
    return typeof val === 'object' ? null : val
  }
  return <C {...dfProps} {...newProps} />
}

export default observer(RenderDisplay)

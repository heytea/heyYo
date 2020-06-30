import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import itemMap from "./itemMap";
import template, { isTemplate } from '../unit/template'

export interface IProps {
  props: { [key: string]: any }
  store: any,
  record: any,
  val: any,
  index: number,
  type: string,
  data: string
}

const RenderDisplay = ({ type, val, data, store, record = {}, props, index }: IProps) => {
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
  const C = itemMap[type]
  if (!C) {
    return null
  }
  return <C value={val} data={store.dict[data]} record={record} index={index} {...newProps} />
}

export default observer(RenderDisplay)

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import ItemMap from './itemMap'

interface IProps {
  loading?: boolean,
  conf?: { [key: string]: any },
  values?: { [key: string]: any },
  data?: { [key: string]: any },
  itemMap?: { [key: string]: any },
  onChange?: Function
}

@observer
export default class ItemType extends Component<IProps> {

  static defaultProps = {
    loading: false,
    conf: {},
    values: {},
    data: {},
    itemMap: ItemMap
  }

  change = (val: any, key: string) => {
    const { onChange } = this.props
    const formObj = {}
    formObj[key] = typeof val === 'undefined' ? '' : val
    onChange && onChange(formObj)
  }

  render() {
    const { values = {}, conf = {}, data = {}, loading = false, itemMap = {}, onChange } = this.props
    const { field, props = {} } = conf
    const value = values[field]
    const itemData = data[conf.data]
    const type = conf.type || 'Default'
    const Render = typeof conf.render === 'function' ? conf.render : itemMap[type]
    if (!Render) {
      return null
    }
    let newProps: { [key: string]: any } = { value }
    if (itemData) {
      newProps.data = itemData
    }
    if (!Render.prototype.isReactComponent) {
      newProps = { ...newProps, conf, field, onChangeForm: onChange, loading, values, dict: data }
      return <Render {...newProps} {...props} onChange={(val: any) => this.change(val, field)}/>
    }
    // if (type === 'input' || type === 'captcha' || type === 'select') {
    newProps.name = field
    // }
    return <Render {...newProps} {...props} onChange={(val: any) => this.change(val, field)}/>
  }
}

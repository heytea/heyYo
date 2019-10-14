import React, { Component } from "react";
import { observer } from 'mobx-react'
import DisplayMap from '../../display/itemMap'

// @observer
// class AdTable extends Component<IAdTableProps> {
//   render() {
//     const { props } = this
//     const { Store, loadingKey, ...args } = props
//     return (
//       <Table
//         pagination={false}
//         size='small'
//         {...args}
//         loading={Store[loadingKey]}
//         dataSource={(props.value && props.value.slice && props.value.slice()) || []}/>
//     )
//   }
// }

@observer
export default class DetailRender extends Component<{ item?: { type?: string, props?: object, data: string }, data?: object, Store?: object, scroll?: object, value?: string | number }> {
  render() {
    const { item: { type = '', props = {}, data = '' } = {}, value = '', Store, scroll = {} } = this.props

    if (!type) {
      if (typeof value === 'string' || typeof value === 'number' || value === null || typeof value === 'boolean') {
        return value
      }
      console.error(`值类型为 ${typeof value}无法渲染`)
      return null
    }
    const RenderCom = DisplayMap[type]
    if (RenderCom) {
      if (data) {
        // @ts-ignore
        props.data = Store.dict[data]
      }
      return <RenderCom Store={Store} {...props} scroll={scroll || {}} value={value}/>
    }
    console.error(`渲染组件 ${type} 不存在`)
    return null
  }
}

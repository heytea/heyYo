import React, { Component } from 'react'
import { observer } from 'mobx-react-lite'
import ItemMap from './itemMap'
import Cascader from './item/cascader'
import RangeDate from './item/rangeDate'
import SelectTree from './item/selectTree'
import Timestamp from './item/timestamp'
import Tree from './item/tree'

interface IProps {
  conf?: { props?: Object, [key: string]: any },
  field?: string,
  onChange: Function,
  onChangeForm: Function,
  values: { [key: string]: any }
}

// @observer
class RangeDateAp extends Component<IProps> {
  render() {
    const { conf: { props = {} } = {}, field = '', onChangeForm, values } = this.props
    const [startKey, endKey] = field.split(',')
    // @ts-ignore
    return <RangeDate {...props} start={values[startKey]} end={values[endKey]} onChange={(val: string[]) => {
      values[startKey] = val[0]
      values[endKey] = val[1]
      onChangeForm(values)
    }}/>
  }
}

const itemMapPlus: { [key: string]: any } = {
  ...ItemMap,
  cascader: Cascader,
  rangeDate: (props: IProps) => <RangeDateAp {...props}/>,
  selectTree: SelectTree,
  timestamp: Timestamp,
  tree: Tree,
}
export default itemMapPlus


import React, { Component } from 'react'
import { observer } from 'mobx-react'
import ItemMap from './itemMap'
import Cascader from './item/cascader'
import RangeDate from './item/rangeDate'
import SelectTree from './item/selectTree'
import Timestamp from './item/timestamp'
import Tree from './item/tree'
import InputRange from "./item/inputRange";
import EditorWang, {IProps as EditorWangIProps} from './item/editor_wang';

interface IProps {
  conf?: { props?: Object, [key: string]: any },
  field?: string,
  onChange: Function,
  values: { [key: string]: any }
  format?: string
}

@observer
class RangeDateAp extends Component<IProps> {
  render() {
    const { conf: { props = {} } = {}, field = '', onChange, values, format } = this.props
    const [startKey, endKey] = field.split(',')
    return <RangeDate {...props} format={format} start={values[startKey]} end={values[endKey]} onChange={(val: string[]) => {
      values[startKey] = val[0]
      values[endKey] = val[1]
      onChange(values)
    }}/>
  }
}

export default {
  ...ItemMap,
  cascader: Cascader,
  rangeDate: (props: IProps) => <RangeDateAp {...props}/>,
  editorWang: (props: EditorWangIProps) => <EditorWang {...props}/>,
  selectTree: SelectTree,
  timestamp: Timestamp,
  tree: Tree,
  inputRange: (props: IProps) => <InputRange {...props}/>,
}


import React, { Component } from 'react'
// import { observer } from 'mobx-react-lite'
import { TreeSelect } from 'antd'
import { TreeSelectProps } from 'antd/lib/tree-select'

const TreeNode = TreeSelect.TreeNode;

interface IProps extends TreeSelectProps<any> {
  value?: number | string | Array<string>,
  multipleToStr?: boolean,
  data?: Array<any>,
  valKey?: string,
  split?: string,
  labelKey?: string,
  childKey?: string,
  onChange?: (val: any) => void
}

// @observer
export default class SelectTree extends Component<IProps> {
  change = (val: any | Array<any> = '') => {
    const { onChange, multiple = true, multipleToStr = false, split = '/' } = this.props
    const isValToStr = multiple && multipleToStr

    if (onChange) {
      let newVal: string | string[]
      if (val instanceof Array) {
        newVal = isValToStr ? val.join(split) : val
      } else {
        newVal = val
      }
      onChange(newVal)
    }
  }

  render() {
    const { data = [], multiple = true, value = '', valKey = 'id', labelKey = 'title', childKey = 'child', multipleToStr = false, split = '/', ...args } = this.props
    const isValToStr = multiple && multipleToStr
    const treeProps = {
      treeNodeFilterProp: 'title',
      allowClear: true,
      multiple,
      showSearch: true,
      placeholder: '请选择', ...args
    }

    let newVal: number | number[] | string | string[]
    if (value instanceof Array) {
      newVal = value
    } else {
      newVal = isValToStr && typeof value === 'string' ? value.split(split) : value + ''
    }
    return (
      <TreeSelect
        {...treeProps}
        value={newVal === '' ? undefined : newVal}
        onChange={this.change}>
        {childTree({ data, valKey, labelKey, childKey, isValToStr })}
      </TreeSelect>
    )
  }
}
const childTree = function ({ data = [], valKey = 'id', labelKey = 'title', childKey = 'child', isValToStr }: any = {}) {
  return data.map ? data.map((item: any) => {
    const title = item[labelKey]
    const value = isValToStr ? item[valKey] + '' : item[valKey]
    const child = item[childKey]
    return (
      <TreeNode title={title} value={value} key={value}>
        {child && childTree({ data: child, valKey, labelKey, childKey })}
      </TreeNode>)
  }) : null
}

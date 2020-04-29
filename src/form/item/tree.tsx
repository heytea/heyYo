import React, { Component } from 'react'
import { Tree } from 'antd'
import { AntTreeNodeCheckedEvent, TreeProps } from "antd/lib/tree";

const TreeNode = Tree.TreeNode

type IChange = (checkedKeys: string[] | {
  checked: string[];
  halfChecked: string[];
}, e?: AntTreeNodeCheckedEvent) => void

interface IProps extends TreeProps {
  value?: Array<any>,
  data?: Array<any>,
  valKey?: string,
  labelKey?: string,
  childKey?: string,
  isRemoveParentKey?: boolean,
  onChange?: IChange,
  isRender?: boolean,
  parent?: string,
}


export default class extends Component<IProps> {
  haveChild: Function
  check: any

  constructor(props: IProps) {
    super(props)
    const { valKey = 'id', childKey = 'child' } = props

    this.haveChild = (treeData: any[], map?: any) => {
      const tmpMap = map || {}
      for (let i = 0; i < treeData.length; i += 1) {
        const item = treeData[i]
        if (item[childKey] && item[childKey].length > 0) {
          tmpMap[item[valKey]] = 1
          this.haveChild(item[childKey], tmpMap)
        }
      }
      return tmpMap
    }
  }

  // @ts-ignore
  check = (keys: string[], e: any) => {
    const { onChange, isRemoveParentKey, data = [] } = this.props
    if (onChange) {
      if (isRemoveParentKey) {
        const haveChildIdMap = this.haveChild(data)
        const newValue = []
        for (let i = 0; keys && i < keys.length; i += 1) {
          const item = keys[i]
          if (!haveChildIdMap[item]) {
            newValue.push(item)
          }
        }
        onChange(newValue, e)
      } else {
        onChange(keys, e)
      }
    }
  }

  render() {
    const { data = [], valKey = 'id', isRemoveParentKey = false, labelKey = 'title', childKey = 'child', value = [], onChange, isRender, ...args } = this.props
    let newValue: any[]
    if (isRemoveParentKey) {
      const haveChildIdMap = this.haveChild(data)
      newValue = []
      for (let i = 0; value && i < value.length; i += 1) {
        const item = value[i]
        if (!haveChildIdMap[item]) {
          newValue.push(item)
        }
      }
    } else {
      newValue = value
    }
    return (
      <Tree checkable {...args} checkedKeys={newValue} onCheck={this.check}>
        {childTree({ data, valKey, labelKey, childKey, isRender, parent: '' })}
      </Tree>
    )
  }
}

const childTree = function ({ data = [], valKey = 'id', labelKey = 'title', childKey = 'child', isRender, parent }: IProps = {}) {
  return data.map ? data.map((item, index) => {
    const Render = item.render;
    const current = parent ? `${parent}.child[${index}]` : `${parent}[${index}]`;
    const title = <>
      <div style={{marginRight: '10px',display: 'inline-block'}}> {item[labelKey]}</div>
      {isRender && Render &&  <Render {...item} current={current} parent={parent}/>}
    </>;

    return <TreeNode title={title} key={item[valKey]} disabled={item.disabled}>
      {item[childKey] && item[childKey].length > 0 && childTree({data: item[childKey], valKey, labelKey, childKey, isRender, parent: current})}
    </TreeNode>
    }) : null
};

import React, { Component, ReactText } from 'react'
import { Checkbox } from 'antd'

const CheckboxGroup = Checkbox.Group
// data 支持
// data = ['a', 'b'] => [{label:'a',value:0}]
// data = { 1: 'name1', 2: 'name2' }
// data = { 1: { name: 'name1' }, 2: { name: 'name2' } } // valKey 不填 取 key
// data = { 1: { id: 1, name: 'name1' }, 2: { id: 2, name: 'name2' } } // valKey = 'id' labelKey = 'name'
// data = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }] // valKey = 'id' labelKey = 'name'
interface IProps {
  value?: string | string[],
  data?: Object | Array<any>,
  labelKey?: string,
  valKey?: string,
  split?: string,
  onChange?: Function,
}

export default class ReCheckbox extends Component<IProps> {
  static defaultProps = {
    value: ''
  }

  change = (val: Array<any>) => {
    const { onChange, split, value } = this.props
    onChange && onChange(typeof value === 'string' ? val.join(split) : val)
  }

  render() {
    const { labelKey = 'label', valKey = 'value', data, split = '/', value, ...args } = this.props

    let checkData: Array<{ label: ReactText, value: ReactText }> = []
    if (data instanceof Array) {
      if (data[0] && typeof data[0] !== 'object') {
        data.forEach((item, i) => checkData.push({ label: item, value: i }))
      } else if (labelKey !== 'label' || valKey !== 'value') {
        data.forEach((item) => checkData.push({ label: item[labelKey], value: item[valKey] }))
      }
    } else if (typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        const item = data[key]
        if (typeof item === 'object') {
          checkData.push({ label: item[labelKey], value: typeof item[valKey] === 'undefined' ? key : item[valKey] })
        } else {
          checkData.push({ label: item, value: key })
        }
      })
    }
    const optArr = checkData.length > 0 ? checkData : undefined
    let val: Array<string> = (typeof value === 'string' ? value.split(split) : value) || []

    return <CheckboxGroup {...args} options={optArr} value={val} onChange={this.change}/>
  }
}

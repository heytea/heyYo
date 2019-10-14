import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Select } from 'antd'
import { SelectProps } from 'antd/lib/select'

const Option = Select.Option

export interface IProps extends SelectProps<any> {
  value?: string | string[] | number | number[]
  data?: Object | Array<any>,
  isNull?: boolean,
  vToString?: boolean,
  splitKey?: string,
  labelKey?: string,
  valKey?: string,
  showSearch?: boolean,
  placeholder?: string,
  mode?: string,
  onChange?: (value: any, option?: React.ReactElement<any> | React.ReactElement<any>[]) => void,

}

// data 支持
// data = ['s1','s2']
// data = { 1: 'name1', 2: 'name2' }
// data = { 1: { name: 'name1' }, 2: { name: 'name2' } } // valKey 不填 取 key
// data = { 1: { id: 1, name: 'name1' }, 2: { id: 2, name: 'name2' } } // valKey = 'id' labelKey = 'name'
// data = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }] // valKey = 'id' labelKey = 'name'
@observer
export default class extends Component<IProps> {
  static defaultProps = {
    value: ''
  }
  change = (val: any) => {
    const { onChange, value, splitKey = ',', mode } = this.props
    if (onChange) {
      if (mode === 'multiple' && (typeof value === 'string' || value === null)) {
        onChange(val.join(splitKey))
      } else {
        onChange(val)
      }
    }
  }

  render() {
    const { data, labelKey = 'name', valKey = 'id', showSearch = false, isNull = true, placeholder = '请选择', splitKey = ',', value = '', vToString = true, mode, ...args } = this.props
    const dfProps: { optionFilterProp?: string, filterOption?: (input: any, option: any) => any, mode?: string } = {}
    if (showSearch) {
      dfProps.optionFilterProp = labelKey
      dfProps.filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    let newValue: string[] | string | number[] | number = (value === null) ? '' : value
    let isToString = vToString

    if (mode === 'multiple') {
      dfProps.mode = mode
      if (typeof value === 'string' || value === null) {
        newValue = value ? value.split(splitKey) : []
      }
    }
    return (
      <Select placeholder={placeholder} allowClear={true} showSearch={showSearch}
              value={typeof newValue !== 'object' && isToString ? (newValue === '' ? undefined : newValue + '') : newValue}
              {...dfProps} {...args}
              onChange={this.change}>
        {isNull && <Option key={''} value="">{placeholder}</Option>}
        {data && typeof data === 'object' && (data instanceof Array ?
            data.map((item) => { // 数组
              if (typeof item !== 'object') {
                return (<Option key={item} value={isToString ? item + '' : item}>{item}</Option>)
              }
              const value = item[valKey || 'id']
              const label = item[labelKey]
              return (<Option key={value} value={isToString ? value + '' : value}>{label}</Option>)
            }) :
            Object.keys(data).map((key) => { // 对像
              if (typeof data[key] !== 'object') {
                return (<Option key={key} value={key}>{data[key]}</Option>)
              } else {
                const obj = data[key]
                const value = valKey ? obj[valKey] : key
                const label = obj[labelKey]
                return (<Option key={value} value={isToString ? value + '' : value}>{label}</Option>)
              }
            })
        )}
      </Select>
    )
  }
}

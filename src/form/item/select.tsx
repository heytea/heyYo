import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { Select } from 'antd'
import { SelectProps } from 'antd/lib/select'
import { observer } from 'mobx-react-lite';
import LangContent from "../../lang";

const Option = Select.Option

// @ts-ignore
export interface IProps extends SelectProps<any> {
  value?: string | string[] | number | number[]
  data?: { [key: string]: any } | Array<any>,
  isNull?: boolean,
  vToString?: boolean,
  splitKey?: string,
  labelKey?: string,
  valKey?: string,
  showSearch?: boolean,
  placeholder?: string,
  onChange?: (value: any, option?: React.ReactElement<any> | React.ReactElement<any>[]) => void,

}

// data 支持
// data = ['s1','s2']
// data = { 1: 'name1', 2: 'name2' }
// data = { 1: { name: 'name1' }, 2: { name: 'name2' } } // valKey 不填 取 key
// data = { 1: { id: 1, name: 'name1' }, 2: { id: 2, name: 'name2' } } // valKey = 'id' labelKey = 'name'
// data = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }] // valKey = 'id' labelKey = 'name'
const HySelect = observer(function HySelect(props: IProps) {
  const lang = useContext(LangContent)
  const { onChange, data, labelKey = 'name', valKey = 'id', showSearch = false, isNull = false, placeholder = lang.please_choose, splitKey = ',', value = '', vToString = true, mode, ...args } = props
  const change = (val: any) => {
    if (onChange) {
      if (mode === 'multiple' && (typeof value === 'string' || value === null)) {
        onChange(val.join(splitKey))
      } else {
        onChange(val)
      }
    }
  }
  const [dfProps, setDfProps]: [{ [key: string]: any }, Function] = useState({})
  const [c, setC]: [ReactNode, Function] = useState(null)

  let newValue: undefined | string[] | string | number[] | number = (value === null) ? '' : value

  if (mode === 'multiple') {
    if (typeof value === 'string' || value === null) {
      newValue = value ? value.split(splitKey) : []
    }
  }
  newValue = (typeof newValue !== 'object' && vToString ? (newValue === '' ? undefined : newValue + '') : newValue)

  useEffect(() => {
    if (showSearch) {
      setDfProps({
        optionFilterProp: labelKey,
        filterOption: (input: string, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      })
    } else {
      setDfProps({})
    }
  }, [showSearch])

  useEffect(() => {
    setC((
      <>
        {isNull && <Option key={''} value="">{placeholder}</Option>}
        {data && typeof data === 'object' && (data instanceof Array ?
          data.map((item) => { // 数组
            if (typeof item !== 'object') {
              return (<Option key={item} value={vToString ? item + '' : item}>{item}</Option>)
            }
            const value = item[valKey || 'id']
            const label = item[labelKey]
            return (<Option key={value} value={vToString ? value + '' : value}>{label}</Option>)
          }) :
          Object.keys(data).map((key) => { // 对像
            if (typeof data[key] !== 'object') {
              return (<Option key={key} value={key}>{data[key]}</Option>)
            } else {
              const obj = data[key]
              const value = valKey ? obj[valKey] : key
              const label = obj[labelKey]
              return (<Option key={value} value={vToString ? value + '' : value}>{label}</Option>)
            }
          })
        )}
      </>
    ))
  }, [isNull, data, placeholder, vToString, valKey, labelKey])
  return (
    <Select placeholder={placeholder} allowClear={true} mode={mode} showSearch={showSearch} {...dfProps} {...args}
      value={newValue} onChange={change}>
      {c}
    </Select>
  )
})
export default HySelect

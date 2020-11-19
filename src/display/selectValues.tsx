import React from 'react'
import { Tag } from 'antd'

export interface IProps {
  value?: string | string[] | number | number[]
  data?: { [key: string]: any } | Array<any>,
  vToString?: boolean,
  splitKey?: string,
  labelKey?: string,
  valKey?: string,
  isTag?: boolean,
}

// data 支持
// data = ['s1','s2']
// data = { 1: 'name1', 2: 'name2' }
// data = { 1: { name: 'name1' }, 2: { name: 'name2' } } // valKey 不填 取 key
// data = { 1: { id: 1, name: 'name1' }, 2: { id: 2, name: 'name2' } } // valKey = 'id' labelKey = 'name'
// data = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }] // valKey = 'id' labelKey = 'name'


export default function SelectValues(props: IProps) {
  const { data, labelKey = 'name', valKey = 'id', splitKey = ',', value = '', vToString = true, isTag = true } = props
  const valMap: { [key: string]: any } = {}
  const keyArr = value instanceof Array ? value : (vToString && typeof value === 'string' ? value.split(splitKey) : [value])
  if (keyArr.length < 1) {
    return null
  }
  keyArr.forEach && keyArr.forEach((key: any) => valMap[key] = true)
  if (data && typeof data === 'object') {
    if (data instanceof Array) {
    }
  }

  return (
    <>
      {data && typeof data === 'object' && (data instanceof Array ?
        data.map((item) => { // 数组
          if (typeof item !== 'object') {
            return valMap[item] ? <Tag>{item}</Tag> : null
          }
          const value = item[valKey || 'id']
          const label = item[labelKey]
          return valMap[value] ? (isTag ? <Tag key={value}>{label}</Tag> : label) : null
        }) :
        Object.keys(data).map((key) => { // 对像
          if (typeof data[key] !== 'object') {
            return valMap[key] ? (isTag ? <Tag key={key}>{data[key]}</Tag> : data[key]) : null
          } else {
            const obj = data[key]
            const value = valKey ? obj[valKey] : key
            const label = obj[labelKey]
            return valMap[value] ? (isTag ? <Tag key={value}>{label}</Tag> : label) : null
          }
        })
      )}
    </>
  )
}

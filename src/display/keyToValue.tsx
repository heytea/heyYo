import React from 'react'
import { Tag } from 'antd'

export interface IPros {
  value?: string | number,
  data?: { [key: string]: string | number },
  color?: string,
  colors?: { [key: string]: string },
  isTag?: boolean
}

export default function KeyToValue(props: IPros) {
  const { value = '', data = {}, colors = {}, isTag = false, color = '' } = props
  const text = data[value] || value
  if (!isTag) {
    return text
  }
  const newColor = color || colors[value] || 'blue'
  return (<Tag color={newColor}>{text}</Tag>)
}

import React, { Component } from 'react'
import { Tag } from 'antd'

export interface IPros {
  value?: string | number,
  data?: { [key: string]: string | number },
  color?: string,
  colors?: { [key: string]: string },
  isTag?: boolean
}

export default class KeyToValue extends Component<IPros> {
  render() {
    const { value = '', data = {}, colors = {}, isTag = false, color = '' } = this.props
    const text = data[value] || value
    if (!isTag) {
      return text
    }
    const newColor = color || colors[value] || 'blue'
    return (<Tag color={newColor}>{text}</Tag>)
  }
}

import React, { Component } from 'react'
import { Input } from 'antd'
import {TextAreaProps} from 'antd/lib/input/TextArea'

export interface IProps extends TextAreaProps {
  onChange?: any,
  allowSpace?: boolean
}

export default class ReTextArea extends Component<IProps> {

  change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { onChange, allowSpace = false } = this.props
    const value = e.target.value
    allowSpace
    ? onChange && onChange(value)
    : onChange && onChange(typeof value as any === 'string' ? value.trim() : value)
  }

  render() {
    return <Input.TextArea {...this.props} onChange={this.change} />
  }
}

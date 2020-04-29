import React, { Component } from 'react'
import { Switch } from 'antd'
import TextAreaProps from 'antd/lib/input/TextArea'

export interface IProps extends TextAreaProps {
  onChange?: Function,
  value: boolean,
}

export default class ReSwitch extends Component<IProps> {

  change = (checked: boolean, _event: MouseEvent) => {
    const { onChange } = this.props
    onChange && onChange(checked)
  }

  render() {
    return <Switch {...this.props} checked={this.props.value} onChange={this.change} />
  }
}

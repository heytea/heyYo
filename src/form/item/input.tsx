import React, { Component } from 'react'
import { Input } from 'antd'
import Svg from '../../display/svg'
import { InputProps } from 'antd/lib/input/Input'

export interface IProps extends InputProps {
  icon?: string,
  onChange?: any,
}

export default class ReInput extends Component<IProps> {

  change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props
    const value = e.target.value
    onChange && onChange(value)
  }

  render() {
    const { icon, ...args } = this.props
    const prefix = icon ? (typeof icon === 'function' ? icon : <Svg src={icon}/>) : null
    return <Input allowClear={true} {...args} onChange={this.change} prefix={prefix}/>
  }
}

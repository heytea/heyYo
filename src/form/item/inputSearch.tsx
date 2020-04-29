import React, { Component, ReactNode, FocusEventHandler } from 'react'
import { Input } from 'antd'
import { SearchProps } from 'antd/lib/input/index'
import Svg from '../../display/svg'

export interface IProps extends SearchProps {
  onChange?: any,
  icon?: string,
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
    return <Input.Search  {...args} onChange={this.change} prefix={prefix}/>
  }
}

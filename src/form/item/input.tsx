import React, {Component} from 'react'
import {Input} from 'antd'
import Svg from '../../display/svg'
import {InputProps} from 'antd/lib/input/'

export interface IProps extends InputProps {
  icon?: string,
  onChange?: any,
  allowSpace?: boolean
}

export default class ReInput extends Component<IProps> {
  change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {onChange, allowSpace = false} = this.props
    const value = e.target.value
    allowSpace
    ? onChange && onChange(value)
    : onChange && onChange(typeof value as any === 'string' ? value.trim() : value)
  }

  render() {
    const {icon, ...args} = this.props
    const prefix = icon ? (typeof icon === 'function' ? icon : <Svg src={icon}/>) : null
    return <Input  {...args} onChange={this.change} prefix={prefix} autoComplete='nope'/>
  }
}

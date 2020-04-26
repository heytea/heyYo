import React, { ReactNode, useEffect, useState } from 'react'
import { Input } from 'antd'
import Svg from '../../display/svg'
import { InputProps } from 'antd/lib/input/Input'

export interface IProps extends InputProps {
  icon?: string | ReactNode,
  onChange?: any,
}

export default function HyInput(props: IProps) {
  const { icon, onChange, ...args } = props
  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange && onChange(value)
  }
  const [prefix, setPrefix]: [ReactNode, Function] = useState(null)
  useEffect(() => {
    setPrefix(icon ? (typeof icon !== 'string' ? icon : <Svg src={icon} />) : null)
  }, [icon])
  return <Input allowClear={true} {...args} onChange={change} prefix={prefix} />
}

// class ReInput extends Component<IProps> {
//
//   change = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { onChange } = this.props
//     const value = e.target.value
//     onChange && onChange(value)
//   }
//
//   render() {
//     const { icon, ...args } = this.props
//     const prefix = icon ? (typeof icon === 'function' ? icon : <Svg src={icon} />) : null
//     return <Input allowClear={true} {...args} onChange={this.change} prefix={prefix} />
//   }
// }

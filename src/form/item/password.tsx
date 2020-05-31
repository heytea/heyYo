import React, { ReactNode, useEffect, useState } from 'react'
import { Input } from 'antd'
import Svg from '../../display/svg'
import { InputProps } from 'antd/lib/input/Input'
import { observer } from 'mobx-react-lite'

export interface IProps extends InputProps {
  icon?: string | ReactNode,
  onChange?: any,
  onChangeForm?: any,
}

export default observer(function HyInput(props: IProps) {
  const { icon, onChange, onChangeForm, value, ...args } = props
  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange && onChange(value)
  }
  const [prefix, setPrefix]: [ReactNode, Function] = useState(null)
  useEffect(() => {
    setPrefix(icon ? (typeof icon !== 'string' ? icon : <Svg src={icon} />) : null)
  }, [icon])
  return <Input.Password allowClear={true} prefix={prefix} {...args} onChange={change} value={value} />
})
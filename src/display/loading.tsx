import React from 'react'
import { Spin } from "antd";
import { SpinProps } from 'antd/lib/spin'

export interface IProps extends SpinProps {
  isCenter?: boolean
}

export default function Loading(props: IProps) {
  const { isCenter = true, ...args } = props
  return <Spin className={isCenter ? 'c-loading-center' : ''} spinning={true} {...args} />
}
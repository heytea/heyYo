import React, { Component } from 'react'
import { Spin } from "antd";
import { SpinProps } from 'antd/lib/spin'

export interface IProps extends SpinProps {
  isCenter?: boolean
}

export default class Loading extends Component<IProps> {
  static defaultProps = {
    isCenter: false
  }

  render() {
    const { isCenter, ...args } = this.props
    return <Spin className={isCenter ? 'c-loading-center' : ''} spinning={true} {...args}/>
  }
}

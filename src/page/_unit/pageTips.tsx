import React, { Component } from "react"
import { Alert } from 'antd'

export default class PageTips extends Component<{ show?: boolean | Function, message: any }> {
  render() {
    const { show = true, ...args } = this.props
    const isShow = typeof show === 'function' ? show() : show
    if (!isShow) {
      return null
    }
    return <Alert showIcon={true} {...args} className='u-page-tips'/>
  }
}

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Input, { IProps as IInputProps } from './input'

interface IProps extends IInputProps {
  value?: string,
  data?: { img: '' },
  onGetImg?: Function
}

@observer
export default class extends Component<IProps> {

  render() {
    const { onGetImg, data: { img = '' } = {}, className = '', ...args } = this.props
    const isSvg = /^<svg/.test(img)
    const aProps: { [key: string]: any } = {
      className: "c-img-captcha-btn",
      href: "javascript:;",
      title: "更新验证码",
      onClick: () => onGetImg && onGetImg()
    }
    if (isSvg) {
      aProps.dangerouslySetInnerHTML = { __html: img }
    } else {
      aProps.children = img ? <img className="c-img-captcha-img" src={img} alt="验证码"/> : '获取验证码'
    }
    return (
      <Input placeholder="验证码" autoComplete="off"{...args} className={`c-img-captcha ${className || ''}`}
             addonAfter={<a {...aProps}/>}/>
    )
  }
}

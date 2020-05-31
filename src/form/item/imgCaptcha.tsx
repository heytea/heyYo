import React, { useEffect, useState } from 'react'
import Input, { IProps as IInputProps } from './input'

interface IProps extends IInputProps {
  value?: string,
  data?: { img: '' },
  onGetImg?: Function,
  btnText?: string,
}

export default function ImgCaptcha(props: IProps) {
  const { onGetImg, data: { img = '' } = {}, btnText = '获取验证码', className = '', ...args } = props
  const reClassName = `c-img-captcha ${className || ''}`
  const [aProps, setAProps] = useState({})
  useEffect(() => {
    const isSvg = /^<svg/.test(img)
    const tmpAProps: { [key: string]: any } = {
      className: 'c-img-captcha-btn',
      // href: 'javascript:;',
      title: '更新验证码',
      onClick: () => onGetImg && onGetImg()
    }
    if (isSvg) {
      tmpAProps.dangerouslySetInnerHTML = { __html: img }
    } else {
      tmpAProps.children = img ? <img className="c-img-captcha-img" src={img} alt="验证码" /> : btnText
    }
    setAProps(tmpAProps)
  }, [img])

  return <Input placeholder="验证码" autoComplete="off" {...args} className={reClassName}
                addonAfter={<a {...aProps} />} />
}

// class ImgCaptcha1 extends Component<IProps> {
//
//   render() {
//     const { onGetImg, data: { img = '' } = {}, className = '', ...args } = this.props
//     const isSvg = /^<svg/.test(img)
//     const aProps: { [key: string]: any } = {
//       className: "c-img-captcha-btn",
//       href: "javascript:;",
//       title: "更新验证码",
//       onClick: () => onGetImg && onGetImg()
//     }
//     if (isSvg) {
//       aProps.dangerouslySetInnerHTML = { __html: img }
//     } else {
//       aProps.children = img ? <img className="c-img-captcha-img" src={img} alt="验证码" /> : '获取验证码'
//     }
//     return (
//       <Input placeholder="验证码" autoComplete="off"{...args} className={`c-img-captcha ${className || ''}`}
//              addonAfter={<a {...aProps} />} />
//     )
//   }
// }

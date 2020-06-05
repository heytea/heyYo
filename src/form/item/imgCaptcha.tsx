import React, { useContext, useEffect, useState } from 'react'
import Input, { IProps as IInputProps } from './input'
import LangContent from '../../lang'

interface IProps extends IInputProps {
  value?: string,
  data?: { img: '' },
  onGetImg?: Function,
  btnText?: string,
}

export default function ImgCaptcha(props: IProps) {
  const lang = useContext(LangContent)
  const { onGetImg, data: { img = '' } = {}, btnText = lang.get_captcha, className = '', ...args } = props
  const reClassName = `c-img-captcha ${className}`
  const [aProps, setAProps] = useState({})
  useEffect(() => {
    const isSvg = /^<svg/.test(img)
    const tmpAProps: { [key: string]: any } = {
      className: 'c-img-captcha-btn',
      // href: 'javascript:;',
      title: lang.update_captcha,
      onClick: () => onGetImg && onGetImg()
    }
    if (isSvg) {
      tmpAProps.dangerouslySetInnerHTML = { __html: img }
    } else {
      tmpAProps.children = img ? <img className="c-img-captcha-img" src={img} alt={lang.captcha} /> : btnText
    }
    setAProps(tmpAProps)
  }, [img])

  return (
    <Input
      placeholder={lang.captcha}
      autoComplete="off" {...args}
      className={reClassName}
      addonAfter={<a {...aProps} />} />
  )
}

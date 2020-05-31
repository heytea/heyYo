import React, { useEffect, useState } from 'react'
import LoadingOutlined from '@ant-design/icons/LoadingOutlined'
import Input, { IProps as IInputProps } from './input'

interface IProps extends IInputProps {
  isActive?: boolean,
  onGetCode?: Function,
  className?: string
}

export default function Captcha(props: IProps) {
  const [remain, setRemain] = useState(0)
  const [loading, setLoading] = useState(false)
  const [intervalID, setIntervalID] = useState(0)
  const { isActive, className, onGetCode, ...args } = props
  let isUnmount = false
  useEffect(() => {
    return () => {
      isUnmount = true
      intervalID && clearInterval(intervalID)
    }
  }, [])
  const getCode = async () => {
    if (!loading && remain < 1 && isActive && typeof onGetCode === 'function') {
      setLoading(true)
      const codeData = await onGetCode()
      if (!isUnmount) {
        setLoading(false)
        if (codeData.code === 0) {
          let remainNum = 60
          const tmpIntervalID = setInterval(() => {
            remainNum -= 1
            setRemain(remainNum)
            if (remainNum < 1) {
              clearInterval(tmpIntervalID)
            }
          }, 1000)
          setRemain(remainNum)
          setIntervalID(intervalID)
        }
      }
    }
  }
  console.log(args);
  return (
    <Input
      autoComplete="off"
      {...args}
      className={`c-captcha ${className || ''} `}
      addonAfter={
        <a className={`c-captcha-btn ${!loading && remain < 1 && isActive ? 'z-active' : ''}`}
           onClick={getCode}>
          {loading ? <LoadingOutlined /> : (remain > 0 ? `${remain}S` : `获取验证码`)}
        </a>
      }
    />)
}
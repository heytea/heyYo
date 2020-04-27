import React, { useEffect, useState } from 'react'
// import { observer } from 'mobx-react-lite'
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
      if (isUnmount) {
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
  return (
    <Input
      placeholder="验证码"
      autoComplete="off"
      {...args}
      className={`c-captcha ${className || ''} `}
      addonAfter={
        <a className={`c-captcha-btn ${!loading && remain < 1 && isActive ? 'z-active' : ''}`}
           onClick={getCode}>
          {remain > 0 ? `${remain}S` : `获取验证码`}
        </a>
      }
    />)
}

// export default observer(Captcha)

// @observer
// class Captcha1 extends Component<IProps, IState> {
//   isUnmount: boolean
//
//   constructor(props: IProps) {
//     super(props)
//     this.state = { remain: 0, loading: false }
//     this.isUnmount = false
//   }
//
//   componentWillUnmount() {
//     const { intervalID } = this.state
//     intervalID && clearInterval(intervalID)
//     this.isUnmount = true
//   }
//
//   getCode = async () => {
//     const { remain, loading } = this.state
//     const { isActive, onGetCode } = this.props
//     if (!loading && remain < 1 && isActive && typeof onGetCode === 'function') {
//       this.setState({ loading: true })
//       const codeData = await onGetCode()
//       if (!this.isUnmount) {
//         this.setState({ loading: false })
//         if (codeData.code === 0) {
//           let remainNum = 60
//           const tmpIntervalID = setInterval(() => {
//             remainNum -= 1
//             this.setState({ remain: remainNum })
//             if (remainNum < 1) {
//               clearInterval(tmpIntervalID)
//             }
//           }, 1000)
//           this.setState({ remain: remainNum, intervalID: tmpIntervalID })
//         }
//       }
//     }
//   }
//
//   render() {
//     const { isActive, className, onGetCode, ...args } = this.props
//     const { remain, loading } = this.state
//     return (
//       <Input
//         placeholder="验证码"
//         autoComplete="off"
//         {...args}
//         className={`c-captcha ${className || ''} `}
//         addonAfter={
//           <a href="javascript:;" className={`c-captcha-btn ${!loading && remain < 1 && isActive ? 'z-active' : ''}`}
//              onClick={this.getCode}>
//             {remain > 0 ? `${remain}S` : `获取验证码`}
//           </a>
//         }
//       />)
//   }
// }

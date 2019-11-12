import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../config'
import Loading from '../display/loading'

const fnMap: { [key: string]: any } = {}

export interface IProps {
  name: string,
  props?: { [key: string]: any },
  children?: any
}

export default function (props: IProps) {
  const { name = '', props: CProps = {} } = props || {}
  const { config: { remoteJsUrl = '', apiFormat: { code, msg, data }, codeSuccess }, Http: { httpGet } } = useContext(ConfigContext)
  const [RemoteC, setRemoteC] = useState(() => () => <Loading isCenter />)
  const [isLoad, setIsLoad] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const fetchJs = async () => httpGet(remoteJsUrl, { name })
  const fetchDataSingle = () => {
    return fnMap[name] || (fnMap[name] = new Promise(function (resolve) {
      fetchJs().then((data) => {
        resolve(data)
        fnMap[name] && delete fnMap[name]
      })
    }))
  }
  // @ts-ignore
  const setC = async () => {
    setIsLoad(false)
    const jsData = await fetchDataSingle()
    if (jsData[code] !== codeSuccess) {
      setErrMsg(jsData[msg] || '代码加载失败')
    } else {
      try {
        // eslint-disable-next-line no-eval
        window.eval(jsData[data])
        // @ts-ignore
        const C = window[name]
        console.log('c', typeof C);
        if (typeof C === 'function') {
          setRemoteC(() => C)
        } else {
          setErrMsg(`代码已加载，但 ${name} 类型为 ${typeof C}`)
        }
      } catch (e) {
        setErrMsg(e.message || 'eval 出错了')
      }
    }
    setIsLoad(true)
  }
  useEffect(() => {
    // @ts-ignore
    const C = window[name]
    if (typeof C === 'function') {
      setRemoteC(() => C)
      setIsLoad(true)
    } else if (typeof C === 'undefined') {
      setC()
    } else {
      setIsLoad(true)
      setErrMsg(`window 已存在 ${name} 但类型为 ${typeof C}`)
    }
    // eslint-disable-next-line
  }, [name])
  return (
    !isLoad ? <Loading isCenter /> : (errMsg ? <div>{errMsg}</div> : <RemoteC {...CProps} />)
  )
}

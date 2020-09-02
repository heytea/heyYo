import React, { useContext, useEffect, useState } from 'react'
import { ConfigContext } from '../config'
import Loading from '../display/loading'

const fnMap: { [key: string]: any } = {}

export interface IProps {
  name: string,
  url?: string,
  props?: { [key: string]: any },
  children?: any
}

export default function (props: IProps) {
  const { name = '', url = '', props: CProps = {} } = props || {}
  const { config: { remoteJsUrl = '' } } = useContext(ConfigContext)
  const [RemoteC, setRemoteC] = useState(() => () => <Loading isCenter />)
  const [isLoad, setIsLoad] = useState(true)
  const [errMsg, setErrMsg] = useState('')
  const fetchJs = () => new Promise(function (resolve) {
    const jsEl = document.createElement('script')
    jsEl.setAttribute('type', 'text/javascript')
    jsEl.setAttribute('src', url ? url : remoteJsUrl + '/' + name + '.js')
    jsEl.onload = (e: any) => resolve(true)
    jsEl.onerror = () => resolve(false)
    document.body.appendChild(jsEl)
  })
  const fetchDataSingle = () => {
    return fnMap[name] || (fnMap[name] = new Promise(function (resolve) {
      fetchJs().then((data) => {
        resolve(data)
        fnMap[name] && delete fnMap[name]
      })
    }))
  }
  const runJs = () => {
    try {
      const C = window[name]
      if (typeof C === 'function') {
        setRemoteC(() => C)
      } else if (C && typeof (C.default === 'function' || typeof C.default.type === 'function')) {
        setRemoteC(() => C.default)
      } else {
        setErrMsg(`代码已加载，但 ${name} 类型为 ${typeof C}`)
      }
    } catch (e) {
      setErrMsg(e.message || 'eval 出错了')
    }
  }
  const setC = async () => {
    setIsLoad(false)
    await fetchDataSingle()
    setIsLoad(true)
    runJs()
  }
  useEffect(() => {
    const C = window[name]
    if (typeof C === 'undefined') {
      setC()
    } else {
      runJs()
    }
  }, [name])
  return (
    !isLoad ? <Loading isCenter /> : (errMsg ? <div>{errMsg}</div> : <RemoteC {...CProps} />)
  )
}

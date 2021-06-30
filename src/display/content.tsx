import React, { isValidElement, ReactNode, useContext } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Spin } from 'antd'
import AuthContext from '../store/auth'
import { ConfigContext } from '../config'
import LangContent from '../lang'


interface IProps {
  code?: number | string,
  msg?: string | object
  data?: any,
  loading?: boolean
  children?: ReactNode
}

function Content(props: IProps) {
  const Auth = useContext(AuthContext)
  const lang = useContext(LangContent)
  const { pathname, search } = useLocation()
  const { config: { codeSuccess, codeUnauthorized, errsMap = {} } } = useContext(ConfigContext)
  const errArr: string[] = []
  const { code = '', msg = '', loading = false, children = null } = props
  if (typeof msg === 'object') {
    Object.keys(msg).forEach((key) => {
      // @ts-ignore
      errArr.push(msg[key])
    })
  } else {
    errArr.push(msg)
  }
  if (!loading && code === codeUnauthorized) {
    if (process.browser && Auth && Auth.setUser) {
      Auth.setReferrer(pathname + search)
      setTimeout(() => {
        Auth.setUser()
      }, 100)
    }
    return (<Redirect to="/login" />)
  }
  const ErrC = errsMap[code]
  if (ErrC) {
    if (isValidElement(ErrC)) {
      return <div className="m-error">{ErrC}</div>
    }
    return <div className="m-error"><ErrC {...props} /></div>
  }
  return (
    <Spin spinning={loading} delay={400} tip="loading……">
      {code !== codeSuccess && code !== '' ?
        <div className="m-error">
          <h2>{lang.page_error}：{code}</h2>
          <h4>{lang.error_message}：</h4>
          {errArr.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
          <p>{lang.contact_admin}</p>
        </div> :
        children
      }
    </Spin>
  )
}

export default observer(Content)

import React, { Component } from 'react'
import { withRouter, Redirect, RouteComponentProps } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Spin } from 'antd'
import { IAuth } from '../store/auth'
import Conf from '../config'

const { codeSuccess, codeUnauthorized } = Conf

interface IProps {
  code?: number | string,
  msg?: string | object
  loading?: boolean
  Auth?: IAuth
}

@inject('Auth') @observer
class Content extends Component<IProps & RouteComponentProps> {
  render() {
    const errArr = []
    const { code = '', msg = '', loading = false, children = null, Auth, location: { pathname, search } } = this.props
    if (typeof msg === 'object') {
      Object.keys(msg).forEach((key) => {
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
      return (<Redirect to="/login"/>)
    }
    return (
      <Spin spinning={loading} delay={400} tip="loading……">
        {code !== codeSuccess && code !== '' ?
          <div className="m-error">
            <h2>页面出错了：{code}</h2>
            <h4>错误信息：</h4>
            {errArr.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
            <p>请联系系统管理员 </p>
          </div> :
          children
        }
      </Spin>
    )
  }
}

export default withRouter(Content)

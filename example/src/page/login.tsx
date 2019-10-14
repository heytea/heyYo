import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import { observer, inject } from 'mobx-react'
import { Button } from 'antd'
import Auth, { IAuth } from '../store/auth'
import { IUI } from '../store/ui'
import { Full, EditForm, Link } from 'heyyo'
import Config from '../config'
import './login.less'

const { apiFormat: { code }, codeSuccess } = Config

@inject('Auth', 'UI') @observer
class App extends Component<{ Auth: IAuth, UI: IUI } & RouteComponentProps> {
  submit = async () => {
    const { Auth: { login, referrer, setReferrer }, history: { replace } } = this.props
    const loginData = await login()
    if (loginData[code] === codeSuccess) {
      setTimeout(() => replace(referrer || ''), 100) // setToken
      setReferrer('')
    }
  }

  componentDidMount() {
    const { UI } = this.props
    UI && UI.setPageTitle('登录')
  }

  render() {
    const { Auth: { loginStatus: { submit, loading } } } = this.props
    return (
      <Full className='l-login'>
        <div id="p-login">
          <div className="m-login-box">
            <h1 className="u-title">登录</h1>
            <EditForm Store={Auth} name='login' onSubmit={this.submit}>
              <Button htmlType="submit" loading={loading} type="primary" block disabled={!submit}>登录</Button>
              <div className="u-link-box">
                <Link href="/reset" className="reset">找回密码</Link>
              </div>
            </EditForm>
          </div>
        </div>
      </Full>
    )
  }
}

export default App

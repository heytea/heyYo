import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import { observer, inject } from 'mobx-react'
import { Button } from 'antd'
import Auth, { IAuth } from '../store/auth'
import { IUI } from '../store/ui'
import { Full, EditForm, Link } from '@heytea/heyyo'
import './reset.less'
import Config from '../config'

const { apiFormat: { code }, codeSuccess } = Config

@inject('Auth', 'UI') @observer
class App extends Component<{ Auth: IAuth, UI: IUI } & RouteComponentProps> {
  submit = async () => {
    const { Auth: { reset, referrer, setReferrer }, history: { replace } } = this.props
    const logData = await reset()
    if (logData[code] === codeSuccess) {
      replace(referrer || '')
      setReferrer('')
    }
  }

  componentDidMount() {
    const { UI } = this.props
    UI && UI.setPageTitle('重置密码')
  }

  render() {
    const { Auth: { resetStatus: { submit, loading } } } = this.props
    return (
      <Full className='l-reset'>
        <div id="p-reset">
          <div className="m-reset-box">
            <h1 className="u-title">重置密码</h1>
            <EditForm Store={Auth} name='reset' onSubmit={this.submit}>
              <Button htmlType="submit" loading={loading} type="primary" block disabled={!submit}>重置密码</Button>
              <div className="u-link-box">
                <Link href="/login" className="reset">登录</Link>
              </div>
            </EditForm>
          </div>
        </div>
      </Full>
    )
  }
}

export default App

import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import { observer, inject } from 'mobx-react'
import { Button } from 'antd'
import Auth, { IAuth } from '../../store/auth'
import { IUI } from '../../store/ui'
import { EditForm } from '@heytea/heyyo'
import './password_reset.less'

@inject('Auth', 'UI') @observer
class App extends Component<{ Auth: IAuth, UI: IUI } & RouteComponentProps> {
  componentDidMount() {
    const { UI } = this.props
    UI && UI.setPageTitle('重置密码')
  }

  render() {
    const { Auth: { passwordReset, passwordResetStatus: { submit, loading } } } = this.props
    return (
      <div id="p-my-reset-password">
        <h1 className="u-title">重置密码</h1>
        <EditForm Store={Auth} name="passwordReset" onSubmit={passwordReset}>
          <Button htmlType="submit" loading={loading} type="primary" block disabled={!submit}>重置</Button>
        </EditForm>
      </div>
    )
  }
}

export default App

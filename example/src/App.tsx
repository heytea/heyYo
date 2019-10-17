import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { ConfigContext } from '@heytea/heyyo'
import AuthPage from './page/_auth'
import Auth from './store/auth'
import UI from './store/ui'
import Http from './api/http'
import config from './config'
import './app.less'

export default class extends Component {
  render() {
    return (
      <ConfigContext.Provider value={{ config, Http }}>
        <Provider Auth={Auth} UI={UI}>
          <Router>
            <ConfigProvider locale={zh_CN}>
              <AuthPage/>
            </ConfigProvider>
          </Router>
        </Provider>
      </ConfigContext.Provider>
    )
  }
}

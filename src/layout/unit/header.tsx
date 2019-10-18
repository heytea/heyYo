import React, { Component } from 'react'
import { Menu, Dropdown, Avatar } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Link from '../../display/link'
import UI, { IUI } from '../../store/ui'
import { inject, observer } from 'mobx-react'
import Auth, { IAuth } from '../../store/auth'
import Svg from '../../display/svg'
import { ConfigContext } from '../../config'

export interface IProps {
  UI?: IUI
  Auth?: IAuth
}

@inject('UI', 'Auth') @observer
class Header extends Component<IProps & RouteComponentProps> {
  static contextType = ConfigContext

  state = { isShowPasswordReset: false }
  menuClick = async ({ key }: { key: string }) => {
    const { config: { codeSuccess, apiFormat: { code } } } = this.context
    const { Auth: { logout } = Auth, UI: { clearMyMenu } = UI, history } = this.props
    if (key === 'logout') {
      const outData = await logout()
      if (outData[code] === codeSuccess) {
        clearMyMenu()
        history.replace('/login')
      }
    } else if (key) {
      history.push(key)
    }
  }

  render() {
    const { UI: { myMenu, site: { name } } = UI, Auth: { user } = Auth, location: { pathname } } = this.props
    const { config: { topAccountMenu } } = this.context
    const tmpArr = pathname.replace(/^\//, '').split('/')
    const top = `/${tmpArr[0]}`
    return (
      <div id="b-header">
        <Link href='/' className="logo">{name}</Link>
        {!(pathname === '/' || pathname === 'login' || pathname === 'reset') &&
        <div className="m-top-menu">
            <Menu
                theme="dark"
                selectedKeys={[top]}
                mode="horizontal"
            >
              {myMenu && myMenu.map((item: any) =>
                <Menu.Item key={item.path}>
                  <Link href={item.path}><Svg src={item.icon}/>{item.name}</Link>
                </Menu.Item>
              )}
            </Menu>
        </div>
        }
        {user.id ?
          <div className="m-account">
            <Dropdown overlay={(
              <Menu theme="dark" onClick={this.menuClick}>
                {topAccountMenu && topAccountMenu.map((item: any) => <Menu.Item key={item.key}>{item.name}</Menu.Item>)}
                <Menu.Item key="logout">退出</Menu.Item>
              </Menu>
            )}>
              <p className="avatar"><Avatar size="small" icon="user"/> {user.name}</p>
            </Dropdown>
          </div> : null
        }
      </div>
    )
  }
}

export default withRouter(Header)

import React, { Component } from 'react'
import { Menu, Dropdown, Avatar } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Link from '../../display/link'
import UI, { IUI } from "../../store/ui";
import { inject, observer } from "mobx-react";
import Auth, { IAuth } from "../../store/auth";
import Svg from '../../display/svg'

export interface IPorps {
  UI?: IUI
  Auth?: IAuth
}

@inject('UI', 'Auth') @observer
class Header extends Component<IPorps & RouteComponentProps> {

  render() {
    const { UI: { myMenu, site: { name } } = UI, Auth: { user } = Auth, location: { pathname } } = this.props
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
              <Menu theme="dark">
                {/*<Menu.Item key="info"><Link href="/setting">个人信息</Link></Menu.Item>*/}
                <Menu.Item key="resetPassword">修改密码</Menu.Item>
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

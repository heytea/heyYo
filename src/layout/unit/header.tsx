import React, { useContext } from 'react'
import { Menu, Dropdown, Avatar } from 'antd'
import UserOutlined from '@ant-design/icons/UserOutlined'
import { useHistory, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import UIContext from '../../store/ui'
import AuthContext from '../../store/auth'
import { ConfigContext } from '../../config'
import Link from '../../display/link'
import Svg from '../../display/svg'
import HySelect from '../../form/item/select'
import LangContent from '../../lang'

const Header = observer(function () {
  const { logout, user } = useContext(AuthContext)
  const ui = useContext(UIContext)
  const { clearMyMenu, myMenu, site: { name }, lang, langList = [], setLang, headerConf = {} } = ui
  const { menuBeforeNode: MenuBefore, menuAfterNode: MenuAfter, rightNode: RightNode, theme = 'dark', isShowMenu = true, isShowLang = true, menuProps = {}, dropdownProps = {} } = headerConf
  const { config: { codeSuccess, apiFormat: { code }, topAccountMenu } } = useContext(ConfigContext)
  const langObj = useContext(LangContent)
  const history = useHistory()
  const { pathname } = useLocation()
  const menuClick = async (info: any) => {
    const { key = '' } = info || {}
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
  const tmpArr = pathname.replace(/^\//, '').split('/')
  const top = `/${tmpArr[0]}`
  return (
    <div id="b-header" className={theme}>
      <Link href='/' className="logo">{name}</Link>
      {['object', 'function'].indexOf(typeof MenuBefore) > -1 && <MenuBefore />}
      {isShowMenu && !(pathname === '/' || pathname === 'login' || pathname === 'reset') &&
        <div className="m-top-menu">
          <Menu
            theme={theme}
            mode="horizontal"
            {...menuProps}
            selectedKeys={[top]}
          >
            {myMenu && myMenu.map((item: any) =>
              <Menu.Item key={item.path}>
                <Link href={item.path}><Svg src={item.icon} />{item.name}</Link>
              </Menu.Item>
            )}
          </Menu>
        </div>
      }
      {['object', 'function'].indexOf(typeof MenuAfter) > -1 && <MenuAfter />}
      <div className="m-top-menu-right">
        {['object', 'function'].indexOf(typeof RightNode) > -1 && <RightNode />}
        {user.id ?
          <div className="m-account">
            <Dropdown overlay={(
              <Menu theme={theme} onClick={menuClick}>
                {topAccountMenu && topAccountMenu.map((item: any) => <Menu.Item key={item.key}>{item.name}</Menu.Item>)}
                <Menu.Item key="logout">{langObj.out}</Menu.Item>
              </Menu>
            )}
              {...dropdownProps}>
              <p className="avatar">
                <Avatar size="small" src={user.avatar} icon={<UserOutlined />} />
                {' ' + user.name}
              </p>
            </Dropdown>
          </div> : null
        }
        {isShowLang && langList?.length > 0 &&
          <div className="m-lang">
            <HySelect
              style={{ minWidth: 60 }}
              dropdownMatchSelectWidth={80}
              showArrow={false}
              allowClear={false} isNull={false} data={langList} onChange={(lang: string) => setLang(lang)}
              size="small" value={lang} />
          </div>}
      </div>
    </div>
  )
})

export default Header

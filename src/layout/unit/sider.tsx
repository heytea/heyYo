import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { IUI } from '../../store/ui'
import { inject, observer } from 'mobx-react'
import UI from '../../store/ui'
import { Menu } from 'antd'
import Link from '../../display/link'
import Svg from "../../display/svg";

interface IProps {
  UI?: IUI
}

@inject('UI') @observer
class Sider extends Component<IProps & RouteComponentProps> {
  state = { openKeys: [], selectedKeys: [] }
  openChange = (openKeys: string[]) => {
    this.setState({ openKeys: openKeys })
  }
  urlSetKey = () => {
    const { location: { pathname } } = this.props
    const { openKeys } = this.state
    const newPathname = pathname.replace(/(edit|add|detail)$/, 'list')
    const tmpArr = newPathname.replace(/^\//, '').split('/')
    const top = `/${tmpArr[0]}`
    const selectedKeys: string[] = [top]
    for (let i = 1; i < tmpArr.length; i += 1) {
      selectedKeys.push(`${selectedKeys[i - 1]}/${tmpArr[i]}`)
    }
    const tmpKeys = selectedKeys.concat(openKeys)
    const tmpMap = {}
    tmpKeys.forEach((item) => tmpMap[item] = 1)
    this.setState({ selectedKeys, openKeys: Object.keys(tmpMap) })
  }

  componentDidMount() {
    this.urlSetKey()
  }

  componentDidUpdate(prevProps: any) {
    const { location: { pathname, search } } = this.props
    const { location: { pathname: prevPathname, search: prevSearch } } = prevProps
    if (pathname + search !== prevPathname + prevSearch) {
      this.urlSetKey()
    }
  }

  render() {
    const { selectedKeys, openKeys } = this.state
    const { UI: { leftMenuMap, layout: { clientWidth }, mobileWidth } = UI, location: { pathname } } = this.props
    const tmpArr = pathname.replace(/^\//, '').split('/')
    const top = `/${tmpArr[0]}`
    const menu = leftMenuMap[top] || []
    const isMobile = mobileWidth > clientWidth
    return <div className="b-sider">
      <Menu theme="dark" selectedKeys={selectedKeys} openKeys={openKeys}
            onOpenChange={this.openChange}
            mode="inline"
            inlineCollapsed={isMobile}>
        {menu.map((item: any) => displayMenu(item, isMobile))}
      </Menu>
    </div>
  }
}

function displayMenu(item: any, isMobile: boolean) {
  const { path = '', child = [], name = '', icon = 'img' } = item || {}
  if (child.length > 0) {
    return (
      <Menu.SubMenu key={path}
                    title={<span><Svg className={isMobile ? 'z-m' : ''} src={icon || 'img'}/>{name}</span>}>
        {child.map((item: any) => displayMenu(item, isMobile))}
      </Menu.SubMenu>
    )
  }
  return <Menu.Item key={path}>
    <Link href={path}><Svg className={isMobile ? 'z-m' : ''} src={icon || 'img'}/>{name}</Link>
  </Menu.Item>
}

export default withRouter(Sider)

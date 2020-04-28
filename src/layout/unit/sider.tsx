import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Menu } from 'antd'
import Link from '../../display/link'
import Svg from '../../display/svg'
import UIContext from '../../store/ui'

const Sider = observer(function () {
  const [openKeys, setOpenKeys]: [string[], Function] = useState([])
  const [selectedKeys, setSelectedKeys]: [string[], Function] = useState([])
  const { pathname, search } = useLocation()
  const { leftMenuMap, layout: { clientWidth }, mobileWidth } = useContext(UIContext)

  const urlSetKey = () => {
    const newPathname = pathname.replace(/(edit|add|detail)$/, 'list')
    const tmpArr = newPathname.replace(/^\//, '').split('/')
    const top = `/${tmpArr[0]}`
    const selectedKeys: string[] = [top]
    for (let i = 1; i < tmpArr.length; i += 1) {
      selectedKeys.push(`${selectedKeys[i - 1]}/${tmpArr[i]}`)
    }
    const tmpKeys = selectedKeys.concat(openKeys)
    const tmpMap: { [key: string]: any } = {}
    tmpKeys.forEach((item) => tmpMap[item] = 1)
    setSelectedKeys(selectedKeys)
    setOpenKeys(Object.keys(tmpMap))
  }
  useEffect(() => urlSetKey(), [pathname, search])

  const tmpArr = pathname.replace(/^\//, '').split('/')
  const top = `/${tmpArr[0]}`
  const menu = leftMenuMap[top] || []
  const isMobile = mobileWidth > clientWidth
  return <div className="b-sider">
    <Menu theme="dark" selectedKeys={selectedKeys} openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          mode="inline"
          inlineCollapsed={isMobile}>
      {menu.map((item: any) => displayMenu(item, isMobile))}
    </Menu>
  </div>
})

export default Sider

function displayMenu(item: any, isMobile: boolean) {
  const { path = '', child = [], name = '', icon = 'img' } = item || {}
  if (child.length > 0) {
    return (
      <Menu.SubMenu
        key={path}
        title={<span><Svg className={isMobile ? 'z-m' : ''} src={icon || 'img'} />{name}</span>}
      >
        {child.map((item: any) => displayMenu(item, isMobile))}
      </Menu.SubMenu>
    )
  }
  return (
    <Menu.Item key={path}>
      <Link href={path}><Svg className={isMobile ? 'z-m' : ''} src={icon || 'img'} />{name}</Link>
    </Menu.Item>
  )
}

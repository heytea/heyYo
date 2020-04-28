import React, { ComponentProps } from 'react'
import Footer from './unit/footer'
import Header from './unit/header'
import Sider from './unit/sider'

export default function LeftSider(props: ComponentProps<any>) {
  const { children = null, ...args } = props || {}

  return (
    <div {...args} id="l-left-sider">
      <Header />
      <div className="b-content">
        <Sider />
        <div className="b-right-content-wp">
          <div className="b-right-content">{children}</div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
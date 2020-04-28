import React, { ComponentProps } from 'react'
import Footer from './unit/footer'
import Header from './unit/header'

export default function Full(props: ComponentProps<any>) {
  const { children = null, ...args } = props || {}
  return (
    <div {...args} id="l-full">
      <Header />
      <div className="b-content-wp">
        <div className="b-content">{children}</div>
        <Footer />
      </div>
    </div>
  )
}
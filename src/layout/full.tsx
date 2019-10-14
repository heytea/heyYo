import React, { Component, ComponentProps } from 'react'
import Footer from './unit/footer'
import Header from './unit/header'

export default class Full extends Component<ComponentProps<any>> {
  render() {
    const { children = null, ...args } = this.props
    return (
      <div {...args} id="l-full">
        <Header/>
        <div className="b-content-wp">
          <div className="b-content">{children}</div>
          <Footer/>
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react'
import Footer from './unit/footer'
import Header from './unit/header'
import Sider from './unit/sider'

export default class Full extends Component {
  render() {
    return (
      <div id="l-left-sider">
        <Header/>
        <div className="b-content">
          <Sider/>
          <div className="b-right-content-wp">
            <div className="b-right-content">
              {this.props.children || null}
            </div>
            <Footer/>
          </div>
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react'
import { withRouter, RouteComponentProps, Redirect } from 'react-router-dom'
import { IUI } from '../../store/ui'
import { inject, observer } from 'mobx-react'
import UI from '../../store/ui'

interface IProps {
  UI?: IUI
}

@inject('UI') @observer
class JumpToOne extends Component<IProps & RouteComponentProps> {
  getUrl = (arr: any): string => {
    const item = (arr && arr[0]) ? arr[0] : ''
    if (item) {
      if (item.child && item.child.length > 0) {
        return this.getUrl(item.child)
      }
      if (item.path) {
        return item.path
      }
    }
    return ''
  }

  render() {
    const { UI: { leftMenuMap } = UI, location: { pathname } } = this.props
    const tmpArr = pathname.replace(/^\//, '').split('/')
    const top = `/${tmpArr[0]}`
    const menu = leftMenuMap[top]
    const webUrl = this.getUrl(menu)
    return webUrl ? <Redirect to={webUrl}/> : <div/>
  }
}


export default withRouter(JumpToOne)

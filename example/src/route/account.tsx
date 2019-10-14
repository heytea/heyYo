import React, { Component } from 'react'
import { LeftSider, JumpToOne, RenderRoute, Detail } from 'heyyo'
import Privilege from '../store/account/admin/privilege'
import P404 from '../page/p404'

const routerConf = {
  rootPath: '/account',
  'p404': P404,
  routers: [
    { path: '', exact: true, component: JumpToOne },
    {
      path: 'admin/privilege',
      store: Privilege,
      pages: { tree: { render: (props: any) => <Detail {...props} name="tree"/> } },
    }
  ]
}

export default class System extends Component {
  render() {
    return <LeftSider><RenderRoute {...routerConf}/></LeftSider>
  }
}


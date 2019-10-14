import React, { Component } from 'react'
import { LeftSider, JumpToOne, RenderRoute } from 'heyyo'
import Table from '../store/system/table'
import Dict from '../store/system/dict'
import Api from '../store/system/api'
import Page from '../store/system/page'
import P404 from '../page/p404'

const routerConf = {
  rootPath: '/system',
  'p404': P404,
  routers: [
    { path: '', exact: true, component: JumpToOne },
    { path: 'table', store: Table, pages: { add: {}, edit: {}, detail: {} } },
    { path: 'dict', store: Dict, pages: { add: {}, edit: {}, detail: {} } },
    { path: 'api', store: Api, pages: { add: {}, edit: {}, detail: {} } },
    { path: 'page', store: Page, pages: { add: {}, edit: {}, detail: {} } },
  ]
}

export default class System extends Component {
  render() {
    return <LeftSider><RenderRoute {...routerConf}/></LeftSider>
  }
}


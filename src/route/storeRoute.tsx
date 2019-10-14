import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Add from '../page/add'
import Edit from '../page/edit'
import List from '../page/list'
import Detail from '../page/detail'
import P404 from '../page/p404'

const pageMap = {
  add: Add,
  edit: Edit,
  list: List,
  detail: Detail
}

export interface IStoreRouteProps {
  path: string,
  store: any,
  pages: string[],
  p404: any
}


export default class StoreRoute extends Component<IStoreRouteProps> {
  router: any = null

  constructor(props: any) {
    super(props)
    const { path, store, pages, p404 = P404 } = this.props
    const arr: any[] = []
    const s = new store()
    Object.keys(pages).forEach((page: any) => {
      const props: any = pages[page] || {}
      let C = pageMap[page]
      if (props.render) {
        C = props.render
      }
      if (C) {
        arr.push({ path: path + (page ? '/' + page : ''), component: () => <C Store={s} {...props}/> })
      }
    })
    arr.push({ path: '*', component: p404 })
    this.router = (
      <Switch>
        {arr.map(route => (
          <Route key={route.path} {...route}/>
        ))}
      </Switch>
    )
  }

  render(): React.ReactNode {
    return this.router
  }
}

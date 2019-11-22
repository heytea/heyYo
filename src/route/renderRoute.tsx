import React, {Component} from 'react'
import {Route, Switch, withRouter} from 'react-router-dom'
import StoreRoute from './storeRoute'
import P404 from "../page/p404";

export interface IProps {
  rootPath: string,
  routers: any[],
  p404: any
}

class _RouteComponent extends Component<any> {
  render() {
    const {children} = this.props;
    return children;
  }
}

const RouteComponent = withRouter(_RouteComponent);
export default class RenderRoute extends Component<IProps> {
  router: any = null


  constructor(props: any) {
    super(props)
    const {rootPath, routers, p404 = P404} = this.props
    const arr: any[] = []
    routers.forEach((item: any) => {
      const path = rootPath + (item.path ? '/' + item.path : '');
      if (item.store && item.pages) {
        arr.push({path, component: () => <RouteComponent><StoreRoute p404={p404} {...item} path={path}/></RouteComponent>})
      } else {
        arr.push({...item, path, component: () => <RouteComponent>{item.component}</RouteComponent>})
      }
    })
    arr.push({path: rootPath + '*', component: p404})
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

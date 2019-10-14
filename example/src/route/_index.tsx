import React, { ComponentClass, FunctionComponent } from 'react'
import { Loading } from '@heytea/heyyo'
import Loadable from 'react-loadable'
import IndexPage from '../page/index'
import P404 from '../page/p404'

const loading = () => <Loading isCenter={true}/>

const router: Array<{ exact?: boolean | undefined, path: string, component: ComponentClass | FunctionComponent }> = [
  { exact: true, path: '/', component: IndexPage },
  { path: '/system', component: Loadable({ loader: () => import('./system'), loading }) },
  { path: '/account', component: Loadable({ loader: () => import('./account'), loading }) },
  { path: '*', component: P404 }
]
export default router

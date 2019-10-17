import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Full, EditForm, Link } from '@heytea/heyyo'
import PasswordReset from '../page/my/password_reset'

const routes = [
  { path: '/my/reset-password', component: PasswordReset }
]
export default class System extends Component {
  render() {
    return <Full className='l-my'>
      <Switch>
        {routes.map(route => (
          <Route key={route.path} {...route}/>
        ))}
      </Switch>
    </Full>
  }
}

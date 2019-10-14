import React, { Component } from 'react'
import { observer } from 'mobx-react'
import List from './list'
import Add from './add'
import Edit from './edit'
import Detail from './detail'
import { withRouter } from 'react-router-dom'

const pageMap = { list: List, add: Add, edit: Edit, detail: Detail }

@observer
class AutoPage extends Component<any> {
  render() {
    const { type, store } = this.props
    const Page = pageMap[type]
    if (Page) {
      return <Page Store={store}/>
    }
    return <div>autoPage {type}</div>
  }
}

export default withRouter(AutoPage)

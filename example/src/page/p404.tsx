import React, { Component } from 'react'
import { Link, Svg, Loading, AutoPage } from 'heyyo'
import { detail } from '../api/system/page'
import { withRouter } from 'react-router-dom'
import AutoStore from '../store/system/_page/autoStore'

class P404 extends Component<any> {

  state: { loading: boolean, type: string, store: any } = { loading: false, type: '', store: '' }

  componentDidMount() {
    this.fetchData()
  }

  getPageConf = async () => {
    const { location = {} } = this.props
    const { pathname } = location
    const confData = await detail({ url: pathname })
    const { code, data } = confData
    if (code === 0) {
      this.setState({ store: new AutoStore(data), type: data.type })
    }
  }

  async fetchData() {
    this.setState({ loading: true })
    await this.getPageConf()
    this.setState({ loading: false })
  }

  componentDidUpdate(prevProps: any) {
    const pathname = this.props.location.pathname
    const prevPathname = prevProps.location.pathname
    if (prevPathname !== pathname) {
      this.fetchData()
    }
  }

  render() {
    const { loading, type, store } = this.state
    if (loading) {
      return <Loading isCenter/>
    }
    if (type) {
      return <AutoPage type={type} store={store}/>
    }
    return (
      <div id="p-404">
        <Svg src="404" className="u-icon"/>
        <Link href="/" className="u-link">返回首页</Link>
      </div>
    )
  }
}

// export default P404
export default withRouter(P404)

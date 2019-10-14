import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import Content from '../display/content'
import { Divider } from 'antd'
import DetailGrid from './_unit/detailGrid'
import ActionBtn from './_unit/actionsBtn'
import PageTips from './_unit/pageTips'
import Breadcrumb from './_unit/breadcrumb'
import { IAuth } from "../store/auth";
import UI, { IUI } from "../store/ui";
import Conf from "../config";

export interface IProps extends RouteComponentProps {
  Store: any,
  PageUI?: any,
  name?: string,
  Auth?: IAuth,
  UI?: IUI
}

const { codeSuccess, apiFormat, codeNotConf } = Conf

@inject('UI', 'Auth') @observer
class Detail extends Component<IProps> {
  setTitle() {
    const { UI, Store, name = 'detail' } = this.props
    const ShowConf = Store[`${name}ShowConf`] || {}
    UI && UI.setPageTitle(ShowConf.pageTitle || '详情页')
  }

  async fetchData() {
    const { Store, name = 'detail', location, Auth } = this.props
    location.search && Store.urlSetForm({ name, url: location.search })
    const initDataFn = Store[`${name}InitData`]
    typeof initDataFn === 'function' && initDataFn.call(Store, { location, Auth })
    Store.getDetail({ formName: name })
  }

  componentDidMount(): void {
    this.fetchData()
    this.setTitle()
  }

  componentDidUpdate(prevProps: Readonly<IProps>): void {
    const { location } = this.props
    const prevLocation = prevProps.location
    if (prevLocation.pathname !== location.pathname || prevLocation.search !== location.search) {
      setTimeout(() => this.fetchData())
      this.setTitle()
    }
  }

  // UNSAFE_componentWillReceiveProps(nextProps: IProps) {
  //   const { location } = this.props
  //   const newLocation = nextProps.location
  //   if (newLocation.pathname !== location.pathname || newLocation.search !== location.search) {
  //     setTimeout(() => this.fetchData())
  //     this.setTitle()
  //   }
  // }

  componentWillUnmount() {
    const { Store, name = 'detail', location } = this.props;
    const LeaveDataFn = Store[`${name}LeaveData`];
    typeof LeaveDataFn === 'function' && LeaveDataFn.call(Store, { location });
  }

  render() {
    const { Store, name = 'detail', history, location, PageUI, UI: { layout: { clientWidth }, mobileWidth } = UI, Auth } = this.props
    const detailData = Store[`${name}Data`]
    if (!detailData) {
      return (<Content code={codeNotConf} msg={`Store 的 ${name}Data 未定义`}/>)
    }
    const loading = Store[`${name}Loading`]
    if (typeof loading === 'undefined') {
      return (<Content code={codeNotConf} msg={`Store 的 ${name}Loading 未定义`}/>)
    }
    const breadcrumb = Store[`${name}Breadcrumb`]
    const detailShowConfFn = Store[`${name}ShowConfFn`]
    const detailTips = Store[`${name}Tips`]
    const detailOperate = Store[`${name}Operate`] || {}
    const DetailOperateUI = detailOperate.UI

    const detailShowConf = typeof detailShowConfFn === 'function' ? detailShowConfFn.call(Store, {
      UI,
      Auth,
      history,
      location,
    }) : Store[`${name}ShowConf`] || {}

    const title = detailShowConf.pageTitle || '详情页'
    const data = detailData[apiFormat.data] || {}
    const errno = detailData[apiFormat.code]
    const errMsg = detailData[apiFormat.msg]
    const btnConf = Store[`${name}BtnConf`] || {}
    const { isEdit = true, isBack = true, actions = [], editBtnName = '修改' } = btnConf
    const editBtn = []
    if (isEdit) {
      const { pathname, search } = location
      editBtn.push({
        onClick: () => history.push(pathname.replace(/\/detail$/, '/edit') + search),
        htmlType: "button",
        type: "primary",
        children: editBtnName
      })
    }
    const BtnActions = actions.concat(editBtn)
    const isMobile = clientWidth < mobileWidth
    return (
      <Content code={errno} msg={errMsg} loading={loading}>
        <div className="content m-detail">
          <div className="m-add-title">
            <Breadcrumb data={breadcrumb} dfTitle={title && title.split('-') && title.split('-')[0]}/>
          </div>
          <Divider/>
          {detailTips && <PageTips {...detailTips}/>}
          {errno === codeSuccess &&
          <DetailContent isMobile={isMobile} Store={Store} data={data} PageUI={PageUI}
                         detailShowConf={detailShowConf}/>}
          <ActionBtn isBack={isBack} actions={BtnActions}/>
        </div>
        {DetailOperateUI && <DetailOperateUI {...detailOperate.props} Store={Store}/>}
      </Content>
    )
  }
}


@observer
class DetailContent extends Component<{ isMobile: boolean, Store: any, PageUI?: any, detailShowConf: { [key: string]: any }, data: any }> {
  render() {
    const { Store, PageUI, detailShowConf, data, isMobile } = this.props
    const { type = 'grid', blocks = [], fields } = detailShowConf
    if (PageUI) {
      return <PageUI Store={Store} data={data}/>
    } else {
      if (type === 'grid') {
        return (
          <DetailGrid isMobile={isMobile} data={data} fields={fields} Store={Store}/>
        )
      }
      if (type === 'blocks') {
        return (<Blocks isMobile={isMobile} blocks={blocks} data={data} Store={Store}/>)
      }
    }
    return null
  }
}

@inject('Auth', 'UI') @observer
class Blocks extends Component<{ isMobile: boolean, data: any, Store: any, Auth?: IAuth, UI?: IUI, blocks: any[] }> {
  render() {
    const { isMobile, data = {}, blocks = [], Auth, UI, Store } = this.props
    return (
      blocks.map((item, index) => {
        const { fields = [], dataKey = '', title = '', describe = '', style = {}, contentStyle = {}, show = true } = item
        const blockData = dataKey && data ? data[dataKey] : data || {}
        const isShow = typeof show === 'function' ? show({ data: blockData, Auth, UI }) : show
        if (!isShow) {
          return null
        }
        return (
          <div key={index} className="m-block" style={style}>
            {title &&
            <h3>{title}{describe && <span style={{
              paddingLeft: '30px',
              fontSize: '0.8em'
            }}>{typeof describe === 'function' ? describe() : describe}</span>}</h3>}
            <div className="m-block-content" style={contentStyle}>
              <DetailGrid isMobile={isMobile} data={blockData} fields={fields} Store={Store}/>
            </div>
          </div>
        )
      })
    )
  }
}

export default withRouter(Detail)
// }

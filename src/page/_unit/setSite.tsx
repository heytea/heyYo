import { Component } from 'react'

export interface ISite {
  name?: string,
  keywords?: string,
  description?: string
}

export interface IProps {
  pageTitle?: string,
  site?: ISite
}

export default class  extends Component<IProps> {
  setInfo(nextProps: IProps, oldProps: IProps) {
    if (process.browser) {
      const newSite: ISite = nextProps.site || {}
      const oldSite: ISite = oldProps.site || {}
      const newPageTitle = nextProps.pageTitle
      const oldPageTitle = oldProps.pageTitle

      if ((newSite.name && newSite.name !== oldSite.name) || newPageTitle !== oldPageTitle) {
        window.document.title = newPageTitle ? `${newPageTitle} - ${newSite.name}` : newSite.name || ''
        const appMateEl = window.document.getElementsByTagName('meta')['apple-mobile-web-app-title']
        if (appMateEl) {
          appMateEl.content = newSite.name
        }
      }
      if (newSite.keywords && newSite.keywords !== oldSite.keywords) {
        const keyEl = window.document.getElementsByTagName('meta')['keywords']
        if (keyEl) {
          keyEl.content = newSite.keywords
        }
      }
      if (newSite.description && newSite.description !== oldSite.description) {
        const descEl = window.document.getElementsByTagName('meta')['description']
        if (descEl) {
          descEl.content = newSite.description
        }
      }
    }
  }

  componentDidUpdate(prevProps: IProps) {
    this.setInfo(this.props, prevProps)
  }

  render() {
    return null
  }
}

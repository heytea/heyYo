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

export default class extends Component<IProps> {
  setInfo(nextProps: IProps, oldProps: IProps) {
    if (process.browser) {
      const newSite: ISite = nextProps.site || {}
      const oldSite: ISite = oldProps.site || {}
      const newPageTitle = nextProps.pageTitle
      const oldPageTitle = oldProps.pageTitle
      const metaEls = window.document.getElementsByTagName('meta') || []
      if ((newSite.name && newSite.name !== oldSite.name) || newPageTitle !== oldPageTitle) {
        window.document.title = newPageTitle ? `${newPageTitle} - ${newSite.name}` : newSite.name || ''
        // @ts-ignore
        const appMateEl = metaEls['apple-mobile-web-app-title']
        if (appMateEl) {
          appMateEl.content = newSite.name
        }
      }
      if (newSite.keywords && newSite.keywords !== oldSite.keywords) {
        // @ts-ignore
        const keyEl = metaEls['keywords']
        if (keyEl) {
          keyEl.content = newSite.keywords
        }
      }
      if (newSite.description && newSite.description !== oldSite.description) {
        // @ts-ignore
        const descEl = metaEls['description']
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

import { observable, action, computed } from 'mobx'
import React from 'react'
import { MenuProps } from 'antd/lib/menu'
import { MenuTheme } from 'antd/lib/menu/MenuContext'
import { DropDownProps } from 'antd/lib/dropdown/dropdown'

export interface IHeaderConf {
  theme?: MenuTheme,
  isShowMenu?: boolean,
  isShowLang?: boolean,
  menuProps?: MenuProps,
  dropdownProps?: DropDownProps | { [key: string]: any }
}
export interface IUI {
  mobileWidth: number
  pageTitle: string,

  setPageTitle(title: string): void

  clearMyMenu(): void

  site: {
    name: string,
    keywords: string,
    description: string
  }
  layout: { clientHeight: number, clientWidth: number, header: number },
  myMenu: { [key: string]: any },
  leftMenuMap: { [key: string]: any },
  initDataLoading: boolean,
  isMobile: boolean,
  langList: { id: string, name: string }[] | string[]
  headerConf?: IHeaderConf
  [key: string]: any
}

export class UI implements IUI {
  constructor() {
    if (process.browser) {
      const { clientWidth, clientHeight } = document.documentElement
      this.setLayout({ clientWidth, clientHeight })
      window.onresize = () => {
        const { clientWidth, clientHeight } = document.documentElement
        this.setLayout({ clientWidth, clientHeight })
      }
    }
  }

  dfLang = 'zh-CN'
  langList = ['zh-CN', 'en-US']
  @observable lang = 'zh-CN'
  @action
  setLang = (v: string) => {
    this.lang = this.langList.indexOf(v) >= 0 ? v : this.dfLang
  }
  @observable
  headerConf: IHeaderConf = {
    theme: 'dark',
    isShowMenu: true,
    isShowLang: true,
    menuProps: {},
    dropdownProps: {}
  }

  mobileWidth = 720
  @observable pageTitle = ''
  setPageTitle = (title: string) => {
    this.pageTitle = title
  }
  @observable site = {
    name: '管理后台',
    keywords: '管理 后台',
    description: '管理后台'
  }
  @observable layout = { clientHeight: 600, scrollTop: 0, clientWidth: 800, header: 48 }
  @action setLayout = (obj: any): void => {
    this.layout = { ...this.layout, ...obj }
  }
  @observable myMenu = []
  @observable initDataLoading = false

  @action
  clearMyMenu = () => {
    this.myMenu = []
  }

  @computed
  get leftMenuMap() {
    const map: { [key: string]: any } = {}
    this.myMenu && this.myMenu.forEach((item: any) => {
      map[item.path] = item.navList || []
    })
    return map
  }

  @computed
  get isMobile() {
    return this.layout.clientWidth <= this.mobileWidth
  }
}

export default React.createContext(new UI() as { [key: string]: any })

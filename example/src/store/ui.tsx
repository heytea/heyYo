import { observable, action, computed } from 'mobx'
import { getPrivilege } from '../api/admin'
import Config from '../config'
import { IResult } from 'heyyo/dist/unit/http'

const { codeSuccess, apiFormat: { code, data } } = Config

export interface IUI {
  pageTitle: string,

  setPageTitle(title: string): void

  clearMyMenu(): void

  site: {
    name: string,
    keywords: string,
    description: string
  }
  layout: { clientHeight: number, clientWidth: number, header: number },
  myMenu: any[],
  // selectedKeys: { [key: string]: any },
  leftMenuMap: { [key: string]: any },
  initDataLoading: boolean,
  initData: Function
}

class UI implements IUI {
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

  @observable pageTitle = ''
  setPageTitle = (title: string) => {
    this.pageTitle = title
  }
  @observable site = {
    name: '喜茶管理后台',
    keywords: '喜茶 管理 后台',
    description: '喜茶管理后台'
  }
  @observable layout = { clientHeight: 600, scrollTop: 0, clientWidth: 800, header: 48 }
  @action setLayout = (obj: any): void => {
    this.layout = { ...this.layout, ...obj }
  }
  @observable myMenu = []
  @observable initDataLoading = false

  @action
  initData = async (): Promise<IResult> => {
    this.initDataLoading = true
    const menuData = await this.getMyMenu()
    this.initDataLoading = false
    return menuData
  }
  @action
  setMyMenu = (arr: any[]) => {
    // @ts-ignore
    this.myMenu = arr
  }
  @action
  clearMyMenu = () => {
    this.myMenu = []
  }

  @action
  getMyMenu = async (): Promise<IResult> => {
    if (this.myMenu.length > 0) {
      return { code: 0, data: '', msg: '' }
    }
    const menuData = await getPrivilege()
    if (menuData[code] === codeSuccess) {
      const privilegeMap: { [key: string]: any } = {}
      const handlePrivilege = (priv: any): any => {
        const { apiUrl, child, icon, id, name, pageUrl, path, type } = priv
        if (type === 'api') {
          privilegeMap[apiUrl] = true
          return null
        }
        if (type === 'menu') {
          const menuChild: any[] = []
          let isMenu: boolean = false
          for (let i = 0; child && i < child.length; i += 1) {
            const item = child[i]
            if (item.type === 'menu') {
              isMenu = true
              const itemChild = handlePrivilege(item)
              itemChild && menuChild.push(itemChild)
            } else if (item.type === 'api') {
              privilegeMap[item.apiUrl] = true
            } else if (item.type === 'page' && item.pageUrl && path === item.pageUrl) {
              isMenu = true
            }
          }
          return isMenu ? { id, icon, name, path: path || pageUrl, child: menuChild.length > 0 ? menuChild : '' } : null
        }
      };
      const menu: any[] = []
      menuData[data].forEach((priv: any) => {
        const menuItem = handlePrivilege(priv)
        menuItem && menu.push(menuItem)
      })
      this.setMyMenu(menu)
    }
    return menuData
  }

  @computed
  get leftMenuMap() {
    const map: { [key: string]: any } = {}
    this.myMenu && this.myMenu.forEach((item: any) => {
      map[item.path] = item.child || []
    })
    return map
  }
}

export default new UI()

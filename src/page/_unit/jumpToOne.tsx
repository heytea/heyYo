import React, { useContext } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import UIContext from '../../store/ui'
import { observer } from 'mobx-react-lite'


function JumpToOne() {
  const { leftMenuMap } = useContext(UIContext)
  const { pathname } = useLocation()
  const getUrl = (arr: any): string => {
    const item = (arr && arr[0]) ? arr[0] : ''
    if (item) {
      if (item.child && item.child.length > 0) {
        return getUrl(item.child)
      }
      if (item.path) {
        return item.path
      }
    }
    return ''
  }
  const tmpArr = pathname.replace(/^\//, '').split('/')
  const top = `/${tmpArr[0]}`
  const menu = leftMenuMap[top]
  const webUrl = getUrl(menu)
  return webUrl ? <Redirect to={webUrl} /> : <div />
}

export default observer(JumpToOne)

// class JumpToOne1 extends Component<IProps & RouteComponentProps> {
//   getUrl = (arr: any): string => {
//     const item = (arr && arr[0]) ? arr[0] : ''
//     if (item) {
//       if (item.child && item.child.length > 0) {
//         return this.getUrl(item.child)
//       }
//       if (item.path) {
//         return item.path
//       }
//     }
//     return ''
//   }
//
//   render() {
//     const { UI: { leftMenuMap } = UI, location: { pathname } } = this.props
//     const tmpArr = pathname.replace(/^\//, '').split('/')
//     const top = `/${tmpArr[0]}`
//     const menu = leftMenuMap[top]
//     const webUrl = this.getUrl(menu)
//     return webUrl ? <Redirect to={webUrl} /> : <div />
//   }
// }
//
//

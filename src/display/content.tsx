import React, { ReactNode, useContext } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Spin } from 'antd'
import AuthContext from '../store/auth'
import Conf from '../config'

const { codeSuccess, codeUnauthorized } = Conf

interface IProps {
  code?: number | string,
  msg?: string | object
  loading?: boolean
  children?: ReactNode
}

function Content(props: IProps) {
  const Auth = useContext(AuthContext)
  const { pathname, search } = useLocation()
  const errArr: string[] = []
  const { code = '', msg = '', loading = false, children = null } = props
  if (typeof msg === 'object') {
    Object.keys(msg).forEach((key) => {
      // @ts-ignore
      errArr.push(msg[key])
    })
  } else {
    errArr.push(msg)
  }
  if (!loading && code === codeUnauthorized) {
    if (process.browser && Auth && Auth.setUser) {
      Auth.setReferrer(pathname + search)
      setTimeout(() => {
        Auth.setUser()
      }, 100)
    }
    return (<Redirect to="/login" />)
  }
  return (
    <Spin spinning={loading} delay={400} tip="loading……">
      {code !== codeSuccess && code !== '' ?
        <div className="m-error">
          <h2>页面出错了：{code}</h2>
          <h4>错误信息：</h4>
          {errArr.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
          <p>请联系系统管理员 </p>
        </div> :
        children
      }
    </Spin>
  )

}

export default observer(Content)

// class Content1 extends Component<IProps & RouteComponentProps> {
//   render() {
//     const errArr: string[] = []
//     const { code = '', msg = '', loading = false, children = null, Auth, location: { pathname, search } } = this.props
//     if (typeof msg === 'object') {
//       Object.keys(msg).forEach((key) => {
//         // @ts-ignore
//         errArr.push(msg[key])
//       })
//     } else {
//       errArr.push(msg)
//     }
//     if (!loading && code === codeUnauthorized) {
//       if (process.browser && Auth && Auth.setUser) {
//         Auth.setReferrer(pathname + search)
//         setTimeout(() => {
//           Auth.setUser()
//         }, 100)
//       }
//       return (<Redirect to="/login" />)
//     }
//     return (
//       <Spin spinning={loading} delay={400} tip="loading……">
//         {code !== codeSuccess && code !== '' ?
//           <div className="m-error">
//             <h2>页面出错了：{code}</h2>
//             <h4>错误信息：</h4>
//             {errArr.map((item, index) => (
//               <p key={index}>{item}</p>
//             ))}
//             <p>请联系系统管理员 </p>
//           </div> :
//           children
//         }
//       </Spin>
//     )
//   }
// }
//
// // export default withRouter(Content)

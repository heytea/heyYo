import React, { useLayoutEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import { Button, Affix } from 'antd'

export interface IProps {
  target?: any
  actions?: Array<{ [key: string]: any }>
  isBack?: boolean
}

const ActionBtn = observer((props: IProps) => {
  const { actions = [], isBack = true, target } = props
  if (!isBack && actions.length < 1) {
    return null
  }
  const history = useHistory()
  const onClick = (item: { [key: string]: any }) => {
    item.onClick && item.onClick(history)
  }
  const affixProps: any = {}
  if (target) {
    affixProps.target = () => target
  } else {
    affixProps.target = () => window.document.getElementsByClassName('b-right-content-wp')[0] || window
  }
  useLayoutEffect(() => {
    const el = affixProps.target()
    el?.dispatchEvent(new Event('resize'));
  }, [affixProps.target])
  return (
    <Affix offsetBottom={0} {...affixProps}>
      <div className="m-page-actions">
        <div className="m-page-actions-btn">
          {actions && actions.map && actions.map((item, index) =>
            <Button className='u-detail-Actions-btn' key={index}  {...item}>{item.children || '操作'}</Button>
          )}
          {isBack && <Button htmlType="button" onClick={history.goBack}>返回</Button>}
        </div>
      </div>
    </Affix>
  )
}
)
export default ActionBtn
// @observer
// class ActionBtn extends Component<IProps & RouteComponentProps> {

//   onClick = (item: { [key: string]: any }) => {
//     let { history } = this.props
//     item.onClick && item.onClick(history)
//   }

//   render() {
//     const { actions, history, isBack = true, target } = this.props
//     const affixProps: any = {}
//     console.log(target)
//     if (target) {
//       affixProps.target = () => target
//     } else {
//       affixProps.target = () => window.document.getElementsByClassName('b-right-content-wp')[0] || window
//     }
//     return (
//       <Affix offsetBottom={0} {...affixProps}>
//         <div className="m-page-actions">
//           {/*<Divider/>*/}
//           <div className="m-page-actions-btn">
//             {actions && actions.map && actions.map((item, index) =>
//               <Button className='u-detail-Actions-btn' key={index}  {...item}>{item.children || '操作'}</Button>
//             )}
//             {isBack && <Button htmlType="button" onClick={history.goBack}>返回</Button>}
//           </div>
//         </div>
//       </Affix>
//     )
//   }
// }

// export default withRouter(ActionBtn)

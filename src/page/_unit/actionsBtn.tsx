import React, { useLayoutEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import { Button, Affix } from 'antd'

export interface IProps {
  target?: any
  actions?: Array<{ [key: string]: any }>
  backUrl?: string,
  isBack?: boolean
  loading?: boolean
}

const ActionBtn = observer((props: IProps) => {
  const { actions = [], isBack = true, target, loading = false, backUrl = '' } = props
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

  const back = () => {
    if (backUrl) {
      history.replace(backUrl)
    } else if (history.length > 1) {
      history.goBack()
    } else {
      history.replace('/')
    }
  }
  return (
    <Affix offsetBottom={0} {...affixProps}>
      <div className="m-page-actions" data-loading={loading}>
        <div className="m-page-actions-btn">
          {actions && actions.map && actions.map((item, index) =>
            item && <Button className='u-detail-Actions-btn' key={index}  {...item}>{item.children || '操作'}</Button>
          )}
          {isBack && <Button htmlType="button" onClick={back}>返回</Button>}
        </div>
      </div>
    </Affix>
  )
}
)
export default ActionBtn

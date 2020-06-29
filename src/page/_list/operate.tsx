import React from 'react'
import { observer } from 'mobx-react-lite'

export interface IProps {
  type: 'row' | 'batch',
  index: number,
  record?: any,
  conf: { [key: string]: any },
  status: any
}

const Operate = (props: IProps) => {
  const { type } = props
  let className = ''
  let btnSize = ''
  if (type === 'row') {
    className = 'm-list-operate'
    btnSize = 'small'
  }
  if (type === 'batch') {
    className = 'u-table-row-selection-btn'
    btnSize = 'middle'
  }
  return null
}

export default observer(Operate)

import React, { Component } from 'react'
import { observer } from 'mobx-react-lite'
import DatePicker from './datePicker'
import dayjs from '../../unit/day'
import { datetime } from '../../unit/date'
import localCn from 'antd/lib/date-picker/locale/zh_CN'
interface IProps {
  value?: string | number,
  format?: string,
  type?: 'num' | 'str'
  onChange?: Function,
}
const RangeTimeStamp = observer((props: IProps) => {
  const { format = 'YYYY-MM-DD HH:mm:ss', onChange, type = 'num', value = '', ...args } = props
  const change = (e: any) => {
    const value = e ? (type === 'str' ? datetime(e, format) : new Date(e.format(format.replace('-', '/'))).getTime()) : ''
    onChange && onChange(value)
  }
  const showTime = type === 'num' && /(HH|mm|ss)/.test(format) ? { defaultValue: dayjs('00:00:00', 'HH:mm:ss') } : false
  const temValue = value ? datetime(value, format) : null
  const newValue = temValue && temValue !== 'Invalid Date' ? dayjs(temValue, format) : null
  return (
    <DatePicker locale={localCn} showTime={showTime} {...args} format={format} value={newValue} onChange={change} />
  )
})
export default RangeTimeStamp
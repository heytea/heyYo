import React from 'react'
import { TimePicker } from 'antd'
import { TimeRangePickerProps } from "antd/lib/time-picker";
import dayjs from '../../unit/day'
import { datetime } from '../../unit/date'
import { observer } from "mobx-react-lite";
import localCn from 'antd/lib/date-picker/locale/zh_CN'

interface IProps extends TimeRangePickerProps {
  start?: string | number,
  end?: string | number,
  format?: string,
  onChange?: any
}

const { RangePicker } = TimePicker
export default observer(function HyRangeDate(props: IProps) {
  const { format = 'HH:mm:ss', onChange, start = '', end = '', locale = localCn } = props
  const change: any = (e: null | Array<any>) => {
    if (onChange) {
      if (e === null) {
        onChange(['', ''])
      } else {
        const start = e[0] ? e[0].format(format) : ''
        const end = e[1] ? e[1].format(format) : ''
        onChange([start, end])
      }
    }

  }
  const value: any = [null, null]
  if (start) {
    const startDate = datetime(start, format)
    if (!isNaN(Date.parse(startDate))) {
      value[0] = dayjs(startDate, format)
    }
  }
  if (end) {
    const endDate = datetime(end, format)
    if (!isNaN(Date.parse(endDate))) {
      value[1] = dayjs(endDate, format)
    }
  }
  return (
    <RangePicker format={format} value={value} onChange={change} locale={locale} />
  )
})
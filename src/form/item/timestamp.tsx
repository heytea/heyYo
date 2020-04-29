import React, { Component } from 'react'
import { DatePicker, message } from 'antd'
import moment from 'moment'
import { datetime } from '../../unit/date'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

interface IProps {
  value?: string | number
  format?: string
  onChange?: Function
  disabledBeforeToday?: boolean
  disabledDate?: (current: moment.Moment | undefined) => boolean
  disabled?: boolean
}

export default class RangeTimeStamp extends Component<IProps> {
  change = (date: any, dateString: any) => {
    const { onChange } = this.props
    onChange && onChange(dateString)
  }

  getDisabledDate = () => {
    const { disabledBeforeToday = false, disabledDate } = this.props
    if (disabledDate) return disabledDate
    if (disabledBeforeToday)
      return (current: moment.Moment | undefined): boolean | undefined => {
        if (!current) return
        return current && current < moment().startOf('day')
      }
  }

  render() {
    const {
      format = 'YYYY-MM-DD HH:mm:ss',
      value = '',
      disabled = false
    } = this.props
    const date = moment(datetime(value), format)
    const disabledDate: any = this.getDisabledDate()
    const _value: any = date.isValid() ? date : undefined
    return (
      <DatePicker
        showTime
        format={format}
        disabled={disabled}
        disabledDate={disabledDate}
        value={_value}
        onChange={this.change}
      />
    )
  }
}

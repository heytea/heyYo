import React, { Component } from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'
import { datetime } from '../../unit/date'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

interface IProps {
  value?: string | number,
  format?: string,
  onChange?: Function,
}

export default class RangeTimeStamp extends Component<IProps> {
  change = (e: any) => {
    const { format = 'YYYY-MM-DD HH:mm:ss', onChange } = this.props
    const value = e ? new Date(e.format(format.replace('-', '/'))).getTime() : ''
    onChange && onChange(value)
  }

  render() {
    const { format = 'YYYY-MM-DD HH:mm:ss', value = '' } = this.props
    return (
      <DatePicker showTime format={format} value={moment(datetime(value), format) || null} onChange={this.change}/>
    )
  }
}

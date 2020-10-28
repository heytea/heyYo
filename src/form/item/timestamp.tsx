import React, { Component } from 'react'
import DatePicker from './datePicker'
import dayjs from 'dayjs'
import { datetime } from '../../unit/date'

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
      // @ts-ignore
      <DatePicker showTime format={format} value={dayjs(datetime(value), format) || null} onChange={this.change}/>
    )
  }
}

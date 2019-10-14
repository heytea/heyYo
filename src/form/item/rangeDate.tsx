import React, { Component } from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'
import { datetime } from '../../unit/date'

interface IProps {
  start?: string | number,
  end?: string | number,
  format?: string,
  showTime?: boolean,
  onChange?: Function
}

const { RangePicker } = DatePicker
export default class RangeDate extends Component<IProps> {
  change = (e: Array<any>) => {
    const { format = 'YYYY-MM-DD', onChange } = this.props
    const start = e[0] ? e[0].format(format) : ''
    const end = e[1] ? e[1].format(format) : ''
    onChange && onChange([start, end])
  }

  render() {
    const { format = 'YYYY-MM-DD', start = '', end = '', showTime = false } = this.props
    const value: Array<any> = [null, null]
    if (start) {
      const startDate = datetime(start, format)
      if (!isNaN(Date.parse(startDate))) {
        value[0] = moment(startDate, format)
      }
    }
    if (end) {
      const endDate = datetime(end, format)
      if (!isNaN(Date.parse(endDate))) {
        value[1] = moment(endDate, format)
      }
    }
    return (
      <RangePicker format={format} showTime={showTime} value={value} onChange={this.change}/>
    )
  }
}

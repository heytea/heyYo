import React from 'react'
import DatePicker from './datePicker'
import { RangePickerProps } from "antd/lib/date-picker";
import dayjs from 'dayjs'
import { datetime } from '../../unit/date'
import { observer } from "mobx-react-lite";

interface IProps {
  start?: string | number,
  end?: string | number,
  format?: string,
  showTime?: boolean,
  onChange?: any
}

const { RangePicker } = DatePicker
export default observer(function HyRangeDate(props: RangePickerProps & IProps) {
  const { format = 'YYYY-MM-DD', onChange, start = '', end = '', showTime = false } = props

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
    <RangePicker format={format} showTime={showTime} value={value} onChange={change}/>
  )
})

// class RangeDate extends Component<IProps> {
//   change = (e: Array<any>) => {
//     const { format = 'YYYY-MM-DD', onChange } = this.props
//     const start = e[0] ? e[0].format(format) : ''
//     const end = e[1] ? e[1].format(format) : ''
//     onChange && onChange([start, end])
//   }
//
//   render() {
//     const { format = 'YYYY-MM-DD', start = '', end = '', showTime = false } = this.props
//     const value: Array<any> = [null, null]
//     if (start) {
//       const startDate = datetime(start, format)
//       if (!isNaN(Date.parse(startDate))) {
//         value[0] = moment(startDate, format)
//       }
//     }
//     if (end) {
//       const endDate = datetime(end, format)
//       if (!isNaN(Date.parse(endDate))) {
//         value[1] = moment(endDate, format)
//       }
//     }
//     return (
//       // @ts-ignore
//       <RangePicker format={format} showTime={showTime} value={value} onChange={this.change} />
//     )
//   }
// }

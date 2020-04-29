import React, {Component} from 'react'
import {DatePicker} from 'antd'
import moment from 'moment'
import {datetime} from '../../unit/date'
import {RangePickerValue} from 'antd/lib/date-picker/interface';

interface IProps {
  start?: string | number,
  end?: string | number,
  format?: string,
  showTime?: boolean,
  disabled?: boolean,
  allowClear?: boolean,
  disabledBeforeToday?: boolean,
  disabledBeforeNotToday?: boolean,
  disabledAfterToday?: boolean,
  disabledDate?: (current: moment.Moment | undefined) => boolean,
  onChange?: Function
}

const {RangePicker} = DatePicker
export default class RangeDate extends Component<IProps> {
  change = (e: Array<any>, dateStrings: [string, string]) => {
    const {onChange} = this.props
    const [start, end] = dateStrings;
    onChange && onChange([start, end]);
  }
  getDisabledDate = (): ((current: moment.Moment | undefined) => boolean) | undefined => {
    const {disabledBeforeToday, disabledDate, disabledAfterToday, disabledBeforeNotToday} = this.props;
    if (disabledDate) return disabledDate;
    if (disabledBeforeToday) return ((current: moment.Moment | undefined): boolean => {
      if (!current) return true;
      return current && current < moment().startOf('day');
    });
    if (disabledAfterToday) return ((current: moment.Moment | undefined): boolean => {
      if (!current) return true;
      return current && current > moment().endOf('day');
    });
    if (disabledBeforeNotToday) return ((current: moment.Moment | undefined): boolean => {//不包括今天
      if (!current) return true;
      return current && current < moment().endOf('day')
    });
  };

  render() {
    const {format = 'YYYY-MM-DD', start = '', end = '', showTime = false, disabled = false, allowClear = true} = this.props;
    const disabledDate = this.getDisabledDate();
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
      <RangePicker format={format} showTime={showTime} value={value} disabled={disabled} onChange={this.change}
                   disabledDate={disabledDate} allowClear={allowClear}/>
    )
  }
}

import React, {Component} from 'react'
import {DatePicker} from 'antd'
import moment from 'moment'
import {datetime} from '../../unit/date'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

interface IProps {
  value?: string | number,
  format?: string,
  onChange?: Function,
  disabled?: boolean,
  disabledBeforeToday?: boolean,
  disabledAfterToday?: boolean,
  disabledBeforeNotToday?: boolean,
  disabledDate?: (current: moment.Moment | undefined | any) => boolean,
  showTime?: any
}

export default class ReDatePicker extends Component<IProps> {
  change = (_val: any, dateString: any) => {
    const {onChange} = this.props
    onChange && onChange(dateString)
  }

  getDisabledDate = () => {
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
    return false
  };

  render() {
    const {format = 'YYYY-MM-DD HH:mm:ss', value, disabled} = this.props
    const newValue = (format === 'YYYYMM' && value) ? `${(value as string).substr(0, 4)}-${(value as string).substr(4, 2)}-01` : value
    const newFormat = format === 'YYYYMM' ? 'YYYY-MM' : format
    const newProps = {
      ...this.props,
      format: newFormat,
      value: newValue ? moment(new Date(datetime(newValue, newFormat))) : undefined,
      placeholder: "请选择",
      onChange: this.change,
    };
    const disabledDate: any = this.getDisabledDate()
    if (newFormat === 'YYYY-MM') {
      return (
        <DatePicker.MonthPicker {...newProps} />
      )
    }
    return (
      <DatePicker {...newProps} disabled={disabled} disabledDate={disabledDate}/>
    )
  }
}

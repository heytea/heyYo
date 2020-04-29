import React, {Component} from 'react'
import {TimePicker} from 'antd';
import moment from 'moment'
import {observer} from "mobx-react";

interface IProps {
  conf?: { props?: { [key: string]: any }, [key: string]: any },
  field?: string,
  onChange: Function,
  values: { [key: string]: any }
  minuteStep?: number
}

@observer
export default class TimePick extends Component<IProps> {
  onChange = (_time: moment.Moment, timeString: string, type: string) => {
    const {field = '', onChange} = this.props;
    const values = {};
    const [startKey, endKey] = field.split(',');
    if (type === 'start') {
      values[startKey] = timeString
    } else if (type === 'end') {
      values[endKey] = timeString;
    }
    onChange(values);
  };

  render() {
    const {conf: {props = {}} = {}, field = '', values, minuteStep = 1} = this.props;
    const {format = 'HH:mm'} = props;
    const [startKey, endKey] = field.split(',');
    const wrapClass = ['m-timer-picker-range'];
    const startTime = moment(values[startKey], format);
    const endTime = moment(values[endKey], format);
    props.disabled && wrapClass.push('m-timer-picker-range-disabled');
    return <div className={wrapClass.join(' ')}>
      <TimePicker minuteStep={minuteStep} value={startTime.isValid() ? startTime : undefined}
                  onChange={(time, timeString) => this.onChange(time, timeString, 'start')}
                  format={format} {...props} />~
      <TimePicker minuteStep={minuteStep} value={endTime.isValid() ? endTime : undefined} onChange={(time, timeString) => this.onChange(time, timeString, 'end')}
                  format={format} {...props}/>
    </div>
  }
}


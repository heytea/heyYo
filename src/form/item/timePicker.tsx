import { Dayjs } from 'dayjs';
import * as React from 'react';
import DatePicker from './datePicker';
import { PickerTimeProps } from 'antd/es/date-picker/generatePicker';
import { Omit } from 'antd/es/_util/type';
import localCn from 'antd/lib/date-picker/locale/zh_CN'

export interface TimePickerProps extends Omit<PickerTimeProps<Dayjs>, 'picker'> {
}

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
  return <DatePicker locale={localCn} {...props} picker="time" mode={undefined} ref={ref} />;
});

TimePicker.displayName = 'TimePicker';

export default TimePicker;
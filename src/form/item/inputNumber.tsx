import React, {Component} from 'react'
import {InputNumber} from 'antd'
import {InputNumberProps} from 'antd/lib/input-number'

export interface IProps extends InputNumberProps {
  icon?: string,
  onChange?: any
}

export default class extends Component<IProps, any> {
  change = (value: any) => {
    const {onChange} = this.props;
    onChange && onChange(value);
  };

  render() {
    return <InputNumber type='number' min={0} precision={0} {...this.props} onChange={this.change}/>
  }
}

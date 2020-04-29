import Input from './input';
import React, {Component} from "react";
import {observer} from "mobx-react";

interface IProps {
  [key: string]: any
}

@observer
export default class RangeDate extends Component<IProps> {
  minChange = (value: any) => {
    const {field, onChange} = this.props;
    const [start] = field.split(',');
    onChange({[start]: value});
  };
  maxChange = (value: any) => {
    const {field, onChange} = this.props;
    const [, end] = field.split(',');
    onChange({[end]: value});
  };

  render() {
    const style = {width: '100px'};
    const {field, values} = this.props;
    const [start, end] = field.split(',');
    return <div>
      <Input value={values[start]} onChange={this.minChange} style={style}/>
      <span style={{margin: '0 10px', display: 'inline-block'}}>至</span>
      <Input value={values[end]} onChange={this.maxChange} style={style}/>
    </div>
  }
}

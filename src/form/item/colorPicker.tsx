import React, { Component } from 'react';
import { ChromePicker } from 'react-color';

interface ColorPickerProps {
  value?: string;
  onChange: Function;
}

export default class ColorPicker extends Component<ColorPickerProps> {
  render() {
    const {
      value,
      onChange,
    } = this.props;
    return <ChromePicker color={value} onChangeComplete={(color: any) => onChange(color.hex)} />;
  }
}

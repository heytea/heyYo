import React, { Component } from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'
import { TextAreaProps } from 'antd/lib/input/TextArea'

export interface IProps extends TextAreaProps {
  icon?: string,
  onChange?: any,
}

export default class ReInput extends Component<IProps> {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
  }
  static defaultProps = {
    value: '',
    onChange: () => ''
  }

  change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { onChange } = this.props
    const value = e.target.value
    onChange && onChange(value)
  }

  render() {
    return <Input.TextArea {...this.props} onChange={this.change} />
  }
}

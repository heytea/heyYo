import { Component } from 'react'

export interface IProps {
  value?: string | number,
  startLen?: number,
  endLen?: number,
  sign?: string,
}

export default class PhoneEncrypt extends Component<IProps> {
  render() {
    const { value = '', startLen = 3, endLen = 4, sign = '****' } = this.props
    const newValue = value + ''
    return newValue ? newValue.substr(0, startLen) + sign + newValue.substr(-endLen) : ''
  }
}

import { Component } from 'react'

interface IProps {
  value?: string | number,
  startLen?: number,
  endLen?: number,
  sign?: string,
}

export default class IdCardEncrypt extends Component<IProps> {
  render() {
    const { value = '', startLen = 6, endLen = 6, sign = '******' } = this.props
    const newValue = value + ''
    return newValue ? newValue.substr(0, startLen) + sign + newValue.substr(-endLen) : ''
  }
}

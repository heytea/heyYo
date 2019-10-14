import { Component } from 'react'

interface IProps {
  value?: string | number,
  sign?: string
  fixed?: number
}

export default class Currency extends Component<IProps> {
  render() {
    const { value = '', sign = '¥ ', fixed = 2 } = this.props
    if (!value) {
      return ''
    }
    const p = (+value).toFixed(fixed).split('.')
    return sign + p[0].replace(/(?!^)(?=(\d{3})+$)/g, ',') + '.' + p[1]
  }
}

import { Component } from 'react'
import { datetime } from '../unit/date'

interface IProps {
  value?: string | number | Date,
  format?: string,
  accurate?: string
}

export default class Datetime extends Component<IProps> {
  render() {
    const { value = new Date(), format = 'YYYY-MM-DD HH:mm:ss', accurate = 'second' } = this.props
    if (accurate === 'second' && /\d{10}/.test(value + '')) {
      // @ts-ignore
      return datetime(value *1000, format)
    }
    return datetime(value, format)
  }
}

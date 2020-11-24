import { datetime } from '../unit/date'

interface IProps {
  value?: string | number | Date,
  format?: string,
  accurate?: string
}

export default function Datetime(props: IProps) {
  const { value = '', format = 'YYYY-MM-DD HH:mm:ss', accurate = 'second' } = props
  if (accurate === 'second' && /\d{10}/.test(value + '')) {
    return datetime(Number(value) * 1000, format)
  }
  return datetime(value, format)
}

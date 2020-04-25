interface IProps {
  value?: string | number,
  sign?: string
  fixed?: number
}

export default function Currency(props: IProps) {
  const { value = '', sign = '¥ ', fixed = 2 } = props
  if (!value) {
    return ''
  }
  const p = (+value).toFixed(fixed).split('.')
  return sign + p[0].replace(/(?!^)(?=(\d{3})+$)/g, ',') + '.' + p[1]
}

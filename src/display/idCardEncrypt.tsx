interface IProps {
  value?: string | number,
  startLen?: number,
  endLen?: number,
  sign?: string,
}

export default function IdCardEncrypt(props: IProps) {
  const { value = '', startLen = 6, endLen = 6, sign = '******' } = props
  const newValue = value + ''
  return newValue ? newValue.substr(0, startLen) + sign + newValue.substr(-endLen) : ''
}
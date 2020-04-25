export interface IProps {
  value?: string | number,
  startLen?: number,
  endLen?: number,
  sign?: string,
}

export default function PhoneEncrypt(props: IProps) {
  const { value = '', startLen = 3, endLen = 4, sign = '****' } = props
  const newValue = value + ''
  return newValue ? newValue.substr(0, startLen) + sign + newValue.substr(-endLen) : ''
}

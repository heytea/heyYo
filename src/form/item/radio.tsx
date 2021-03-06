import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { Radio } from 'antd'
import LangContent from "../../lang";

const OptionComponents = {
  radio: Radio,
  button: Radio.Button
}

interface IProps {
  value?: string | number,
  isAll?: boolean,
  data?: { [key: string]: any } | Array<any>,
  type?: 'radio' | 'button',
  valKey?: string,
  labelKey?: string,
  onChange?: Function
}

// data 支持
// data = { 1: 'name1', 2: 'name2' }
// data = { 1: { name: 'name1' }, 2: { name: 'name2' } } // valKey 不填 取 key
// data = { 1: { id: 1, name: 'name1' }, 2: { id: 2, name: 'name2' } } // valKey = 'id' labelKey = 'name'
// data = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }] // valKey = 'id' labelKey = 'name'
export default function HyRadio(props: IProps) {
  const lang = useContext(LangContent)
  const { value = '', data = [], isAll = false, onChange = () => '', type = 'radio', valKey = 'id', labelKey = 'name' } = props
  const [c, setC]: [ReactNode, Function] = useState(null)
  useEffect(() => {
    const OptionComponent = OptionComponents[type] || Radio
    const tmpC = (<>
      {isAll && <OptionComponent key={''} value="">{lang.all}</OptionComponent>}
      {(data && typeof data === 'object') && (data instanceof Array ?
        data.map((item) => { // 数组
          const value = item[valKey || 'id']
          const label = item[labelKey]
          return (<OptionComponent key={value} value={value + ''} disabled={item.disabled}>{label}</OptionComponent>)
        }) :
        Object.keys(data).map((key) => { // 对像
          if (typeof data[key] !== 'object') {
            return (<OptionComponent key={key} value={key}>{data[key]}</OptionComponent>)
          } else {
            const obj = data[key]
            const value = valKey ? obj[valKey] : key
            const label = obj[labelKey]
            return (<OptionComponent key={value} value={value + ''}>{label}</OptionComponent>)
          }
        }))
      }
    </>)
    setC(tmpC)
  }, [data, type, valKey, labelKey])
  return <Radio.Group value={value + ''} size="large" onChange={(e) => onChange(e)}>{c}</Radio.Group>
}

// class ReRadio extends Component<IProps> {
//   static defaultProps = {
//     value: ''
//   }
//
//   render() {
//     const { value, data = [], isAll = false, onChange = () => '', type = 'radio', valKey = 'id', labelKey = 'name' } = this.props
//     const OptionComponent = OptionComponents[type] || Radio
//     return (
//       <Radio.Group value={value + ''} size="large" onChange={(e) => onChange(e)}>
//         {isAll && <OptionComponent key={''} value="">全部</OptionComponent>}
//         {(data && typeof data === 'object') && (data instanceof Array ?
//           data.map((item) => { // 数组
//             const value = item[valKey || 'id']
//             const label = item[labelKey]
//             return (<OptionComponent key={value} value={value + ''} disabled={item.disabled}>{label}</OptionComponent>)
//           }) :
//           Object.keys(data).map((key) => { // 对像
//             if (typeof data[key] !== 'object') {
//               return (<OptionComponent key={key} value={key}>{data[key]}</OptionComponent>)
//             } else {
//               const obj = data[key]
//               const value = valKey ? obj[valKey] : key
//               const label = obj[labelKey]
//               return (<OptionComponent key={value} value={value + ''}>{label}</OptionComponent>)
//             }
//           }))
//         }
//       </Radio.Group>
//     )
//   }
// }

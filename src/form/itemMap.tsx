import Input from './item/input'
import Password from './item/password'
import { InputNumber } from 'antd'
import Checkbox from './item/checkbox'
import Radio from './item/radio'
import Select from './item/select'
import SelectRemote from './item/selectRemote'
import TextArea from './item/textArea'
import ImgCaptcha from './item/imgCaptcha'
import Captcha from './item/captcha'
import SelectTree from './item/selectTree'
import Tree from './item/tree'
import Cascader from './item/cascader'
import Timestamp from './item/timestamp'
import RangeDate from "./item/rangeDate";
import React from "react";
import { observer } from 'mobx-react-lite'

export interface HyRangeDateApProps {
  conf?: { props?: Object, [key: string]: any },
  field?: string,
  onChange: Function,
  onChangeForm: Function,
  values: { [key: string]: any }
}

export const HyRangeDateAp = ({ conf: { props = {} } = {}, field = '', onChangeForm, values }: HyRangeDateApProps) => {
  const [startKey, endKey] = field.split(',')
  // @ts-ignore
  return <RangeDate {...props} start={values[startKey]} end={values[endKey]} onChange={(val: string[]) => {
    values[startKey] = val[0]
    values[endKey] = val[1]
    onChangeForm(values)
  }}/>
}

const itemMap: { [key: string]: any } = {
  input: Input,
  password: Password,
  inputNumber: InputNumber,
  checkbox: Checkbox,
  radio: Radio,
  select: Select,
  selectRemote: SelectRemote,
  textArea: TextArea,
  imgCaptcha: ImgCaptcha,
  captcha: Captcha,
  selectTree: SelectTree,
  tree: Tree,
  cascader: Cascader,
  timestamp: Timestamp,
  rangeDate: observer(HyRangeDateAp)
}
export default itemMap

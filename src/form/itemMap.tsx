import Input from './item/input'
import { InputNumber } from 'antd'
import Checkbox from './item/checkbox'
import Radio from './item/radio'
import Select from './item/select'
import SelectRemote from './item/selectRemote'
import TextArea from './item/textArea'
import ImgCaptcha from './item/imgCaptcha'
import Captcha from './item/captcha'
import SelectTree from "./item/selectTree";
import Tree from "./item/tree";

const itemMap: { [key: string]: any } = {
  input: Input,
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
}
export default itemMap

import { FormInstance } from 'antd/lib/form'

export interface IRule {
  [key: string]: any
}

export interface IMessages {
  [key: string]: string
}

const patternMap = {
  name: /^[a-zA-Z0-9\u4e00-\u9fa5]{6,16}$/,
  realName: /^[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]{2,5}(?:·[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]{2,5})*$/,
  phone: /(13\d|14[57]|15[^4,\D]|17[13678]|18\d)\d{8}$|170[0589]\d{7}$/,
  mail: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
  password: /[\w\d~'!@#￥$%^&*|{}\][)(-?"+_=:`]{8,16}/,
  captcha: /[\d]{6}/,
  imgCaptcha: /^[\d\w]{4}$/,
  url: /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/,
  chinese: /^[\u4e00-\u9fa5]+$/,
  amount: /^\d+(\.\d{1,2})?$/
}

const partFn = (name: string, messages: IMessages) => patternMap[name] ? {
  pattern: patternMap[name],
  message: messages[name]
} : {}

const partFnMap = {}
Object.keys(patternMap).forEach((key: string) => {
  partFnMap[key] = (from: FormInstance, rule: IRule, messages: IMessages) => partFn(key, messages)
})
export default {
  ...partFnMap,
  equals: (form: FormInstance, rule: { [key: string]: any }, messages: IMessages) => {
    return {
      validator: async (r: any, v: any,) => {
        if (typeof form.getFieldValue(rule.field) !== 'undefined' && form.getFieldValue(rule.field) !== v) {
          throw new Error(messages.equals)
        }
      }
    }
  },
  phoneOrMail: (form: FormInstance, rule: { [key: string]: any }, messages: IMessages) => {
    return {
      validator: async (r: any, v: any,) => {
        if (!(patternMap.phone.test(v) || patternMap.mail.test(v))) {
          throw new Error(messages.phoneOrMail)
        }
      }
    }
  },
  nameOrPhoneOrMail: (form: FormInstance, rule: { [key: string]: any }, messages: IMessages) => {
    return {
      validator: async (r: any, v: any,) => {
        if (!(patternMap.name.test(v) || patternMap.phone.test(v) || patternMap.mail.test(v))) {
          throw new Error(messages.nameOrPhoneOrMail)
        }
      }
    }
  }
}

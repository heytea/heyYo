export interface IRule {
  fn?: Function,
  msg?: Function | string,
  reg?: RegExp
}

export interface IVal {
  rules: { [key: string]: IRule },

  checkRule({}): string
}

const getDfMsg = (name: string) => `${name} 格式不正确`
export default class Validator implements IVal {
  rules: { [key: string]: IRule, name: { reg: RegExp, msg: string }, phone: { reg: RegExp, msg: string }, mail: { reg: RegExp, msg: string } } = {
    required: {
      fn: ({ value = '' }: any = {}) => !(value === null || value === undefined || value === ''),
      msg: '{name} 不能为空'
    },
    name: {
      reg: /^[a-zA-Z0-9\u4e00-\u9fa5]{6,16}$/,
      msg: getDfMsg('用户名')
    },
    realName: {
      reg: /^[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]{2,5}(?:·[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]{2,5})*$/,
      msg: getDfMsg('姓名')
    },
    phone: {
      reg: /(13\d|14[57]|15[^4,\D]|17[13678]|18\d)\d{8}$|170[0589]\d{7}$/,
      msg: getDfMsg('手机号')
    },
    mail: {
      reg: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      msg: getDfMsg('邮箱')
    },
    nameOrPhoneOrMail: {
      fn: ({ value = '' }: { value?: string } = {}) => {
        const { name, phone, mail } = this.rules

        return name.reg.test(value) || phone.reg.test(value) || mail.reg.test(value)
      },
      msg: getDfMsg('用户名/手机/邮箱')
    },
    phoneOrMail: {
      fn: ({ value = '' }: any = {}) => {
        const { phone, mail } = this.rules
        return phone.reg.test(value) || mail.reg.test(value)
      },
      msg: getDfMsg('手机/邮箱')
    },
    password: {
      reg: /[\w\d~'!@#￥$%^&*|{}\][)(-?"+_=:`]{8,16}/,
      msg: '请输入8-16位的英文/数字'
    },
    captcha: {
      reg: /[\d]{6}/,
      msg: '验证码 必须为六位数字'
    },
    imgCaptcha: { reg: /^[\d\w]{4}$/, msg: '请输入四位数字/字母' },
    url: {
      reg: /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/,
      msg: getDfMsg('链接')
    },
    number: { reg: /^[\d]+$/, msg: '只允许数字' },
    chinese: { reg: /^[\u4e00-\u9fa5]+$/, msg: '只允许中文' },
    amount: { reg: /^\d+(\.\d{1,2})?$/, msg: getDfMsg('金额') },
    length: {
      fn: ({ value = '', param = {} }: { value?: string, param?: { min?: number, max?: number } } = {}) => {
        const { min, max } = param
        const isMin = !(typeof min === 'number' && value.length < min)
        const isMax = !(typeof max === 'number' && value.length > max)
        return isMin && isMax
      },
      msg: ({ param = {} }: { param?: { min?: number, max?: number } } = {}) => {
        if (typeof param === 'number') {
          return `长度需要等于${param}`
        }
        const { min, max } = param
        const isMin = typeof min === 'number'
        const isMax = typeof max === 'number'
        if (isMin && isMax) {
          return `长度需要在 ${isMin} - ${isMax} 之间`
        }
        if (isMin) {
          return `长度不能小于${isMin}`
        }
        if (isMin) {
          return `长度不能大于${isMax}`
        }
        return '校验参数有误'
      }
    },
    equals: {
      fn: ({ value = '', form = {}, param = { field: '' } }: { value?: string, form?: { [key: string]: any }, param?: { field: string } } = {}) => {
        return param.field && value === form[param.field]
      },
      msg: ({ param = { enter: '输入', equal: '确认字段', original: '' } }: any = {}) => `${param.original}与${param.equal}不一致`
    }
  }

  constructor({ rules = {} } = {}) {
    this.rules = {
      ...this.rules,
      ...rules
    }
  }

  checkRule = ({ rule = '', value, form, param, aliasName }: { rule?: string, value?: string | number, form?: Object, param?: Object, aliasName?: string }) => {
    let isErr = false
    const ruleObj = this.rules[rule]
    if (ruleObj) {
      const { fn, reg, msg = '' } = ruleObj
      if (typeof fn === 'function') {
        if (!fn({ value, form, param })) {
          isErr = true
        }
      }
      if (reg && reg.test && !reg.test((value || '') + '')) {
        isErr = true
      }
      if (isErr) {
        if (typeof msg === 'string') {
          return msg.replace('{name}', aliasName || '')
        }
        if (typeof msg === 'function') {
          return msg({ param })
        }
      }

    }
    return ''
  }

  check = ({ value, ruleObj = {}, form = {} }: { value?: string | number, ruleObj?: { aliasName?: string, [key: string]: any }, form?: { [key: string]: string | number } } = {}) => {
    let err = ''
    let ruleArr = []
    const { rules, aliasName = '' } = ruleObj
    if (typeof rules === 'string') {
      ruleArr = rules.split('|')
      for (let i = 0; i < ruleArr.length; i += 1) {
        err = this.checkRule({ rule: ruleArr[i], value, form, aliasName })
        if (err) {
          break
        }
      }
    } else if (typeof rules === 'object') {
      const ruleNameArr = Object.keys(rules)
      for (let i = 0; i < ruleNameArr.length; i += 1) {
        const ruleName = ruleNameArr[i]
        const param = rules[ruleName]
        err = this.checkRule({ rule: ruleName, param, value, form, aliasName })
        if (err) {
          break
        }
      }
    } else if (typeof rules === 'function') {
      err = rules({ value, form })
    }
    return err
  }
}

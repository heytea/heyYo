import React from 'react'

const typeTemplate = "'${name}' 不是有效的 ${type}";
export const lang = {
  please_choose: '请选择',
  captcha: '验证码',
  get_captcha: '获取验证码',
  update_captcha: '更新验证码',
  page_error: '页面出错',
  error_message: '错误信息',
  contact_admin: '请联系系统管理员',
  all: '全部',
  out: '退出',
  validateMessages: {
    default: "校验失败",
    required: "必填项 不能为空",
    enum: "'必须是 [${enum}] 之一",
    whitespace: "不能为空",
    date: {
      format: "日期格式无效",
      parse: "无法解析为日期",
      invalid: "无效的日期",
    },
    types: {
      string: typeTemplate,
      method: typeTemplate,
      array: typeTemplate,
      object: typeTemplate,
      number: typeTemplate,
      date: typeTemplate,
      boolean: typeTemplate,
      integer: typeTemplate,
      float: typeTemplate,
      regexp: typeTemplate,
      email: typeTemplate,
      url: typeTemplate,
      hex: typeTemplate,
    },
    string: {
      len: "字符串长度必须等于 ${len}",
      min: "'字符串长度不能小于${min}",
      max: "字符串长度不能大于 ${max}",
      range: "字符串长度必须介于 ${min} 和 ${max} 之间",
    },
    number: {
      len: "必须等于 ${len}",
      min: "不能小于 ${min}",
      max: "不能大于 ${max}",
      range: "必须介于 ${min} 和 ${max} 之间",
    },
    array: {
      len: "长度必须等于 ${len}",
      min: "'长度不能小于${min}",
      max: "长度不能大于 ${max}",
      range: "长度必须介于 ${min} 和 ${max} 之间",
    },
    pattern: {
      mismatch: "与正则 ${pattern} 不匹配",
    },
    equals: '两次输入不一致',
    name: '用户名必须由6-16位数字/字母/中文组成',
    phone: '手机必须由11位数字组成',
    mail: '邮箱格式不正确',
    phoneOrMail: '手机/邮箱格式不正确',
    nameOrPhoneOrMail: '用户名/手机/邮箱格式不正确',
    captcha: '验证码必须为6位数字',
    imgCaptcha: '图形验证码必须为4位数字/字母',
    password: '请输入8-16位的英文/数字',
    url: '链接格式不正确',
    chinese: '只允许中文',
    amount: '金额格式不正确',
  }
}

export default React.createContext(lang)

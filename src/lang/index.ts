import React from 'react'

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
    number: '只允许数字',
    amount: '金额格式不正确',
  }
}

export default React.createContext(lang)
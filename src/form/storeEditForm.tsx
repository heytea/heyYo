import React, { useContext, useEffect, useState } from 'react'
import { observer, } from 'mobx-react-lite'
import EditFrom from './editForm'
import { UIContext } from '../index'
import ruleMap from '../unit/validators'
import { FormInstance } from 'antd/lib/form'
import LangContext from '../lang'
import EditForm from "./editForm";
import PageTips from "../page/_unit/pageTips";

const ruleKeys = Object.keys(ruleMap)

const StoreEditForm = observer(function ({ store, pageType, name, onSubmit, children = null, onChange: onFormChange }: any) {
  const [fieldsConf, setFieldsConf]: [any[], Function] = useState([])
  const [blocksConf, setBlocksConf]: [any[], Function] = useState([])
  const lang = useContext(LangContext)
  const { isMobile } = useContext(UIContext)
  const [layout, setLayout] = useState('horizontal')
  const { fieldsConf: fields } = store
  const form = store[`${name}Form`]
  const page = store[`${name}Page`]
  const status = store[`${name}Status`]
  const errs = store[`${name}Errs`]
  const { formProps = {} } = page
  const onChange = (valObj: { [key: string]: any }) => {
    store.setForm({ form, valObj })
    onFormChange && onFormChange(form)
  }
  const fieldsChange = (fields: any) => {
    const errsObj: { [key: string]: string[] | string } = {}
    fields?.forEach((field: any) => {
      const { name, errors } = field
      name?.forEach((key: string) => {
        errsObj[key] = errors
      })
    })
    store.setErrs(name, errsObj)
  }
  const getFieldConf = (field: string) => {
    const { dependencies = [], rules = [], in: type = '', inProps = {}, inTip, inSpan, data = '', title = '' } = fields && fields[field] || {}
    return { type, dependencies, rules: pageType === 'list' ? [] : rules, tip: inTip, props: inProps, span: inSpan, data, title }
  }
  const getFormConf = (form: any[]) => {
    const tmpFieldsConf: any[] = []
    form?.forEach((item: any) => {
      let fieldItem: { [key: string]: any } = {}
      if (typeof item === 'string') {
        fields[item] && (fieldItem = { field: item, ...(getFieldConf(item)) })
      } else if (item.field) {
        fieldItem = { ...(item.conf ? getFieldConf(item.conf) : getFieldConf(item.field) || {}), ...item }
      }
      if (fieldItem.rules) {
        const newRules: Array<{ [key: string]: any }> = []
        fieldItem.rules.forEach((rule: { [key: string]: any }) => {
          let ruleKey = ''
          for (let i = 0; i < ruleKeys.length; i += 1) {
            const tmpKey = ruleKeys[i]
            if (rule[tmpKey]) {
              ruleKey = tmpKey
              break
            }
          }
          if (!ruleKey) {
            newRules.push(rule)
          } else {
            newRules.push(typeof ruleMap[ruleKey] === 'function' ? (form: FormInstance) => ruleMap[ruleKey](form, rule, lang.validateMessages) : ruleMap[ruleKey])
          }
        })
        fieldItem.rules = newRules
      }
      tmpFieldsConf.push(fieldItem)
    })
    return tmpFieldsConf
  }
  useEffect(() => {
    setLayout(isMobile ? 'vertical' : 'horizontal')
  }, [isMobile])
  useEffect(() => {
    setFieldsConf(getFormConf(page?.form))
  }, [fields, page?.form])
  useEffect(() => {
    const tmpBlocks: any[] = []
    page?.blocks?.forEach((item: any) => {
      const { title, style = {}, form, props = {}, describe = '', tips } = item
      tmpBlocks.push({ title, style, props, describe, tips, form: getFormConf(form) })
    })
    setBlocksConf(tmpBlocks)
  }, [fields, page?.blocks])
  return (
    <div>
      {fieldsConf.length > 0 &&
        <EditFrom
          onFieldsChange={fieldsChange}
          data={store.dict}
          layout={layout}
          {...formProps}
          values={form}
          errs={errs}
          fields={fieldsConf}
          loading={status.loading}
          onChange={onChange}
          onFinish={onSubmit}
        >
          {children}
        </EditFrom>}
      {blocksConf.length > 0 && blocksConf.map((item: any, index: number) =>
        <div className="m-blocks-form" key={index} style={item.style || {}}>
          {item.title && <h3 className="title">{item.title}
            {item.describe && <span className="describe">
              {typeof item.describe === 'function' ? item.describe() : item.describe}
            </span>}
          </h3>}
          {item.tips && <PageTips {...item.tips} />}
          <div className="u-block-form">
            <EditForm
              onFieldsChange={fieldsChange}
              data={store.dict}
              layout={layout}
              {...item.props}
              values={form}
              errs={errs}
              fields={item.form}
              loading={status.loading}
              onChange={onChange}
              onFinish={onSubmit}
            />
          </div>
        </div>)}
    </div>
  )
})

export default StoreEditForm

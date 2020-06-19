import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import EditFrom from './editForm'
import { UIContext } from '../index'
import ruleMap from '../unit/validators'
import { FormInstance } from 'antd/lib/form'
import LangContext from "../lang";

const ruleKeys = Object.keys(ruleMap)

const StoreEditForm = observer(function ({ store, name, onSubmit, children = null }: any) {
  if (!name) {
    return null
  }
  const typeConf = store?.getTypeConf(name)
  if (!typeConf) {
    return null
  }
  const { fieldsConf: fields } = store
  const { form = {}, page, status, errs } = typeConf
  const [fieldsConf, setFieldsConf]: [any[], Function] = useState([])
  const lang = useContext(LangContext)
  const { isMobile } = useContext(UIContext)
  const { formProps = {} } = page
  const onChange = (valObj: { [key: string]: any }) => {
    store.setForm({ name, valObj })
  }
  const fieldsChange = (fields: any) => {
    const errsObj: { [key: string]: string[] | string } = {}
    fields?.forEach((field: any) => {
      const { name, errors } = field
      name?.forEach((key: string) => {
        errsObj[key] = errors
      })
    })
    store.setErrs({ name, errs: errsObj })
  }
  const getFieldConf = (field: string) => {
    const { type = '', dependencies = [], rules = [], props = {} } = fields[field] || {}
    return { type, dependencies, rules, props }
  }
  useEffect(() => {
    const tmpFieldsConf: any[] = []
    page?.form?.forEach((item: any) => {
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
    setFieldsConf(tmpFieldsConf)
  }, [fields, page?.form])
  return (
    <EditFrom
      onFieldsChange={fieldsChange}
      data={store.dict}
      layout={isMobile ? 'vertical' : 'horizontal'}
      {...formProps}
      values={form}
      errs={errs}
      fields={fieldsConf}
      loading={status.loading}
      onChange={onChange}
      onFinish={onSubmit}
    >
      {children}
    </EditFrom>
  )
})

export default StoreEditForm

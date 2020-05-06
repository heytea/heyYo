import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import EditFrom from './editForm'
import { Form } from "antd";
import { UIContext } from '../index'

const StoreEditForm = observer(function ({ store, name, onSubmit, children = null }: any) {
  const [formInstance] = Form.useForm()
  if (!name) {
    return null
  }
  const typeConf = store.getTypeConf(name)
  if (!typeConf) {
    return null
  }
  const { fields } = store
  const { form = {}, page, status } = typeConf
  const [fieldsConf, setFieldsConf]: [any[], Function] = useState([])
  const { isMobile } = useContext(UIContext)
  const { formProps = {} } = page
  const onChange = (valObj: { [key: string]: any }) => {
    store.setForm({ name, valObj })
  }
  const valuesChange = () => {
    const fieldsErrs = formInstance.getFieldsError()
    let isSubmit = true
    for (let i = 0; i < fieldsErrs.length; i += 1) {
      const errs = fieldsErrs[i]?.errors || []
      if (errs.length > 0) {
        isSubmit = false
        break
      }
    }
    store.setStatus({ name, status: { submit: isSubmit } })
  }
  useEffect(() => {
    const tmpFieldsConf: any[] = []
    page?.form?.forEach((item: any) => {
      if (typeof item === 'string') {
        fields[item] && tmpFieldsConf.push({ field: item, ...fields[item] })
      } else if (item.field) {
        tmpFieldsConf.push({ ...(item.conf ? fields[item.conf] : fields[item.field] || {}), ...item })
      }
    })
    setFieldsConf(tmpFieldsConf)
  }, [fields, page?.form])
  return (
    <EditFrom
      onValuesChange={valuesChange}
      form={formInstance}
      data={store.dict}
      layout={isMobile ? 'vertical' : 'horizontal'}
      {...formProps}
      values={form}
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
